import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../lib/auth';
import { Button, ErrorBox, Input } from '../components/ui';
import AuthShell from '../components/AuthShell';
import VerifyEmail from '../components/VerifyEmail';
import GoogleButton from '../components/GoogleButton';

export default function Register() {
  const { user, register, completeVerification } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', acceptTerms: false });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(null);

  if (user) return <Navigate to="/" replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await register({ ...form, email: form.email.trim(), name: form.name.trim() || undefined });
      if (result.verificationRequired) { setVerifyEmail(result.email); setBusy(false); return; }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      {verifyEmail ? (
        <VerifyEmail email={verifyEmail} onVerified={(data) => { completeVerification(data); navigate('/', { replace: true }); }} onBack={() => setVerifyEmail(null)} />
      ) : (
        <>
          <div>
            <h1>Create your account</h1>
            <p className="muted" style={{ marginTop: 4 }}>Add your trackers in a minute.</p>
          </div>
          <GoogleButton signUp onSignedIn={(data) => { completeVerification(data); navigate('/', { replace: true }); }} />
          <form className="stack" onSubmit={submit}>
            <Input label="Name" autoComplete="name" value={form.name} onChange={set('name')} />
            <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
            <Input label="Password" type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={set('password')} required hint="At least 8 characters" />
            <label className="check">
              <input type="checkbox" checked={form.acceptTerms} onChange={set('acceptTerms')} required />
              <span>I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>, including storing my vehicle's location history.</span>
            </label>
            <ErrorBox error={error} />
            <Button type="submit" variant="primary" size="lg" block loading={busy}>{busy ? 'Creating...' : 'Create account'}</Button>
          </form>
          <p className="muted small center">Already have an account? <Link to="/login" className="link">Log in</Link></p>
        </>
      )}
    </AuthShell>
  );
}
