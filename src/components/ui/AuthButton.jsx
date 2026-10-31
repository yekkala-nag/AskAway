/**
 * AuthButton — optional sign-in / sign-out chrome.
 * Anonymous use stays on localStorage; login is optional and only unlocks sync.
 * Sign-in methods: magic link (email OTP) + one OAuth provider (Google).
 */

import { useState, useEffect, useCallback } from 'react';
import { signInWithMagicLink, signOut, getSession, onAuthStateChange } from '../../lib/supabaseAuth.js';
import { supabase } from '../../lib/supabaseClient.js';
import { initSync, setSupabase, setUserId } from '../../services/sync.js';
import { useToast } from './Feedback.jsx';

export function AuthButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); // { type, text }
  const { show } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await getSession();
      if (mounted) setUser(data.session?.user ?? null);
    })();
    const { data: subscription } = onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setUser(user);
      if (user) {
        try {
          setSupabase(supabase);
          setUserId(user.id);
          await initSync(user.id, supabase);
        } catch (e) {
          // Sync unavailable (e.g. env not configured) — app still works offline.
          show(`Sync unavailable: ${String(e)}`, { type: 'danger', duration: 6000 });
        }
      }
    });
    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const clearMessage = useCallback(() => setMessage(null), []);

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    const { error } = await signInWithMagicLink(email.trim());
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      show(error.message, { type: 'danger', duration: 6000 });
      return;
    }
    setMessage({ type: 'success', text: 'Magic link sent — check your inbox.' });
    show('Magic link sent — check your inbox.');
    setEmail('');
  };

  const handleOAuth = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` }
    });
    if (error) {
      setLoading(false);
      setMessage({ type: 'error', text: error.message });
      show(error.message, { type: 'danger', duration: 6000 });
      return;
    }
    // signInWithOAuth redirects the browser; no return path on success.
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      show(error.message, { type: 'danger', duration: 6000 });
    }
  };

  const clearError = () => setMessage(null);

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
        <span style={{ color: '#4B5563' }}>Signed in as</span>
        <span
          style={{
            color: '#3A9B9F',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '160px'
          }}
        >
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            color: '#4B5563',
            cursor: 'pointer',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 500
          }}
        >
          Sign out
        </button>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block'
          }}
          title="Sync: ready"
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
      {message && (
        <span
          style={{
            color: message.type === 'success' ? '#15803d' : '#b91c1c',
            fontSize: '0.72rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '220px'
          }}
          onClick={clearError}
          title="Dismiss"
        >
          {message.text}
        </span>
      )}
      {!loading && !message ? (
        <>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMagicLink(e)}
            style={{
              width: '150px',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              background: '#fff',
              color: '#1A1D26',
              fontSize: '0.75rem'
            }}
          />
          <button
            onClick={handleMagicLink}
            disabled={!email.trim() || loading}
            style={{
              background: email.trim() ? '#3A9B9F' : '#CBD5E1',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: email.trim() ? 'pointer' : 'not-allowed',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 500
            }}
          >
            Sign in (magic link)
          </button>
        </>
      ) : (
        <span style={{ color: '#6B7280', fontSize: '0.72rem' }}>Sending magic link…</span>
      )}
      <button
        onClick={handleOAuth}
        disabled={loading}
        style={{
          background: '#F0A89A',
          border: 'none',
          borderRadius: '6px',
          color: '#7A2E1F',
          cursor: loading ? 'not-allowed' : 'pointer',
          padding: '4px 10px',
          fontSize: '0.72rem',
          fontWeight: 600,
          marginLeft: '6px'
        }}
        title="Sign in with Google (configure OAuth credentials in Supabase dashboard)"
      >
        Google
      </button>
    </div>
  );
}
