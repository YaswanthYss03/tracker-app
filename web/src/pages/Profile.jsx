// Profile and settings: who you are, which alerts you get, appearance, password, sessions, delete account.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, clearSession, errorText } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useDrivers, useFleet, useUnreadAlerts } from '../lib/data';
import { initials } from '../lib/format';
import { setPref, usePref } from '../lib/prefs';
import { useToast } from '../lib/toast';
import Icon from '../components/Icon';
import { Button, Card, Confirm, ErrorBox, Input, PageHead, Seg, Setting, Switch } from '../components/ui';

export default function Profile() {
  const { user, reloadUser, logout } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const { devices } = useFleet();
  const { data: drivers = [] } = useDrivers();
  const unread = useUnreadAlerts();
  const theme = usePref('theme');
  const plates = usePref('platesOnMap');
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [company, setCompany] = useState(user.company || '');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [alerts, setAlerts] = useState(user.alerts || { offline: true, longStop: true, gpsLost: true, quietHours: false });
  const [deleting, setDeleting] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  async function saveProfile(e) {
    e.preventDefault();
    if (phone.trim() && !/^\+?[0-9 ()-]{6,20}$/.test(phone.trim())) { setErrors({ phone: 'Enter a valid phone number' }); return; }
    setErrors({});
    setBusy(true);
    try {
      await api('/me', { method: 'PATCH', body: { ...(name.trim() && { name: name.trim() }), phone: phone.trim(), company: company.trim() } });
      await reloadUser();
      toast('Profile saved');
    } catch (err) {
      setErrors({ form: errorText(err) });
    } finally {
      setBusy(false);
    }
  }

  async function setAlert(key, value) {
    setAlerts((a) => ({ ...a, [key]: value }));
    try { await api('/me', { method: 'PATCH', body: { alerts: { [key]: value } } }); reloadUser(); toast('Alert settings saved'); } catch (e) { setAlerts((a) => ({ ...a, [key]: !value })); toast(errorText(e), 'error'); }
  }

  return (
    <div className="page">
      <PageHead title="Profile and settings" sub={user.email}>
        <Button icon="logout" onClick={logout}>Log out</Button>
      </PageHead>
      <div className="stack lg">
        <div className="grid c3 keep2">
          {[['car', 'Vehicles', devices.length, '/vehicles'], ['users', 'Drivers', drivers.length, '/drivers'], ['bell', 'New alerts', unread, '/alerts']].map(([icon, label, n, to]) => (
            <Link key={label} to={to} className="card row" style={{ gap: 14 }}>
              <span className="kpi-icon grey" style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--surface)', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={20} /></span>
              <div><div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{n}</div><div className="small muted">{label}</div></div>
            </Link>
          ))}
        </div>

        <div className="grid c2 start">
          <Card title="Your details">
            <form className="stack" onSubmit={saveProfile}>
              <div className="row" style={{ gap: 14 }}>
                <div className="initials" style={{ width: 60, height: 60, fontSize: 20 }}>{initials(name || user.name, user.email)}</div>
                <div style={{ minWidth: 0 }}><div className="bold ellipsis">{user.name || 'Add your name'}</div><div className="small muted ellipsis">{user.email}</div></div>
              </div>
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
              <div className="form-grid">
                <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} placeholder="+91 90000 00000" maxLength={20} autoComplete="tel" />
                <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" maxLength={80} autoComplete="organization" />
              </div>
              <ErrorBox error={errors.form} />
              <div className="row" style={{ justifyContent: 'flex-end' }}><Button type="submit" variant="primary" loading={busy}>Save profile</Button></div>
            </form>
          </Card>

          <Card title="Alerts you receive">
            <div>
              <Setting title="Offline alerts" desc="When a vehicle stops reporting"><Switch checked={alerts.offline} onChange={(v) => setAlert('offline', v)} label="Offline alerts" /></Setting>
              <Setting title="Long-stop alerts" desc="Parked for 4 hours or more"><Switch checked={alerts.longStop} onChange={(v) => setAlert('longStop', v)} label="Long-stop alerts" /></Setting>
              <Setting title="GPS-lost alerts" desc="Ignition on but no location for 15 minutes"><Switch checked={alerts.gpsLost} onChange={(v) => setAlert('gpsLost', v)} label="GPS-lost alerts" /></Setting>
              <Setting title="Quiet hours" desc="10 PM to 7 AM. SOS and power cut still come through."><Switch checked={alerts.quietHours} onChange={(v) => setAlert('quietHours', v)} label="Quiet hours" /></Setting>
            </div>
          </Card>

          <Card title="Appearance">
            <div className="stack">
              <div className="row between"><div><div className="bold">Theme</div><div className="small muted">System follows your computer</div></div>
                <Seg value={theme} onChange={(v) => setPref('theme', v)} options={[['system', 'System'], ['light', 'Light'], ['dark', 'Dark']]} /></div>
              <Setting title="Number plates on the map" desc="Show each vehicle's plate under its marker"><Switch checked={plates} onChange={(v) => setPref('platesOnMap', v)} label="Plates on map" /></Setting>
            </div>
          </Card>

          <Card title="Password and sessions">
            <div className="stack">
              {user.hasPassword === false ? <SetPassword email={user.email} onDone={() => { clearSession(); nav('/login'); }} /> : <ChangePassword onDone={() => { toast('Password changed. Please log in again.'); clearSession(); nav('/login'); }} />}
              <hr className="divider" />
              <Setting title="Log out everywhere" desc="Sign out on every phone and browser, including this one"><Button size="sm" onClick={() => setConfirmAll(true)}>Log out all</Button></Setting>
            </div>
          </Card>
        </div>

        <div className="grid c2 start">
          <Card title="Help">
            <div>
              <Link to="/contact" className="item click"><span className="ico"><Icon name="help" size={16} /></span><div className="body"><div className="t">Contact us</div><div className="d">Questions about your tracker, billing or the app</div></div><Icon name="chevR" size={16} /></Link>
              <Link to="/partner" className="item click"><span className="ico"><Icon name="building" size={16} /></span><div className="body"><div className="t">Partner with us</div><div className="d">Dealers, installers, fleet owners and resellers</div></div><Icon name="chevR" size={16} /></Link>
              <a href="/privacy" className="item click" target="_blank" rel="noreferrer"><span className="ico"><Icon name="shield" size={16} /></span><div className="body"><div className="t">Privacy policy</div></div><Icon name="external" size={16} /></a>
              <a href="/terms" className="item click" target="_blank" rel="noreferrer"><span className="ico"><Icon name="info" size={16} /></span><div className="body"><div className="t">Terms of service</div></div><Icon name="external" size={16} /></a>
            </div>
          </Card>
          <Card title="Delete account">
            <p className="muted small" style={{ marginBottom: 14 }}>Deletes your account. Trackers you own are released and their history is deleted. This cannot be undone.</p>
            <Button variant="danger" onClick={() => setDeleting(true)}>Delete my account</Button>
          </Card>
        </div>
      </div>

      {confirmAll && <Confirm title="Log out everywhere" message="You will be logged out on every phone and browser, including this one." confirmLabel="Log out all" onConfirm={async () => { await api('/me/logout-all', { method: 'POST' }); clearSession(); nav('/login'); }} onClose={() => setConfirmAll(false)} />}
      {deleting && (
        <Confirm danger title="Delete account" confirmLabel="Delete account"
          message={`This can't be undone. ${user.hasPassword === false ? 'Type your email to confirm.' : 'Enter your password to confirm.'}`}
          onConfirm={async () => { await api('/me', { method: 'DELETE', body: user.hasPassword === false ? { confirmEmail: deleteText } : { password: deleteText } }); clearSession(); nav('/login'); }}
          onClose={() => { setDeleting(false); setDeleteText(''); }}>
          <Input label={user.hasPassword === false ? 'Your email' : 'Your password'} type={user.hasPassword === false ? 'email' : 'password'} value={deleteText} onChange={(e) => setDeleteText(e.target.value)} autoFocus />
        </Confirm>
      )}
    </div>
  );
}

