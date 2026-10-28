// Add or edit a driver: photo or illustration, name, phone, licence, and which vehicles they drive.
import { useRef, useState } from 'react';
import { api, errorText } from '../lib/api';
import { useFleet, useRefresh } from '../lib/data';
import { imageToBase64 } from '../lib/formHelpers';
import { plateOrName } from '../lib/format';
import { useToast } from '../lib/toast';
import { Button, Confirm, ErrorBox, Field, Input, Modal } from './ui';
import { AVATAR_KEYS, DriverAvatar, Illustration, avatarForName } from './vehicle';

const LOOKS = {
  a1: { bg: '#DCE6F3', skin: '#C98E62', hair: '#2A1A12', shirt: '#2F6DB5', style: 'short' },
  a2: { bg: '#F6DDE0', skin: '#E0AC84', hair: '#2A1A12', shirt: '#C8302E', style: 'long' },
  a3: { bg: '#DCEFE0', skin: '#A86F48', hair: '#1E1410', shirt: '#3D8B4F', style: 'side' },
  a4: { bg: '#E8E0F3', skin: '#D49A6E', hair: '#3A2418', shirt: '#7A4FA8', style: 'bun' },
  a5: { bg: '#F6E2CC', skin: '#B97B52', hair: '#1E1410', shirt: '#E07B24', style: 'cap' },
  a6: { bg: '#D9EFEB', skin: '#8E5B3C', hair: '#14100E', shirt: '#2A8C82', style: 'long' },
  a7: { bg: '#E3E7EC', skin: '#B07A55', hair: '#9AA0A6', shirt: '#2E3E5C', style: 'short' },
  a8: { bg: '#F5EDC9', skin: '#E6B892', hair: '#4A2E1E', shirt: '#E8C21C', style: 'curly' },
};

export default function DriverForm({ driver, onClose, onSaved }) {
  const editing = !!driver;
  const { devices } = useFleet();
  const mine = devices.filter((d) => d.role === 'owner');
  const refresh = useRefresh();
  const toast = useToast();
  const file = useRef(null);
  const [name, setName] = useState(driver?.name || '');
  const [phone, setPhone] = useState(driver?.phone || '');
  const [licence, setLicence] = useState(driver?.licenceNo || '');
  const [expiry, setExpiry] = useState(driver?.licenceExpiry || '');
  const [avatar, setAvatar] = useState(driver?.avatar || null);
  const [photo, setPhoto] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [mainOf, setMainOf] = useState((driver?.mainOf || []).map((v) => v.id));
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function pick(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try { setPhoto(await imageToBase64(f)); setRemovePhoto(false); } catch { setError('Could not read that picture.'); }
  }

  async function save() {
    const errs = {};
    if (!name.trim()) errs.name = "Enter the driver's name";
    if (phone.trim() && !/^\+?[0-9 ()-]{6,20}$/.test(phone.trim())) errs.phone = 'Enter a valid phone number';
    if (licence.trim() && licence.trim().length < 4) errs.licence = 'Too short';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setError(null);
    try {
      const body = { name: name.trim(), phone: phone.trim() || null, licenceNo: licence.trim() || null, licenceExpiry: expiry || null, avatar: avatar ?? avatarForName(name.trim()), mainVehicleIds: mainOf };
      const res = editing ? await api(`/drivers/${driver.id}`, { method: 'PATCH', body }) : await api('/drivers', { method: 'POST', body });
      const id = res.data.id;
      if (photo) await api(`/drivers/${id}/photo`, { method: 'PUT', body: { image: photo.base64 } });
      else if (removePhoto && driver?.photoUrl) await api(`/drivers/${id}/photo`, { method: 'DELETE' });
      await refresh();
      toast(editing ? 'Driver saved' : 'Driver added');
      onSaved?.(res.data);
      onClose();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    await api(`/drivers/${driver.id}`, { method: 'DELETE' });
    await refresh();
    toast('Driver removed');
    onClose();
  }

  const shown = photo ? { ...driver, name } : removePhoto ? { ...driver, photoUrl: null, name } : { ...(driver || {}), name: name || '?', avatar };
  return (
    <>
      <Modal
        title={editing ? 'Edit driver' : 'Add a driver'}
        onClose={onClose}
        wide
        footer={
          <>
            {editing && <Button variant="danger" style={{ marginRight: 'auto' }} onClick={() => setDeleting(true)}>Remove driver</Button>}
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={save} loading={busy}>Save</Button>
          </>
        }
      >
        <div className="row" style={{ gap: 18, alignItems: 'flex-start' }}>
          <DriverAvatar driver={shown} size={84} localSrc={photo?.preview} />
          <div className="stack sm" style={{ flex: 1 }}>
            <div className="row wrap" style={{ gap: 8 }}>
              <Button size="sm" icon="camera" onClick={() => file.current?.click()}>{driver?.photoUrl || photo ? 'Change photo' : 'Upload photo'}</Button>
              {(photo || (driver?.photoUrl && !removePhoto)) && <Button size="sm" variant="ghost" icon="trash" onClick={() => { setPhoto(null); setRemovePhoto(true); }}>Remove photo</Button>}
              <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
            </div>
            <div className="tiny muted">Or pick an illustration:</div>
            <div className="row wrap" style={{ gap: 8 }}>
              {AVATAR_KEYS.map((k) => (
                <button key={k} type="button" aria-label={`Illustration ${k}`} aria-pressed={(avatar || avatarForName(name || '?')) === k && !photo} onClick={() => { setAvatar(k); setPhoto(null); setRemovePhoto(true); }}
                  style={{ border: (avatar || avatarForName(name || '?')) === k && !photo ? '3px solid var(--accent)' : '3px solid transparent', borderRadius: '50%', padding: 0, background: 'none', cursor: 'pointer' }}>
                  <Illustration look={LOOKS[k]} size={36} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="form-grid">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} maxLength={60} autoFocus />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} placeholder="+91 90000 00000" maxLength={20} />
          <Input label="Licence number" value={licence} onChange={(e) => setLicence(e.target.value)} error={errors.licence} maxLength={24} className="plate-input" />
          <Input label="Licence valid until" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </div>
        {mine.length > 0 && (
          <Field label="Main driver of" hint="Choose the vehicles this person drives">
            <div className="chips">
              {mine.map((v) => {
                const on = mainOf.includes(v.id);
                return <button key={v.id} type="button" className={`chip sm ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => setMainOf(on ? mainOf.filter((x) => x !== v.id) : [...mainOf, v.id])}><span className="plate">{plateOrName(v)}</span></button>;
              })}
            </div>
          </Field>
        )}
        <ErrorBox error={error} />
      </Modal>
      {deleting && <Confirm danger title={`Remove ${driver.name}?`} message="Vehicles they drive will need a new driver." confirmLabel="Remove" onConfirm={remove} onClose={() => setDeleting(false)} />}
    </>
  );
}
