/**
 * supabaseAdmin.js — server-side Supabase admin client (service-role key only).
 *
 * Used by Vercel API functions. The service-role key bypasses RLS and must
 * never reach the client bundle. Import only in serverless functions under api/.
 */

import { createClient } from '@supabase/supabase-js';

let _admin = null;

export function getSupabaseAdmin() {
  if (_admin) return _admin;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
        'Set them in the Vercel dashboard (server-only env vars).',
    );
  }
  _admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return _admin;
}

export default { getSupabaseAdmin };
