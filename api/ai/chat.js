/**
 * api/ai/chat — Vercel serverless function proxying OpenAI Chat Completions.
 *
 * Routes:
 *   POST /api/ai/chat  { messages, model?, stream?, max_tokens? }
 *
 * Auth model:
 *   - Platform-key path (server OPENAI_API_KEY): requires a valid Supabase JWT
 *     in the Authorization header. The JWT is decoded (sub extracted) for
 *     per-user rate limiting; data access stays protected by RLS.
 *   - User-supplied key path (x-openai-api-key header): no auth required,
 *     per-IP rate limit only. The key is never stored server-side.
 *
 * Every response sets explicit Cache-Control. This route is uncached
 * (no-store) because it is a dynamic AI proxy; caching LLM outputs would
 * return stale/non-deterministic results.
 */

import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import {
  checkIpRateLimit,
  decodeJwtSub,
  checkUserBudget,
  recordUsage,
} from '../_lib/rateLimit.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ALLOWED_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];
const MAX_PAYLOAD_BYTES = 256 * 1024; // 256 KB request cap
const MAX_OUTPUT_TOKENS = 4096;       // max_tokens cap
const DEFAULT_MAX_TOKENS = 1000;

export const config = {
  runtime: 'nodejs22.x',
  // Vercel Hobby serverless functions have a ~60s maxDuration; SSE streams
  // that run longer will be cut off by the platform, which is acceptable for
  // this free-tier design.
  maxDuration: 60,
};

function sendJson(res, status, payload) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-openai-api-key',
  );
  res.setHeader('Cache-Control', 'no-store'); // uncached: dynamic AI proxy

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
    return;
  }

  // ── Client IP (for per-IP rate limit) ──
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (forwarded ? forwarded.split(',')[0] : null)
    || req.socket?.remoteAddress
    || 'unknown';

  // ── Per-IP rate limit ──
  const ipLimit = checkIpRateLimit(ip);
  if (!ipLimit.allowed) {
    sendJson(res, 429, {
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: ipLimit.retryAfter,
    });
    return;
  }

  // ── Parse + validate body ──
  let raw;
  try {
    raw = await readBody(req);
    if (raw.length > MAX_PAYLOAD_BYTES) {
      sendJson(res, 413, { error: 'Payload too large. Max 256 KB.' });
      return;
    }
  } catch {
    sendJson(res, 400, { error: 'Failed to read request body.' });
    return;
  }

  let body;
  try {
    body = JSON.parse(raw.toString());
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON body.' });
    return;
  }

  const { messages, model = 'gpt-4o-mini', stream = false, max_tokens } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    sendJson(res, 400, { error: 'messages is required and must be a non-empty array.' });
    return;
  }
  if (!ALLOWED_MODELS.includes(model)) {
    sendJson(res, 400, {
      error: `Model not allowed. Allowed models: ${ALLOWED_MODELS.join(', ')}.`,
    });
    return;
  }
  const cappedMaxTokens = Math.min(Math.max(max_tokens || DEFAULT_MAX_TOKENS, 1), MAX_OUTPUT_TOKENS);

  // ── Auth: extract Supabase JWT (if present) ──
  let userId = null;
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const sub = decodeJwtSub(token);
    if (sub) userId = sub; // decode-only; RLS + Supabase auth protect data
  }

  // ── Per-user daily budget (authenticated users only) ──
  if (userId) {
    try {
      const supabase = getSupabaseAdmin();
      const budget = await checkUserBudget(supabase, userId);
      if (!budget.allowed) {
        sendJson(res, 429, {
          error: 'Daily AI quota exceeded. Please try again tomorrow.',
        });
        return;
      }
    } catch (err) {
      // Budget check failure is not fatal; proceed but don't record usage.
      // (Supabase may be paused on the free tier.)
    }
  }

  // ── Resolve OpenAI key: platform key (requires auth) or user-supplied key ──
  const userSuppliedKey = req.headers['x-openai-api-key'];
  let openaiKey = OPENAI_API_KEY;
  let usingPlatformKey = true;

  if (!OPENAI_API_KEY) {
    if (!userSuppliedKey) {
      sendJson(res, 500, {
        error: 'AI proxy not configured. Set OPENAI_API_KEY or provide your own key via the x-openai-api-key header.',
      });
      return;
    }
    openaiKey = userSuppliedKey;
    usingPlatformKey = false;
  }

  if (usingPlatformKey && !userId) {
    sendJson(res, 401, {
      error:
        'Authentication required to use the platform AI key. Sign in, or provide your own API key via the x-openai-api-key header.',
    });
    return;
  }

  // ── Proxy to OpenAI ──
  let openaiRes;
  try {
    openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
        max_tokens: cappedMaxTokens,
        temperature: 0.7,
      }),
    });
  } catch (err) {
    sendJson(res, 502, { error: 'Failed to reach OpenAI API.', detail: String(err) });
    return;
  }

  if (!openaiRes.ok) {
    let detail;
    try {
      detail = await openaiRes.text();
    } catch {
      detail = String(openaiRes.status);
    }
    sendJson(res, openaiRes.status, { error: `OpenAI API error: ${openaiRes.status}`, detail });
    return;
  }

  // ── Streaming (SSE) ──
  if (stream && openaiRes.body) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no'); // disable proxy buffering

    const reader = openaiRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              continue;
            }
            res.write(`data: ${data}\n\n`);
          }
        }
      }
    } finally {
      res.end();
    }
    return;
  }

  // ── Non-streaming: parse response, record usage ──
  let data;
  try {
    data = await openaiRes.json();
  } catch {
    sendJson(res, 502, { error: 'Invalid response from OpenAI API.' });
    return;
  }

  const content = data.choices?.[0]?.message?.content || '';

  // Record usage (authenticated users only; best-effort)
  if (userId) {
    try {
      const supabase = getSupabaseAdmin();
      const inputTokens = Math.ceil(JSON.stringify(messages).length / 4);
      const outputTokens = Math.ceil(content.length / 4);
      await recordUsage(supabase, userId, inputTokens + outputTokens);
    } catch {
      // Supabase may be paused; usage recording is best-effort.
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store'); // uncached: dynamic AI proxy
  res.status(200).json(data);
}
