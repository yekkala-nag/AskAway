/**
 * rateLimit.js — rate limiting for the AI proxy.
 *
 * Per-user daily budget is tracked in Supabase `ai_usage` (user_id, day,
 * tokens, requests). Per-IP rate limiting uses an in-memory Map (best effort
 * for serverless; persists only within a function instance).
 *
 * Limits are intentionally conservative for the Vercel Hobby / Supabase free
 * tier. Adjust the constants to match your expected traffic.
 */

import { getSupabaseAdmin } from './supabaseAdmin.js';

// ── Limits ──────────────────────────────────────────────────────────────
const DAILY_REQUEST_LIMIT = 50;   // requests per authenticated user per day
const DAILY_TOKEN_LIMIT = 50000;  // tokens per authenticated user per day
const IP_REQUEST_LIMIT = 20;      // requests per IP per minute
const IP_WINDOW_MS = 60000;

// ── Per-IP store (in-memory, best effort) ───────────────────────────────
const ipHits = new Map(); // ip -> { count, resetAt }

export function checkIpRateLimit(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= IP_REQUEST_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true };
}

/** Decode a Supabase JWT payload (no signature verification) to extract sub. */
export function decodeJwtSub(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const payload = JSON.parse(decoded);
    return payload.sub || null;
  } catch {
    return null;
  }
}

/** Check the authenticated user's daily budget in ai_usage. */
export async function checkUserBudget(supabase, userId) {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('ai_usage')
    .select('tokens, requests')
    .eq('user_id', userId)
    .eq('day', today)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;

  const usage = data || { tokens: 0, requests: 0 };
  if (usage.requests >= DAILY_REQUEST_LIMIT) {
    return { allowed: false, reason: 'daily_request_limit' };
  }
  if (usage.tokens >= DAILY_TOKEN_LIMIT) {
    return { allowed: false, reason: 'daily_token_limit' };
  }
  return { allowed: true, usage };
}

/** Record token/request usage for the authenticated user today. */
export async function recordUsage(supabase, userId, tokens) {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('ai_usage')
    .select('tokens, requests')
    .eq('user_id', userId)
    .eq('day', today)
    .maybeSingle();
  const current = data || { tokens: 0, requests: 0 };
  await supabase
    .from('ai_usage')
    .upsert(
      {
        user_id: userId,
        day: today,
        tokens: current.tokens + tokens,
        requests: current.requests + 1,
      },
      { onConflict: 'user_id, day' },
    );
}

export { DAILY_REQUEST_LIMIT, DAILY_TOKEN_LIMIT, IP_REQUEST_LIMIT };
