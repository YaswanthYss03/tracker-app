import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { ErrorBox } from '../components/ui';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-art" aria-hidden="true">
        <span className="wordmark big">Pavakie</span>
        <p>Admin console</p>
      </div>
      <div className="login-form">
        <form className="card form" onSubmit={submit}>
          <h1>Admin login</h1>
          <p className="muted small">Only Pavakie admin accounts can sign in here.</p>
          <label className="field">
            Email
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <label className="field">
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <ErrorBox error={error} />
          <button className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
}
