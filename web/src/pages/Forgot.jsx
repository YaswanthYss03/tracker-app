// Forgot password: email -> 6-digit code + new password.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api } from '../lib/api';
import { useToast } from '../lib/toast';
import { Button, ErrorBox, Input } from '../components/ui';
import AuthShell from '../components/AuthShell';

export default function Forgot() {
  const nav = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(fn) {
    setBusy(true);
    setError(null);
    try { await fn(); } catch (e) { setError(e); } finally { setBusy(false); }
  }

  return (
    <AuthShell>
      {step === 'email' ? (
        <>
          <div>
            <h1>Reset your password</h1>
            <p className="muted" style={{ marginTop: 4 }}>Enter your email and we will send a 6-digit code.</p>
          </div>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); run(async () => { await api('/auth/forgot-password', { method: 'POST', body: { email: email.trim() }, auth: false }); setStep('code'); }); }}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            <ErrorBox error={error} />
            <Button type="submit" variant="primary" size="lg" block loading={busy}>Send code</Button>
          </form>
        </>
      ) : (
        <>
          <div>
            <h1>Enter the code</h1>
            <p className="muted" style={{ marginTop: 4 }}>We sent a code to <b>{email}</b>. Choose a new password.</p>
          </div>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); run(async () => { await api('/auth/reset-password', { method: 'POST', body: { email: email.trim(), code, newPassword: password }, auth: false }); toast('Password changed. Log in with the new one.'); nav('/login', { replace: true }); }); }}>
            <Input label="Code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} required autoFocus style={{ letterSpacing: 8, textAlign: 'center', fontSize: 20 }} />
            <Input label="New password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required hint="At least 8 characters" />
            <ErrorBox error={error} />
            <Button type="submit" variant="primary" size="lg" block loading={busy} disabled={code.length !== 6}>Change password</Button>
          </form>
        </>
      )}
      <p className="muted small center"><Link to="/login" className="link">Back to log in</Link></p>
    </AuthShell>
  );
}
