// Share a location: choose Live (a link that follows the vehicle) or Current (a map link), then copy it
// or send it by WhatsApp or email.
import { useState } from 'react';
import { api, errorText } from '../../lib/api';
import { plateOrName } from '../../lib/format';
import { useToast } from '../../lib/toast';
import Icon from '../../components/Icon';
import { Button, ErrorBox, Modal } from '../../components/ui';

export default function ShareDialog({ device, state, isOwner, onClose }) {
  const toast = useToast();
  const [link, setLink] = useState(null);
  const [kind, setKind] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const hasPos = state?.lat != null;
  const who = plateOrName(device);

  async function live() {
    setBusy(true);
    setError(null);
    try {
      const { data } = await api(`/devices/${device.id}/share-links`, { method: 'POST', body: { expiresInMinutes: 60 } });
      setLink(`${window.location.origin}/share/${data.token}`);
      setKind('live');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  function current() {
    setLink(`https://www.google.com/maps?q=${state.lat},${state.lon}`);
    setKind('current');
  }
  const text = kind === 'live' ? `Live location of ${who} (valid 1 hour): ${link}` : `${who} is here: ${link}`;
  async function copy() {
    try { await navigator.clipboard.writeText(link); toast('Link copied'); } catch { toast('Could not copy. Select the link and copy it.', 'error'); }
  }

  const choice = (icon, title, desc, onClick, disabled) => (
    <button type="button" className="tile" style={{ width: '100%', textAlign: 'left', cursor: disabled ? 'not-allowed' : 'pointer', border: 0, opacity: disabled ? 0.5 : 1 }} disabled={disabled || busy} onClick={onClick}>
      <span className="ico" style={{ width: 42, height: 42 }}><Icon name={icon} size={20} /></span>
      <div style={{ flex: 1 }}><b>{title}</b><span>{desc}</span></div>
      <Icon name="chevR" size={16} />
    </button>
  );

  return (
    <Modal title="Share location" onClose={onClose}>
      {!link ? (
        <>
          {choice('activity', 'Live location', isOwner ? 'A link that follows the vehicle for 1 hour' : 'Only the owner can create live links', live, !isOwner)}
          {choice('pin', 'Current location', hasPos ? 'Where it is right now, as a map link' : 'No GPS position yet', current, !hasPos)}
          <ErrorBox error={error} />
        </>
      ) : (
        <>
          <p className="muted small">{kind === 'live' ? 'Anyone with this link sees the live position for 1 hour.' : 'This link opens the current position on a map.'}</p>
          <input className="input" readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Share link" />
          <div className="row wrap" style={{ gap: 8 }}>
            <Button variant="primary" icon="copy" onClick={copy}>Copy link</Button>
            <Button icon="send" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')}>WhatsApp</Button>
            <Button icon="mail" onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent(`Location of ${who}`)}&body=${encodeURIComponent(text)}`; }}>Email</Button>
            {navigator.share && <Button icon="share" onClick={() => navigator.share({ text }).catch(() => {})}>More</Button>}
          </div>
          <Button variant="ghost" onClick={() => setLink(null)}>Back</Button>
        </>
      )}
    </Modal>
  );
}
