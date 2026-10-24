// "My trackers": list with live status, map of all trackers, add a tracker.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Marker, Tooltip } from 'react-leaflet';
import { api } from '../../lib/api';
import { useLive } from '../../lib/live';
import { timeAgo, alertText, SEVERE_ALERTS } from '../../lib/format';
import { MapView, FitBounds, vehicleIcon } from '../../components/MapView';
import { useAsync, Spinner, ErrorBox, Empty, OnlinePill, Pill, Modal, useToast } from '../../components/ui';

export default function Devices() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data, error, loading, reload } = useAsync(() => api('/devices'), []);
  const [adding, setAdding] = useState(false);
  const devices = data?.data || [];
  const names = Object.fromEntries(devices.map((d) => [d.id, d.name || d.imei]));

  const { live } = useLive(devices.map((d) => d.id), {
    onAlert: (a) => toast(`${names[a.deviceId] || 'Tracker'}: ${alertText(a)}`, SEVERE_ALERTS.has(a.type) ? 'danger' : ''),
    onRevoked: () => reload(),
  });
  const state = (d) => live[d.id] || d.live;
  const points = devices.map((d) => [state(d).lat, state(d).lon]).filter((p) => p[0] != null);

  return (
    <>
      <div className="page-head">
        <h1>My trackers</h1>
        <button className="btn primary" onClick={() => setAdding(true)}>+ Add tracker</button>
      </div>
      <ErrorBox error={error} />
      {loading && !data ? (
        <Spinner />
      ) : devices.length === 0 ? (
        <div className="card">
          <Empty>
            <h2>No trackers yet</h2>
            <p>Add your tracker with the IMEI and activation code printed on the box.</p>
            <button className="btn primary" onClick={() => setAdding(true)}>+ Add tracker</button>
          </Empty>
        </div>
      ) : (
        <div className="split">
          <div className="card flush">
            <div className="list">
              {devices.map((d) => {
                const s = state(d);
                return (
                  <Link key={d.id} to={`/devices/${d.id}`} className="list-item clickable" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <div className="grow">
                      <div className="title">{d.name || `Tracker ${d.imei.slice(-4)}`}</div>
                      <div className="muted small">
                        {s.online ? (s.speed ? `${s.speed} km/h` : 'Stopped') : `Last seen ${timeAgo(s.lastSeenAt)}`}
                        {s.ignition != null && ` · Ignition ${s.ignition ? 'on' : 'off'}`}
                      </div>
                    </div>
                    <div className="stack" style={{ gap: 4, alignItems: 'flex-end' }}>
                      <OnlinePill online={s.online} lastSeenAt={s.lastSeenAt} />
                      {d.role === 'viewer' && <Pill>Shared with you</Pill>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <MapView className="map tall">
            <FitBounds points={points} fitKey={devices.length} />
            {devices.map((d) => {
              const s = state(d);
              if (s.lat == null) return null;
              return (
                <Marker
                  key={d.id}
                  position={[s.lat, s.lon]}
                  icon={vehicleIcon({ online: s.online, heading: s.heading })}
                  eventHandlers={{ click: () => navigate(`/devices/${d.id}`) }}
                >
                  <Tooltip direction="top" offset={[0, -16]}>{d.name || d.imei} · {s.speed ?? 0} km/h</Tooltip>
                </Marker>
              );
            })}
          </MapView>
        </div>
      )}
      {adding && (
        <AddTracker
          onClose={() => setAdding(false)}
          onAdded={(device) => {
            setAdding(false);
            navigate(`/devices/${device.id}`);
          }}
        />
      )}
    </>
  );
}

function AddTracker({ onClose, onAdded }) {
  const [form, setForm] = useState({ imei: '', activationCode: '', name: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data } = await api('/devices/claim', {
        method: 'POST',
        body: { imei: form.imei.trim(), activationCode: form.activationCode.trim(), name: form.name.trim() || undefined },
      });
      onAdded(data);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <Modal title="Add a tracker" onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <p className="muted">Both numbers are printed on the tracker's box.</p>
        <label className="field">
          IMEI (15 digits)
          <input inputMode="numeric" pattern="\d{15}" maxLength={15} value={form.imei} onChange={set('imei')} required autoFocus />
        </label>
        <label className="field">
          Activation code
          <input value={form.activationCode} onChange={set('activationCode')} placeholder="ABCDE-12345" required style={{ textTransform: 'uppercase' }} />
        </label>
        <label className="field">
          Name (optional)
          <input value={form.name} onChange={set('name')} placeholder="e.g. My car" />
        </label>
        <ErrorBox error={error} />
        <div className="row end">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={busy}>{busy ? 'Adding…' : 'Add tracker'}</button>
        </div>
      </form>
    </Modal>
  );
}
