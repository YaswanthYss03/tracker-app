import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';
import { ErrorBox } from '../components/ui';
import VerifyEmail from '../components/VerifyEmail';
import GoogleButton from '../components/GoogleButton';

export default function Login() {
  const { user, login, completeVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const u = await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setBusy(false);
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        // Send a fresh code and ask for it.
        await api('/auth/resend-verification', { method: 'POST', body: { email }, auth: false }).catch(() => {});
        setVerifying(true);
        return;
      }
      setError(err);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="brand">
          <img src="/favicon.svg" alt="" /> Pavakie Tracker
        </div>
        {verifying ? (
          <VerifyEmail
            email={email}
            onVerified={(data) => {
              const u = completeVerification(data);
              navigate('/', { replace: true });
            }}
            onBack={() => setVerifying(false)}
          />
        ) : (
        <>
        <h1>Log in</h1>
        <GoogleButton
          onSignedIn={(data) => {
            const u = completeVerification(data);
            navigate(location.state?.from || '/', { replace: true });
          }}
        />
        <form className="form" onSubmit={submit}>
          <label className="field">
            Email
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <label className="field">
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <ErrorBox error={error} />
          <button className="btn primary" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="muted small" style={{ marginTop: 16 }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
        </>
        )}
      </div>
    </div>
  );
}
