/**
 * aiProxy.js — client-side helper for AI chat calls.
 *
 * Two paths:
 *   - freellmapi key (freellmapi-…): direct browser → localhost OpenAI-compatible
 *     endpoint (the Vercel proxy cannot reach the user's localhost).
 *   - otherwise: routes through the /api/ai/chat Vercel function so that
 *     no OpenAI key or call exists in client bundles, the server enforces
 *     auth/rate limits/model allow-lists/quotas, and SSE streaming works.
 *
 * Keys are read once from aiKeyStore (localStorage) — never stored server-side.
 */

import { loadAIConfig } from './aiKeyStore.js';

const API_BASE = (typeof import.meta.env === 'object' && import.meta.env)
  ? import.meta.env.VITE_API_BASE_URL || ''
  : '';

export async function callAIProxy({
  messages,
  model = 'gpt-4o-mini',
  stream = false,
  onToken,
  apiKey,
}) {
  const stored = loadAIConfig();
  const key = apiKey || stored.apiKey;
  const headers = { 'Content-Type': 'application/json' };

  let url;
  let bodyModel = model;
  if (key && key.startsWith('freellmapi-')) {
    // freellmapi is OpenAI-compatible but localhost-only, so the browser must
    // call it directly (the Vercel proxy cannot reach the user's localhost).
    // Its model namespace differs from OpenAI's — use the stored model.
    url = `${stored.baseUrl.replace(/\/$/, '')}/chat/completions`;
    headers['Authorization'] = `Bearer ${key}`;
    bodyModel = stored.model;
  } else {
    url = `${API_BASE}/api/ai/chat`;
    if (key) headers['x-openai-api-key'] = key;
  }

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages, model: bodyModel, stream }),
    });
  } catch (err) {
    if (headers.Authorization) {
      throw new Error(
        `Cannot reach freellmapi at ${url}. Is it running? (npx freellmapi setup opencode)`,
      );
    }
    throw err;
  }

  if (!res.ok) {
    let detail;
    try {
      detail = await res.text();
    } catch {
      detail = String(res.status);
    }
    throw new Error(`AI proxy error: ${res.status} ${detail}`);
  }

  // ── Streaming (SSE) ──
  if (stream) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const collected = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content || '';
            collected.push(token);
            if (onToken) onToken(token);
          } catch {
            // skip unparseable SSE lines
          }
        }
      }
    }
    return collected.join('');
  }

  // ── Non-streaming ──
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export default { callAIProxy };
