// Add a vehicle (IMEI + activation code from the tracker box) or edit one.
// Editing also holds "Remove vehicle" (releases the tracker).
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '../lib/api';
import { useDrivers, useRefresh } from '../lib/data';
import { formatActivationCode, normPlateInput } from '../lib/formHelpers';
import { VEHICLES, VEHICLE_COLORS } from '../lib/vehicles';
import { useToast } from '../lib/toast';
import { Button, Confirm, ErrorBox, Field, Input, Modal, Select } from './ui';
import { VehicleImage } from './vehicle';

export default function VehicleForm({ device, onClose }) {
  const editing = !!device;
  const nav = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const refresh = useRefresh();
  const { data: drivers = [] } = useDrivers();
  const [imei, setImei] = useState('');
  const [code, setCode] = useState('');
  const [kind, setKind] = useState(device?.icon || 'car');
  const [name, setName] = useState(device?.name || '');
  const [plate, setPlate] = useState(device?.registrationNumber || '');
  const [color, setColor] = useState(device?.color || null);
  const [driverId, setDriverId] = useState(device?.mainDriver?.id || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(false);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (editing) {
        await api(`/devices/${device.id}`, {
          method: 'PATCH',
          body: { icon: kind, color, mainDriverId: driverId || null, registrationNumber: plate.trim() ? normPlateInput(plate) : null, name: name.trim() || null },
        });
        await refresh();
        toast('Vehicle saved');
        onClose();
      } else {
        const { data } = await api('/devices/claim', {
          method: 'POST',
          body: {
            imei: imei.trim(), activationCode: code, vehicleType: kind, name: name.trim() || undefined,
            registrationNumber: plate.trim() ? normPlateInput(plate) : undefined, color: color || undefined, mainDriverId: driverId || undefined,
          },
        });
        await refresh();
        toast('Vehicle added');
        onClose();
        nav(`/vehicles/${data.id}`);
      }
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    await api(`/devices/${device.id}/release`, { method: 'POST', body: { confirmImei: device.imei } });
    qc.removeQueries({ queryKey: ['device', device.id] });
    await refresh();
    toast('Vehicle removed');
    onClose();
    nav('/vehicles');
  }

  return (
    <>
      <Modal
        title={editing ? 'Edit vehicle' : 'Add a vehicle'}
        onClose={onClose}
        wide
        footer={
          <>
            {editing && <Button variant="danger" className="right" style={{ marginRight: 'auto' }} onClick={() => setRemoving(true)}>Remove vehicle</Button>}
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" loading={busy} onClick={save} disabled={!editing && (imei.trim().length < 15 || code.length < 11)}>{editing ? 'Save' : 'Add vehicle'}</Button>
          </>
        }
      >
        <form className="stack" onSubmit={save}>
          {!editing && (
            <div className="form-grid">
              <Input label="Tracker ID (IMEI)" inputMode="numeric" maxLength={15} value={imei} onChange={(e) => setImei(e.target.value.replace(/\D/g, ''))} hint="15 digits, printed on the tracker box" autoFocus />
              <Input label="Activation code" value={code} onChange={(e) => setCode(formatActivationCode(e.target.value))} placeholder="XXXXX-XXXXX" className="plate-input" hint="The code on the box" />
            </div>
          )}
          <Field label="Vehicle type">
            <div className="chips">
              {VEHICLES.map((v) => (
                <button key={v.type} type="button" className={`chip sm ${kind === v.type ? 'on' : ''}`} onClick={() => setKind(v.type)} aria-pressed={kind === v.type}>
                  <span style={{ width: 22, height: 18, display: 'grid', placeItems: 'center' }}><VehicleImage type={v.type} className="mini" /></span>
                  {v.label}
                </button>
              ))}
            </div>
          </Field>
          <div className="form-grid">
            <Input label="Number plate" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="TN 38 AB 1234" className="plate-input" maxLength={15} />
            <Input label="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} placeholder="Delivery truck" maxLength={40} />
          </div>
          <Field label="Body colour">
            <div className="chips" role="radiogroup">
              {VEHICLE_COLORS.map((c) => (
                <button key={c.key} type="button" role="radio" aria-checked={color === c.key} aria-label={c.label} title={c.label} onClick={() => setColor(color === c.key ? null : c.key)}
                  style={{ width: 34, height: 34, borderRadius: '50%', background: c.hex, border: color === c.key ? '3px solid var(--accent)' : '2px solid var(--border)', cursor: 'pointer', padding: 0, boxShadow: color === c.key ? '0 0 0 2px var(--bg) inset' : 'none' }} />
              ))}
            </div>
          </Field>
          <Select label="Main driver" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">No driver</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <ErrorBox error={error} />
        </form>
      </Modal>
      {removing && (
        <Confirm
          danger
          title="Remove this vehicle?"
          message="Its history, trips, alerts and geofences are deleted, and the tracker can be added again with the code on its box."
          confirmLabel="Remove"
          requireText={device.registrationNumber || device.imei}
          onConfirm={remove}
          onClose={() => setRemoving(false)}
        />
      )}
    </>
  );
}
