// Trips you start by hand. Everything the vehicle records after you start one goes into it,
// until you start the next. Not named: Trip 1, Trip 2, ...
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '../../lib/api';
import { dateTime, duration, km, timeOnly } from '../../lib/format';
import { useToast } from '../../lib/toast';
import Icon from '../../components/Icon';
import TripView from '../../components/TripView';
import { Button, Card, Confirm, Drawer, Empty, ErrorBox, IconButton, Modal, Skeleton } from '../../components/ui';

export default function Trips({ device, isOwner }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [starting, setStarting] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const q = useQuery({ queryKey: ['trip-logs', device.id], queryFn: () => api(`/devices/${device.id}/trip-logs`), refetchInterval: 30_000 });
  const list = q.data?.data || [];
  const current = list[0]?.current ? list[0] : null;
  const nameOf = (t) => t.name || `Trip ${t.number}`;

  async function start() {
    setBusy(true);
    setError(null);
    try {
      await api(`/devices/${device.id}/trip-logs`, { method: 'POST', body: name.trim() ? { name: name.trim() } : {} });
      await qc.invalidateQueries({ queryKey: ['trip-logs', device.id] });
      toast('New trip started');
      setStarting(false);
      setName('');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card
      title={list.length ? `${list.length} ${list.length === 1 ? 'trip' : 'trips'}` : 'Trips'}
      action={isOwner && <Button variant="primary" size="sm" icon="plus" onClick={() => { setError(null); setStarting(true); }}>New trip</Button>}
    >
      {q.isLoading ? <div className="stack"><Skeleton h={56} /><Skeleton h={56} /></div> : list.length === 0 ? (
        <Empty icon="trips" title="No trips yet">{isOwner ? 'Start a trip. The data the vehicle records is saved into it until you start the next one.' : 'The owner has not started a trip yet.'}</Empty>
      ) : (
        <div>
          {list.map((t) => (
            <div key={t.id} className="item click" onClick={() => setOpen(t)}>
              <span className={`ico ${t.current ? 'red' : ''}`}><Icon name="trips" size={16} /></span>
              <div className="body">
                <div className="t row" style={{ gap: 8 }}>{nameOf(t)}{t.current && <span className="pill accent">Current</span>}</div>
                <div className="d">{dateTime(t.startedAt)} - {t.endedAt ? timeOnly(t.endedAt) : 'now'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="bold">{km(t.distanceKm)} km</div>
                <div className="tiny muted">{duration(t.durationS)}</div>
              </div>
              {isOwner && <IconButton icon="trash" label={`Delete ${nameOf(t)}`} size="sm" onClick={(e) => { e.stopPropagation(); setDeleting(t); }} />}
            </div>
          ))}
        </div>
      )}

      {starting && (
        <Modal title="Start a new trip" onClose={() => setStarting(false)} footer={<><Button onClick={() => setStarting(false)}>Cancel</Button><Button variant="primary" loading={busy} onClick={start}>Start trip</Button></>}>
          <p className="muted">{current ? `${nameOf(current)} ends now. From now on the vehicle's data is saved to the new trip.` : "From now on the vehicle's data is saved to this trip until you start another."}</p>
          <div className="field">
            <label htmlFor="trip-name">Name (optional)</label>
            <input id="trip-name" className="input underline" value={name} onChange={(e) => setName(e.target.value)} placeholder={`Trip ${list.length + 1}`} maxLength={60} autoFocus onKeyDown={(e) => e.key === 'Enter' && start()} />
          </div>
          <ErrorBox error={error} />
        </Modal>
      )}
      {open && <Drawer title={nameOf(open)} onClose={() => setOpen(null)}><TripView deviceId={device.id} tripId={open.id} kind="log" /></Drawer>}
      {deleting && (
        <Confirm danger title="Delete trip" message={`Delete ${nameOf(deleting)}? Its data joins the trip before it.`} confirmLabel="Delete"
          onConfirm={async () => { await api(`/devices/${device.id}/trip-logs/${deleting.id}`, { method: 'DELETE' }); await qc.invalidateQueries({ queryKey: ['trip-logs', device.id] }); toast('Trip deleted'); }}
          onClose={() => setDeleting(null)} />
      )}
    </Card>
  );
}
