// "Sign in with Google" (Google Identity Services). Shows nothing until the
// server has a Google client ID configured (GET /app/config).
import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { ErrorBox } from './ui';

let scriptPromise;
function loadGoogleScript() {
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = resolve;
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error('Could not load Google sign-in'));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export default function GoogleButton({ onSignedIn, signUp }) {
  const box = useRef(null);
  const [clientId, setClientId] = useState(null);
  const [error, setError] = useState(null);
  const done = useRef(onSignedIn);
  done.current = onSignedIn;

  useEffect(() => {
    api('/app/config', { auth: false }).then(({ data }) => setClientId(data.googleWebClientId)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !box.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            setError(null);
            try {
              const { data } = await api('/auth/google', { method: 'POST', body: { idToken: credential }, auth: false });
              done.current(data);
            } catch (err) {
              setError(err);
            }
          },
        });
        window.google.accounts.id.renderButton(box.current, {
          theme: 'outline', size: 'large', shape: 'pill', width: box.current.offsetWidth || 320,
          text: signUp ? 'signup_with' : 'continue_with',
        });
      })
      .catch(setError);
    return () => {
      cancelled = true;
    };
  }, [clientId, signUp]);

  if (!clientId) return null;
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div ref={box} style={{ minHeight: 44, display: 'flex', justifyContent: 'center' }} />
      {signUp && <p className="muted small" style={{ margin: 0, textAlign: 'center' }}>By continuing with Google you agree to the Terms of Service and Privacy Policy.</p>}
      <ErrorBox error={error} />
      <div className="divider-text">or with email</div>
    </div>
  );
}