function ChangePassword({ onDone }) {
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try { await api('/me/password', { method: 'POST', body: pw }); onDone(); } catch (err) { setError(err); setBusy(false); }
  }
  return (
    <form className="stack" onSubmit={submit}>
      <Input label="Current password" type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
      <Input label="New password" type="password" autoComplete="new-password" minLength={8} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required hint="At least 8 characters" />
      <ErrorBox error={error} />
      <div className="row" style={{ justifyContent: 'flex-end' }}><Button type="submit" variant="dark" loading={busy}>Change password</Button></div>
    </form>
  );
}

/** Google accounts without a password: set one with an emailed code. */
function SetPassword({ email, onDone }) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  async function send() { setError(null); try { await api('/auth/forgot-password', { method: 'POST', body: { email }, auth: false }); setSent(true); } catch (e) { setError(e); } }
  async function submit(e) { e.preventDefault(); setError(null); try { await api('/auth/reset-password', { method: 'POST', body: { email, code, newPassword: password }, auth: false }); onDone(); } catch (err) { setError(err); } }
  return (
    <form className="stack" onSubmit={submit}>
      <div><div className="bold">Set a password</div><div className="small muted">You sign in with Google. A password lets you log in with your email too.</div></div>
      {!sent ? <Button variant="dark" onClick={send}>Email me a code</Button> : (
        <>
          <Input label="6-digit code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} required />
          <Input label="New password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="dark">Set password</Button>
        </>
      )}
      <ErrorBox error={error} />
    </form>
  );
}
