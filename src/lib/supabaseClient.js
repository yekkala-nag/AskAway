/**
 * supabaseClient.js — client-side Supabase client (anon key only).
 *
 * Hard constraint: only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY may reach
 * the client. The service-role key and OPENAI_API_KEY are server-only and must
 * never be referenced in this file or any client bundle.
 *
 * The client is created lazily (first access) so this module can be imported
 * under `node --test` without env vars present. Auth helpers that need a real
 * client should pass one in explicitly (see supabaseAuth.js).
 */

import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta.env === 'object' && import.meta.env) || {};

let _client = null;

function getClient() {
  if (_client) return _client;
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
        'See .env.example and set them in the Vercel dashboard.',
    );
  }
  _client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return _client;
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    return getClient()[prop];
  },
});

/** Factory for tests and server-side wrappers. Creates a client from explicit keys. */
export function createSupabaseClient(url, key) {
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export default supabase;
