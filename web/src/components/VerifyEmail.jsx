// "Enter the code we emailed you" step, shown after sign-up (or when logging
// in to an account whose email isn't confirmed yet).
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Button, ErrorBox, Input } from './ui';

export default function VerifyEmail({ email, onVerified, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [wait, setWait] = useState(30); // seconds until a new code can be requested

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data } = await api('/auth/verify-email', { method: 'POST', body: { email, code }, auth: false });
      onVerified(data);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    try {
      await api('/auth/resend-verification', { method: 'POST', body: { email }, auth: false });
      setSent(true);
      setWait(30);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <>
      <div>
        <h1>Check your email</h1>
        <p className="muted" style={{ marginTop: 4 }}>We sent a 6-digit code to <b>{email}</b>. It expires in 15 minutes.</p>
      </div>
      <form className="stack" onSubmit={submit}>
        <Input
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          required
          autoFocus
          style={{ letterSpacing: 8, fontSize: 22, textAlign: 'center' }}
        />
        <ErrorBox error={error} />
        <Button type="submit" variant="primary" size="lg" block loading={busy} disabled={code.length !== 6}>{busy ? 'Checking...' : 'Verify and continue'}</Button>
      </form>
      <p className="muted small center">
        {sent && wait > 0 ? 'A new code is on its way. ' : "Didn't get it? Check spam, or "}
        {wait > 0 ? <span>send a new code in {wait}s</span> : <button type="button" className="link" onClick={resend}>send a new code</button>}
        {onBack && <> or <button type="button" className="link" onClick={onBack}>use a different email</button></>}
      </p>
    </>
  );
}
