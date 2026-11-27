// Contact us: call / WhatsApp / email (from the server's settings) and a message form.
import { useState } from 'react';
import { api, errorText } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useAppConfig } from '../lib/data';
import Icon from '../components/Icon';
import { Button, Card, ErrorBox, Input, Notice, PageHead, Textarea } from '../components/ui';

export { useAppConfig };

export default function Contact() {
  const { user } = useAuth();
  const support = useAppConfig()?.support || {};
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const digits = (s) => s.replace(/[^\d+]/g, '');
  const channels = [
    support.phone && ['phone', 'Call us', support.phone, `tel:${digits(support.phone)}`],
    support.whatsapp && ['send', 'WhatsApp', support.whatsapp, `https://wa.me/${digits(support.whatsapp).replace('+', '')}`],
    support.email && ['mail', 'Email', support.email, `mailto:${support.email}`],
  ].filter(Boolean);

  async function send(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try { await api('/inquiries', { method: 'POST', body: { kind: 'contact', name: name.trim(), email: email.trim(), message: message.trim() } }); setSent(true); } catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  }

  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <PageHead title="Contact us" sub="Questions about your tracker, billing or the app? We are happy to help." />
      <div className="grid main-side">
        <Card title="Send a message">
          {sent ? <Notice tone="ok">Thank you. We have your message and will reply by email.</Notice> : (
            <form className="stack" onSubmit={send}>
              <div className="form-grid"><Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required /><Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <Textarea label="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} required minLength={5} maxLength={2000} rows={6} />
              <ErrorBox error={error} />
              <p className="tiny muted">We use your name and email only to reply to this message. See our <a href="/privacy" target="_blank" rel="noreferrer" className="link">Privacy Policy</a>.</p>
              <div className="row" style={{ justifyContent: 'flex-end' }}><Button type="submit" variant="primary" icon="send" loading={busy}>Send message</Button></div>
            </form>
          )}
        </Card>
        <div className="stack">
          {channels.map(([icon, label, value, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" className="card row" style={{ gap: 14 }}>
              <span className="kpi-icon" style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={20} /></span>
              <div><div className="bold">{label}</div><div className="small muted">{value}</div></div>
            </a>
          ))}
          {support.address && <Card><div className="row" style={{ alignItems: 'flex-start', gap: 12 }}><Icon name="pin" size={18} /><div className="small">{support.address}</div></div></Card>}
        </div>
      </div>
    </div>
  );
}
