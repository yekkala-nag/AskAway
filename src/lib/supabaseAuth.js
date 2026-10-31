/**
 * supabaseAuth.js — auth helpers built on the client Supabase client.
 * Anonymous use stays on localStorage; login is optional and only unlocks sync.
 *
 * Each helper accepts an optional `sb` (Supabase client) argument defaulting to
 * the real exported `supabase`. Tests can inject a mock client instead of
 * mocking ESM modules, which keeps tests fast and network-free.
 */

import { supabase } from './supabaseClient.js';

const redirectBase =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

/** Sign in with a magic link sent to the user's email. */
export async function signInWithMagicLink(email, sb = supabase) {
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${redirectBase}/`,
    },
  });
  return { error };
}

/** Sign out the current user. Session and localStorage sync state are cleared by callers. */
export async function signOut(sb = supabase) {
  const { error } = await sb.auth.signOut();
  return { error };
}

/** Get the current session (null when not signed in). */
export function getSession(sb = supabase) {
  return sb.auth.getSession();
}

/** Get the current user (null when not signed in). */
export function getUser(sb = supabase) {
  return sb.auth.getUser();
}

/** Subscribe to auth state changes. Returns a subscription with .unsubscribe(). */
export function onAuthStateChange(callback, sb = supabase) {
  return sb.auth.onAuthStateChange(callback);
}
