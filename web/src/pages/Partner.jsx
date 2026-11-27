// Partner with us: dealers, installers, fleet owners and resellers send their details.
import { useState } from 'react';
import { api, errorText } from '../lib/api';
import { useAuth } from '../lib/auth';
import Icon from '../components/Icon';
import { Button, Card, ErrorBox, Input, Notice, PageHead, Textarea } from '../components/ui';

const TYPES = [['dealer', 'Dealer'], ['installer', 'Installer'], ['fleet', 'Fleet owner'], ['reseller', 'Reseller'], ['other', 'Other']];
const BENEFITS = [
  ['card', 'Dealer pricing and margins on every tracker'],
  ['users', 'Leads from customers in your city'],
  ['dashboard', 'Fleet dashboard and bulk activation'],
  ['help', 'Priority support and installation training'],
];

export default function Partner() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', company: '', city: '', message: '' });
  const [type, setType] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const trimmed = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() || undefined]));
      await api('/inquiries', { method: 'POST', body: { kind: 'partner', ...trimmed, partnerType: type } });
      setSent(true);
    } catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  }

  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <PageHead title="Partner with us" sub="Sell, install or manage Pavakie trackers." />
      <div className="grid main-side">
        <Card title="Tell us about you">
          {sent ? <Notice tone="ok">Thank you. Our partner team will get in touch soon.</Notice> : (
            <form className="stack" onSubmit={submit}>
              <div className="chips" role="radiogroup" aria-label="I am a">{TYPES.map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={type === k} className={`chip sm ${type === k ? 'on' : ''}`} onClick={() => setType(k)}>{l}</button>)}</div>
              <div className="form-grid">
                <Input label="Name" value={form.name} onChange={set('name')} required />
                <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
                <Input label="Phone" value={form.phone} onChange={set('phone')} />
                <Input label="Company" value={form.company} onChange={set('company')} />
                <Input label="City" value={form.city} onChange={set('city')} />
              </div>
              <Textarea label="Message" value={form.message} onChange={set('message')} maxLength={2000} rows={4} />
              <ErrorBox error={error} />
              <div className="row" style={{ justifyContent: 'flex-end' }}><Button type="submit" variant="primary" icon="send" loading={busy} disabled={!type}>Send</Button></div>
            </form>
          )}
        </Card>
        <Card title="Why partner">
          <div className="stack">{BENEFITS.map(([icon, text]) => <div key={text} className="row" style={{ gap: 12, alignItems: 'flex-start' }}><span className="ico" style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={icon} size={17} /></span><span>{text}</span></div>)}</div>
        </Card>
      </div>
    </div>
  );
}
