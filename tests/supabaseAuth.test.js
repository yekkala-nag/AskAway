import test from 'node:test';
import assert from 'node:assert/strict';
import { createSupabaseClient } from '../src/lib/supabaseClient.js';
import {
  signInWithMagicLink,
  signOut,
  getSession,
  onAuthStateChange,
} from '../src/lib/supabaseAuth.js';

const calls = { signInWithOtp: [], signOut: [], getSession: [] };

function mockSupabase() {
  return {
    auth: {
      signInWithOtp: (...args) => {
        calls.signInWithOtp.push(args);
        return { error: null };
      },
      signOut: (...args) => {
        calls.signOut.push(args);
        return { error: null };
      },
      getSession: (...args) => {
        calls.getSession.push(args);
        return {
          data: { session: { user: { id: 'u1', email: 'a@b.com' } } },
          error: null,
        };
      },
      onAuthStateChange: (cb) => {
        cb('INITIALIZE', { user: { id: 'u1', email: 'a@b.com' } });
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
  };
}

test('signInWithMagicLink calls signInWithOtp with the email', async () => {
  const sb = mockSupabase();
  const { error } = await signInWithMagicLink('a@b.com', sb);
  assert.equal(error, null);
  assert.equal(calls.signInWithOtp.length, 1);
  assert.equal(calls.signInWithOtp[0][0].email, 'a@b.com');
  assert.ok(calls.signInWithOtp[0][0].options.emailRedirectTo);
});

test('signOut calls supabase.auth.signOut', async () => {
  const sb = mockSupabase();
  const { error } = await signOut(sb);
  assert.equal(error, null);
  assert.equal(calls.signOut.length, 1);
});

test('getSession returns the current session user', async () => {
  const sb = mockSupabase();
  const { data } = await getSession(sb);
  assert.equal(data.session.user.id, 'u1');
  assert.equal(data.session.user.email, 'a@b.com');
});

test('onAuthStateChange invokes callback with current session', () => {
  const sb = mockSupabase();
  const events = [];
  const sub = onAuthStateChange((event, session) => {
    events.push({ event, user: session?.user });
  }, sb);
  assert.ok(events.length >= 1);
  assert.equal(events[0].user.email, 'a@b.com');
  sub.data.subscription.unsubscribe();
});
