// Tracker tabs that change things: Geofences, Sharing, Settings.
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Circle, Polygon, Marker, Tooltip } from 'react-leaflet';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { dateTime } from '../../lib/format';
import { MapView, FitBounds, ClickToPick, vehicleIcon } from '../../components/MapView';
import { useAsync, Spinner, ErrorBox, Empty, Pill, ConfirmModal, CopyButton, useToast } from '../../components/ui';

// ---------------- Geofences ----------------

export function GeofencesTab({ device, state, isOwner }) {
  const toast = useToast();
  const { data, error, loading, reload } = useAsync(() => api(`/devices/${device.id}/geofences`), [device.id]);
  const [draft, setDraft] = useState(null); // { center, radiusM, name }
  const [saveError, setSaveError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const fences = data?.data || [];
  const pos = state.lat != null ? [state.lat, state.lon] : null;

  const fitPoints = [
    ...(pos ? [pos] : []),
    ...fences.flatMap((f) => (f.type === 'circle' ? [[f.center.lat, f.center.lon]] : f.points)),
  ];

  async function save() {
    setSaveError(null);
    try {
      await api(`/devices/${device.id}/geofences`, {
        method: 'POST',
        body: { name: draft.name.trim(), type: 'circle', center: { lat: draft.center[0], lon: draft.center[1] }, radiusM: Number(draft.radiusM) },
      });
      setDraft(null);
      toast('Geofence saved');
      reload();
    } catch (err) {
      setSaveError(err);
    }
  }

  async function toggle(f, key) {
    await api(`/devices/${device.id}/geofences/${f.id}`, { method: 'PATCH', body: { [key]: !f[key] } });
    reload();
  }

  return (
    <div className="split">
      <div className="stack">
        {isOwner && !draft && (
          <button className="btn primary" onClick={() => setDraft({ center: pos, radiusM: 200, name: '' })}>+ Add area</button>
        )}
        {draft && (
          <div className="card form">
            <h3>New area</h3>
            <p className="muted small">Click the map to place the centre.</p>
            <label className="field">Name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Home, Office, School…" autoFocus /></label>
            <label className="field">Radius (meters)<input type="number" min={50} max={50000} step={50} value={draft.radiusM} onChange={(e) => setDraft({ ...draft, radiusM: e.target.value })} /></label>
            <ErrorBox error={saveError} />
            <div className="row end">
              <button className="btn" onClick={() => setDraft(null)}>Cancel</button>
              <button className="btn primary" disabled={!draft.center || !draft.name.trim()} onClick={save}>Save</button>
            </div>
          </div>
        )}
        <div className="card flush">
          <ErrorBox error={error} />
          {loading && !data ? <Spinner /> : fences.length === 0 ? (
            <Empty>No geofences. You get an alert when the vehicle enters or leaves an area.</Empty>
          ) : (
            <div className="list">
              {fences.map((f) => (
                <div key={f.id} className="list-item">
                  <div className="grow">
                    <div className="title">{f.name}</div>
                    <div className="muted small">{f.type === 'circle' ? `${f.radiusM} m radius` : `${f.points.length}-point area`}</div>
                    {isOwner && (
                      <div className="row small" style={{ marginTop: 6 }}>
                        <label className="check"><input type="checkbox" checked={f.alertOnEnter} onChange={() => toggle(f, 'alertOnEnter')} /> Enter</label>
                        <label className="check"><input type="checkbox" checked={f.alertOnExit} onChange={() => toggle(f, 'alertOnExit')} /> Leave</label>
                      </div>
                    )}
                  </div>
                  {isOwner && <button className="btn small danger" onClick={() => setDeleting(f)}>Delete</button>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <MapView className="map tall">
        <FitBounds points={fitPoints} fitKey={fences.length} />
        {draft && <ClickToPick onPick={(center) => setDraft((d) => ({ ...d, center }))} />}
        {pos && <Marker position={pos} icon={vehicleIcon({ online: state.online, heading: state.heading })} />}
        {fences.map((f) =>
          f.type === 'circle' ? (
            <Circle key={f.id} center={[f.center.lat, f.center.lon]} radius={f.radiusM} pathOptions={{ color: '#0f766e' }}>
              <Tooltip>{f.name}</Tooltip>
            </Circle>
          ) : (
            <Polygon key={f.id} positions={f.points} pathOptions={{ color: '#0f766e' }}><Tooltip>{f.name}</Tooltip></Polygon>
          )
        )}
        {draft?.center && <Circle center={draft.center} radius={Number(draft.radiusM) || 0} pathOptions={{ color: '#c2410c', dashArray: '6 6' }} />}
      </MapView>
      {deleting && (
        <ConfirmModal
          title="Delete geofence"
          message={`Delete "${deleting.name}"? You will stop getting alerts for it.`}
          confirmLabel="Delete"
          danger
          onConfirm={async () => {
            await api(`/devices/${device.id}/geofences/${deleting.id}`, { method: 'DELETE' });
            reload();
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ---------------- Sharing (owner) ----------------

export function SharingTab({ device }) {
  const toast = useToast();
  const members = useAsync(() => api(`/devices/${device.id}/members`), [device.id]);
  const links = useAsync(() => api(`/devices/${device.id}/share-links`), [device.id]);
  const [email, setEmail] = useState('');
  const [minutes, setMinutes] = useState(60);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(null);

  async function addViewer(e) {
    e.preventDefault();
    setError(null);
    try {
      await api(`/devices/${device.id}/viewers`, { method: 'POST', body: { email } });
      setEmail('');
      toast('Shared');
      members.reload();
    } catch (err) {
      setError(err);
    }
  }

  async function createLink() {
    setError(null);
    try {
      await api(`/devices/${device.id}/share-links`, { method: 'POST', body: { expiresInMinutes: Number(minutes) } });
      links.reload();
    } catch (err) {
      setError(err);
    }
  }

  const linkUrl = (token) => `${window.location.origin}/share/${token}`;

  return (
    <div className="grid grid-2">
      <div className="card">
        <div className="card-head"><h3>People with access</h3></div>
        <form className="row" onSubmit={addViewer} style={{ marginBottom: 12 }}>
          <input type="email" placeholder="Their account email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ flex: 1, minWidth: 180 }} />
          <button className="btn primary">Share</button>
        </form>
        <p className="muted small">They need an account first. Viewers can see the location, history and alerts, but can't change settings.</p>
        {members.loading && !members.data ? <Spinner /> : (
          <div className="list">
            {(members.data?.data || []).map((m) => (
              <div key={m.userId} className="list-item" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="grow">
                  <div className="title">{m.name || m.email}</div>
                  <div className="muted small">{m.email}</div>
                </div>
                {m.role === 'owner' ? <Pill tone="brand">Owner</Pill> : (
                  <button className="btn small danger" onClick={() => setRemoving(m)}>Remove</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-head"><h3>Live location links</h3></div>
        <p className="muted small">Anyone with the link sees the live position only (no history, no alerts) until it expires.</p>
        <div className="row" style={{ marginBottom: 12 }}>
          <select value={minutes} onChange={(e) => setMinutes(e.target.value)} style={{ flex: 1 }} aria-label="Link duration">
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={240}>4 hours</option>
            <option value={1440}>1 day</option>
            <option value={10080}>7 days</option>
          </select>
          <button className="btn primary" onClick={createLink}>Create link</button>
        </div>
        {(links.data?.data || []).length === 0 ? <Empty>No active links</Empty> : (
          <div className="list">
            {links.data.data.map((l) => (
              <div key={l.token} className="list-item" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="grow">
                  <div className="mono small" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{linkUrl(l.token)}</div>
                  <div className="muted small">Expires {dateTime(l.expiresAt)}</div>
                </div>
                <CopyButton text={linkUrl(l.token)} />
                <button
                  className="btn small danger"
                  onClick={async () => {
                    await api(`/devices/${device.id}/share-links/${l.token}`, { method: 'DELETE' });
                    links.reload();
                  }}
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ErrorBox error={error} />
      {removing && (
        <ConfirmModal
          title="Remove access"
          message={`${removing.email} will no longer see this tracker.`}
          confirmLabel="Remove"
          danger
          onConfirm={async () => {
            await api(`/devices/${device.id}/members/${removing.userId}`, { method: 'DELETE' });
            members.reload();
          }}
          onClose={() => setRemoving(null)}
        />
      )}
    </div>
  );
}

// ---------------- Settings ----------------

// Same list as the server and the phone app (stored in device.icon).
const VEHICLES = [['car', 'Car'], ['bike', 'Bike'], ['scooter', 'Scooter'], ['bus', 'Bus'], ['van', 'Van'], ['truck', 'Truck'], ['auto', 'Auto'], ['bicycle', 'Cycle'], ['tractor', 'Tractor'], ['other', 'Other']];
const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Europe/London', 'UTC'];

export function SettingsTab({ device, isOwner, reload }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: device.name || '',
    speedLimitKmh: device.speedLimitKmh ?? '',
    timezone: device.timezone,
    icon: device.icon || '',
  });
  const [error, setError] = useState(null);
  const [notify, setNotify] = useState(device.notify);
  const [confirm, setConfirm] = useState(null); // 'release' | 'leave'

  async function save(e) {
    e.preventDefault();
    setError(null);
    try {
      await api(`/devices/${device.id}`, {
        method: 'PATCH',
        body: {
          name: form.name.trim() || null,
          speedLimitKmh: form.speedLimitKmh === '' ? null : Number(form.speedLimitKmh),
          timezone: form.timezone,
          icon: form.icon || null,
        },
      });
      toast('Settings saved');
      reload();
    } catch (err) {
      setError(err);
    }
  }

  async function toggleNotify() {
    const { data } = await api(`/devices/${device.id}/notifications`, { method: 'PATCH', body: { enabled: !notify } });
    setNotify(data.notify);
  }

  return (
    <div className="grid grid-2">
      {isOwner && (
        <form className="card form" onSubmit={save}>
          <h3>Tracker settings</h3>
          <label className="field">Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Family car" /></label>
          <label className="field">
            Vehicle type (icon on the phone app map)
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              <option value="">Not set</option>
              {VEHICLES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </label>
          <label className="field">
            Speed limit for alerts (km/h, empty = off)
            <input type="number" min={10} max={250} value={form.speedLimitKmh} onChange={(e) => setForm({ ...form, speedLimitKmh: e.target.value })} />
          </label>
          <label className="field">
            Timezone (for daily reports)
            <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
              {[...new Set([form.timezone, ...TIMEZONES])].map((tz) => <option key={tz}>{tz}</option>)}
            </select>
          </label>
          <ErrorBox error={error} />
          <div className="row end"><button className="btn primary">Save</button></div>
        </form>
      )}
      <div className="stack">
        <div className="card">
          <h3>Notifications</h3>
          <label className="check">
            <input type="checkbox" checked={notify} onChange={toggleNotify} />
            <span>Send this tracker's alerts to my phone</span>
          </label>
          <p className="muted small" style={{ marginTop: 8, marginBottom: 0 }}>Push notifications arrive through the mobile app.</p>
        </div>
        <div className="card">
          <h3>{isOwner ? 'Release tracker' : 'Leave tracker'}</h3>
          <p className="muted small">
            {isOwner
              ? 'Selling the vehicle or tracker? Releasing deletes all history, removes everyone, and lets the next owner add it with the code on the box.'
              : 'Stop seeing this tracker. The owner can share it with you again.'}
          </p>
          <button className="btn danger" onClick={() => setConfirm(isOwner ? 'release' : 'leave')}>{isOwner ? 'Release tracker' : 'Leave'}</button>
        </div>
      </div>
      {confirm === 'release' && (
        <ConfirmModal
          title="Release tracker"
          message="This permanently deletes the tracker's history, trips, alerts, geofences and share links, and removes all viewers."
          confirmLabel="Release"
          danger
          requireText={device.imei}
          onConfirm={async () => {
            await api(`/devices/${device.id}/release`, { method: 'POST', body: { confirmImei: device.imei } });
            navigate('/');
          }}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm === 'leave' && (
        <ConfirmModal
          title="Leave tracker"
          message="You will no longer see this tracker."
          confirmLabel="Leave"
          danger
          onConfirm={async () => {
            await api(`/devices/${device.id}/members/${user.id}`, { method: 'DELETE' });
            navigate('/');
          }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
