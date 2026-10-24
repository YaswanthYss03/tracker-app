// Account: profile, password, sessions, delete account.
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { api, clearSession } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { ErrorBox, ConfirmModal, useToast } from '../../components/ui';

export default function Account() {
  const { user, reloadUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name || '');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [deletePw, setDeletePw] = useState('');

  async function saveName(e) {
    e.preventDefault();
    try {
      await api('/me', { method: 'PATCH', body: { name } });
      await reloadUser();
      toast('Name saved');
    } catch (err) {
      setErrors({ name: err });
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setErrors({});
    try {
      await api('/me/password', { method: 'POST', body: pw });
      toast('Password changed. Please log in again.');
      clearSession();
      navigate('/login');
    } catch (err) {
      setErrors({ pw: err });
    }
  }

  return (
    <>
      <div className="page-head"><h1>Account</h1></div>
      <div className="grid grid-2">
        <form className="card form" onSubmit={saveName}>
          <h3>Profile</h3>
          <label className="field">Email<input value={user.email} disabled /></label>
          <label className="field">Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <ErrorBox error={errors.name} />
          <div className="row end"><button className="btn primary">Save</button></div>
        </form>
        {user.hasPassword === false ? (
          <SetPassword email={user.email} onDone={() => { clearSession(); navigate('/login'); }} />
        ) : (
        <form className="card form" onSubmit={changePassword}>
          <h3>Change password</h3>
          <label className="field">Current password<input type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required /></label>
          <label className="field">New password (8+ characters)<input type="password" autoComplete="new-password" minLength={8} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required /></label>
          <ErrorBox error={errors.pw} />
          <div className="row end"><button className="btn primary">Change password</button></div>
        </form>
        )}
        <div className="card">
          <h3>Sessions</h3>
          <p className="muted small">Log out on every phone and browser where you're signed in.</p>
          <button
            className="btn"
            onClick={async () => {
              await api('/me/logout-all', { method: 'POST' });
              await logout();
              navigate('/login');
            }}
          >
            Log out everywhere
          </button>
        </div>
        <div className="card">
          <h3>Delete account</h3>
          <p className="muted small">Deletes your account. Trackers you own are released and their history is deleted.</p>
          <button className="btn danger" onClick={() => setDeleting(true)}>Delete my account</button>
        </div>
      </div>
      {deleting && (
        <ConfirmModal
          title="Delete account"
          message={
            <div className="stack">
              <span>This can't be undone. {user.hasPassword === false ? 'Type your email to confirm.' : 'Enter your password to confirm.'}</span>
              <input type={user.hasPassword === false ? 'email' : 'password'} value={deletePw} onChange={(e) => setDeletePw(e.target.value)} placeholder={user.hasPassword === false ? user.email : 'Password'} autoFocus />
            </div>
          }
          confirmLabel="Delete account"
          danger
          onConfirm={async () => {
            await api('/me', { method: 'DELETE', body: user.hasPassword === false ? { confirmEmail: deletePw } : { password: deletePw } });
            clearSession();
            navigate('/login');
          }}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
}

/** Google accounts without a password: set one with an emailed code. */
function SetPassword({ email, onDone }) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function send() {
    setError(null);
    try {
      await api('/auth/forgot-password', { method: 'POST', body: { email }, auth: false });
      setSent(true);
    } catch (err) {
      setError(err);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api('/auth/reset-password', { method: 'POST', body: { email, code, newPassword: password }, auth: false });
      onDone();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h3>Set a password</h3>
      <p className="muted small">You sign in with Google. A password lets you log in with your email too.</p>
      {!sent ? (
        <div className="row"><button type="button" className="btn primary" onClick={send}>Email me a code</button></div>
      ) : (
        <>
          <label className="field">6-digit code<input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} required /></label>
          <label className="field">New password (8+ characters)<input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <div className="row end"><button className="btn primary">Set password</button></div>
        </>
      )}
      <ErrorBox error={error} />
    </form>
  );
}
