import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { ErrorBox } from '../components/ui';
import VerifyEmail from '../components/VerifyEmail';
import GoogleButton from '../components/GoogleButton';

export default function Register() {
  const { user, register, completeVerification } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', acceptTerms: false });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(null); // email waiting for its code

  if (user) return <Navigate to="/" replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await register({ ...form, name: form.name || undefined });
      if (result.verificationRequired) {
        setVerifyEmail(result.email);
        setBusy(false);
        return;
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="brand">
          <img src="/favicon.svg" alt="" /> Pavakie Tracker
        </div>
        {verifyEmail ? (
          <VerifyEmail
            email={verifyEmail}
            onVerified={(data) => { completeVerification(data); navigate('/', { replace: true }); }}
            onBack={() => setVerifyEmail(null)}
          />
        ) : (
        <>
        <h1>Create account</h1>
        <GoogleButton signUp onSignedIn={(data) => { completeVerification(data); navigate('/', { replace: true }); }} />
        <form className="form" onSubmit={submit}>
          <label className="field">
            Name
            <input autoComplete="name" value={form.name} onChange={set('name')} />
          </label>
          <label className="field">
            Email
            <input type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
          </label>
          <label className="field">
            Password (at least 8 characters)
            <input type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={set('password')} required />
          </label>
          <label className="check">
            <input type="checkbox" checked={form.acceptTerms} onChange={set('acceptTerms')} required />
            <span>I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>, including storing my vehicle's location history.</span>
          </label>
          <ErrorBox error={error} />
          <button className="btn primary" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="muted small" style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        </>
        )}
      </div>
    </div>
  );
}
