// "Enter the code we emailed you" step, shown after sign-up (or when logging
// in to an account whose email isn't confirmed yet).
import { useState } from 'react';
import { api } from '../lib/api';
import { ErrorBox } from './ui';

export default function VerifyEmail({ email, onVerified, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

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
    } catch (err) {
      setError(err);
    }
  }

  return (
    <>
      <h1>Check your email</h1>
      <p className="muted">We sent a 6-digit code to <b>{email}</b>. It expires in 15 minutes.</p>
      <form className="form" onSubmit={submit}>
        <label className="field">
          Verification code
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
            autoFocus
            style={{ letterSpacing: 8, fontSize: 22, textAlign: 'center' }}
          />
        </label>
        <ErrorBox error={error} />
        <button className="btn primary" disabled={busy || code.length !== 6}>{busy ? 'Checking…' : 'Verify and continue'}</button>
      </form>
      <p className="muted small" style={{ marginTop: 16 }}>
        {sent ? 'A new code is on its way. ' : "Didn't get it? Check spam, or "}
        {!sent && <button type="button" className="link" onClick={resend}>send a new code</button>}
        {onBack && <> · <button type="button" className="link" onClick={onBack}>use a different email</button></>}
      </p>
    </>
  );
}
