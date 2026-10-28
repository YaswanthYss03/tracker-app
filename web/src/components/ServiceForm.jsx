// Add, edit or delete a service record.
import { useState } from 'react';
import { api, errorText } from '../lib/api';
import { useRefresh } from '../lib/data';
import { isoDay } from '../lib/format';
import { SERVICE_TYPES } from '../lib/service';
import { useToast } from '../lib/toast';
import { Button, Confirm, ErrorBox, Field, Input, Modal, Textarea } from './ui';

const addMonths = (iso, m) => {
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1 + m, d)).toISOString().slice(0, 10);
};

export default function ServiceForm({ deviceId, record, onClose }) {
  const editing = !!record;
  const refresh = useRefresh();
  const toast = useToast();
  const [kind, setKind] = useState(record?.type || 'general');
  const [date, setDate] = useState(record?.date || isoDay());
  const [odometer, setOdometer] = useState(record?.odometerKm != null ? String(record.odometerKm) : '');
  const [garage, setGarage] = useState(record?.garage || '');
  const [cost, setCost] = useState(record?.cost != null ? String(record.cost) : '');
  const [notes, setNotes] = useState(record?.notes || '');
  const [next, setNext] = useState(record?.nextDueDate || '');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save() {
    const errs = {};
    if (!date) errs.date = 'Choose the service date';
    else if (date > isoDay()) errs.date = "Can't be in the future";
    if (next && date && next <= date) errs.next = 'Must be after the service date';
    if (odometer && !/^\d{1,7}$/.test(odometer)) errs.odometer = 'Whole km only';
    if (cost && !/^\d{1,8}$/.test(cost)) errs.cost = 'Whole rupees only';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setError(null);
    try {
      const body = { type: kind, date, nextDueDate: next || null, odometerKm: odometer ? Number(odometer) : null, garage: garage.trim() || null, cost: cost ? Number(cost) : null, notes: notes.trim() || null };
      if (editing) await api(`/devices/${deviceId}/service/${record.id}`, { method: 'PATCH', body });
      else await api(`/devices/${deviceId}/service`, { method: 'POST', body });
      await refresh();
      toast(editing ? 'Service record saved' : 'Service record added');
      onClose();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    await api(`/devices/${deviceId}/service/${record.id}`, { method: 'DELETE' });
    await refresh();
    toast('Service record deleted');
    onClose();
  }

  return (
    <>
      <Modal
        title={editing ? 'Edit service record' : 'Add service record'}
        onClose={onClose}
        footer={
          <>
            {editing && <Button variant="danger" style={{ marginRight: 'auto' }} onClick={() => setDeleting(true)}>Delete</Button>}
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="primary" loading={busy} onClick={save}>Save</Button>
          </>
        }
      >
        <Field label="What was done">
          <div className="chips">
            {SERVICE_TYPES.map((t) => <button key={t.type} type="button" className={`chip sm ${kind === t.type ? 'on' : ''}`} aria-pressed={kind === t.type} onClick={() => setKind(t.type)}>{t.label}</button>)}
          </div>
        </Field>
        <div className="form-grid">
          <Input label="Service date" type="date" max={isoDay()} value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
          <Input label="Odometer (km)" inputMode="numeric" value={odometer} onChange={(e) => setOdometer(e.target.value.replace(/\D/g, ''))} error={errors.odometer} />
          <Input label="Garage" value={garage} onChange={(e) => setGarage(e.target.value)} maxLength={60} />
          <Input label="Cost (rupees)" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value.replace(/\D/g, ''))} error={errors.cost} />
        </div>
        <Field label="Next service due" error={errors.next}>
          <div className="row wrap" style={{ gap: 8 }}>
            <input className="input" type="date" min={date} value={next} onChange={(e) => setNext(e.target.value)} style={{ width: 190 }} aria-label="Next service due date" />
            {[[3, '3 months'], [6, '6 months'], [12, '1 year']].map(([m, l]) => (
              <button key={m} type="button" className="chip sm" onClick={() => date && setNext(addMonths(date, m))}>{l}</button>
            ))}
            {next && <button type="button" className="chip sm" onClick={() => setNext('')}>Clear</button>}
          </div>
        </Field>
        <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} rows={3} />
        <ErrorBox error={error} />
      </Modal>
      {deleting && <Confirm danger title="Delete this record?" message="It will be removed from the service history." confirmLabel="Delete" onConfirm={remove} onClose={() => setDeleting(false)} />}
    </>
  );
}
