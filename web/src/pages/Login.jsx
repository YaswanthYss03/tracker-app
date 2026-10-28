import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';
import { Button, ErrorBox, Input } from '../components/ui';
import AuthShell from '../components/AuthShell';
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
  const to = location.state?.from || '/';

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate(to, { replace: true });
    } catch (err) {
      setBusy(false);
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        await api('/auth/resend-verification', { method: 'POST', body: { email: email.trim() }, auth: false }).catch(() => {});
        setVerifying(true);
        return;
      }
      setError(err);
    }
  }

  return (
    <AuthShell>
      {verifying ? (
        <VerifyEmail email={email.trim()} onVerified={(data) => { completeVerification(data); navigate('/', { replace: true }); }} onBack={() => setVerifying(false)} />
      ) : (
        <>
          <div>
            <h1>Welcome back</h1>
            <p className="muted" style={{ marginTop: 4 }}>Log in to see your vehicles.</p>
          </div>
          <GoogleButton onSignedIn={(data) => { completeVerification(data); navigate(to, { replace: true }); }} />
          <form className="stack" onSubmit={submit}>
            <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            <Input label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div style={{ textAlign: 'right', marginTop: -8 }}><Link to="/forgot" className="link small">Forgot password?</Link></div>
            <ErrorBox error={error} />
            <Button type="submit" variant="primary" size="lg" block loading={busy}>{busy ? 'Logging in...' : 'Log in'}</Button>
          </form>
          <p className="muted small center">New here? <Link to="/register" className="link">Create an account</Link></p>
        </>
      )}
    </AuthShell>
  );
}
