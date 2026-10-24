// Admin: one tracker — details, edit, status, codes, release/delete, map, history, commands, debug packets.
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Marker } from 'react-leaflet';
import { api } from '../lib/api';
import { dateTime, timeAgo } from '../lib/format';
import { MapView, vehicleIcon } from '../components/MapView';
import {
  useAsync, Spinner, ErrorBox, Empty, Modal, ConfirmModal, StatusPill, OnlinePill, Pill, CopyButton, useToast,
} from '../components/ui';

export default function TrackerDetail() {
  const { imei } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, error, loading, reload } = useAsync(() => api(`/admin/devices/${imei}`), [imei]);
  const positions = useAsync(() => api(`/admin/devices/${imei}/positions?limit=50`), [imei]);
  const raw = useAsync(() => api(`/admin/raw-packets?imei=${imei}&limit=20`), [imei]);
  const [modal, setModal] = useState(null); // edit | code | release | delete
  const [code, setCode] = useState(null);

  // Admins aren't "members" of trackers, so refresh by polling instead of the live socket.
  useEffect(() => {
    const t = setInterval(() => reload(), 15_000);
    return () => clearInterval(t);
  }, [reload]);

  if (loading && !data) return <Spinner />;
  if (error) return <div className="stack"><ErrorBox error={error} /><Link to="/trackers">← Trackers</Link></div>;

  const d = data.data;
  const pos = d.live.lat != null ? [d.live.lat, d.live.lon] : null;
  const setStatus = async (status) => {
    await api(`/admin/devices/${imei}`, { method: 'PATCH', body: { status } });
    toast(`Tracker is now ${status === 'suspended' ? 'suspended' : status === 'active' ? 'active' : 'in stock'}`);
    reload();
  };

  return (
    <>
      <div className="page-head">
        <div>
          <Link to="/trackers" className="small">← Trackers</Link>
          <h1 className="mono">{d.imei}</h1>
          <div className="row">
            <StatusPill status={d.status} />
            <OnlinePill online={d.live.online} lastSeenAt={d.live.lastSeenAt} />
            {d.connected && <Pill tone="ok">Socket open</Pill>}
            {d.claimLockedUntil && new Date(d.claimLockedUntil) > new Date() && <Pill tone="warn">Claim locked until {dateTime(d.claimLockedUntil)}</Pill>}
          </div>
        </div>
        <div className="row">
          <button className="btn" onClick={() => setModal('edit')}>Edit</button>
          {d.status === 'suspended' ? (
            <button className="btn" onClick={() => setStatus(d.members?.some((m) => m.role === 'owner') ? 'active' : 'inventory')}>Unsuspend</button>
          ) : (
            <button className="btn danger" onClick={() => setStatus('suspended')}>Suspend</button>
          )}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="stack">
          <div className="card">
            <h3>Details</h3>
            <dl className="kv">
              <dt>Name</dt><dd>{d.name || '—'}</dd>
              <dt>SIM number</dt><dd className="mono">{d.simNumber || '—'}</dd>
              <dt>Model</dt><dd>{d.model}</dd>
              <dt>Registered</dt><dd>{dateTime(d.createdAt)}</dd>
              <dt>Timezone</dt><dd>{d.timezone}</dd>
              <dt>Speed limit</dt><dd>{d.speedLimitKmh ? `${d.speedLimitKmh} km/h` : '—'}</dd>
              <dt>Last contact</dt><dd>{timeAgo(d.live.lastSeenAt)}</dd>
              <dt>Position</dt><dd>{pos ? `${d.live.lat}, ${d.live.lon} · ${d.live.speed ?? 0} km/h` : '—'}</dd>
              <dt>Ignition / battery</dt><dd>{d.live.ignition == null ? '—' : d.live.ignition ? 'On' : 'Off'} · {d.live.batteryPercent != null ? `${d.live.batteryPercent}%` : '—'} · signal {d.live.gsmSignal ?? '—'}/4</dd>
            </dl>
          </div>
          <div className="card">
            <h3>Owner & viewers</h3>
            {d.members?.length ? (
              <div className="list">
                {d.members.map((m) => (
                  <div key={m.userId} className="list-item" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div className="grow"><div className="title">{m.email}</div><div className="muted small">since {dateTime(m.since)}</div></div>
                    <Pill tone={m.role === 'owner' ? 'brand' : ''}>{m.role}</Pill>
                  </div>
                ))}
              </div>
            ) : <p className="muted">Not claimed yet.</p>}
          </div>
          <div className="card">
            <h3>Activation & lifecycle</h3>
            <div className="stack">
              <div className="row">
                <button className="btn" onClick={() => setModal('code')}>Reset activation code</button>
                <span className="muted small">New code for the box; also clears a claim lock.</span>
              </div>
              <div className="row">
                <button className="btn danger" disabled={!d.members?.length} onClick={() => setModal('release')}>Release</button>
                <span className="muted small">Remove owner and viewers, wipe history, back to stock.</span>
              </div>
              <div className="row">
                <button className="btn danger solid" onClick={() => setModal('delete')}>Delete tracker</button>
                <span className="muted small">Removes it and all its data permanently.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="stack">
          {pos ? (
            <MapView center={pos} zoom={15} className="map short">
              <Marker position={pos} icon={vehicleIcon({ online: d.live.online, heading: d.live.heading })} />
            </MapView>
          ) : <div className="card"><Empty>No position yet</Empty></div>}
          <CommandConsole imei={imei} online={d.connected} />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="card flush">
          <div className="card-head" style={{ padding: '14px 14px 0' }}><h3>Latest positions (24 h)</h3></div>
          {(positions.data?.data || []).length === 0 ? <Empty>None</Empty> : (
            <div className="table-wrap" style={{ maxHeight: 360 }}>
              <table>
                <thead><tr><th>GPS time</th><th>Lat, lon</th><th>km/h</th><th>ACC</th></tr></thead>
                <tbody>
                  {positions.data.data.map((p) => (
                    <tr key={p.gpsTime}><td className="nowrap small">{dateTime(p.gpsTime)}</td><td className="mono small">{p.lat}, {p.lon}</td><td>{p.speed}</td><td>{p.acc == null ? '—' : p.acc ? 'on' : 'off'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card flush">
          <div className="card-head" style={{ padding: '14px 14px 0' }}><h3>Unknown / broken packets (7 days)</h3></div>
          {(raw.data?.data || []).length === 0 ? <Empty>None — the parser understands everything this tracker sends.</Empty> : (
            <div className="table-wrap" style={{ maxHeight: 360 }}>
              <table>
                <thead><tr><th>Time</th><th>Protocol</th><th>Reason</th><th>Hex</th></tr></thead>
                <tbody>
                  {raw.data.data.map((r) => (
                    <tr key={r.id}><td className="nowrap small">{dateTime(r.receivedAt)}</td><td className="mono">0x{(r.protocol ?? 0).toString(16).padStart(2, '0')}</td><td className="small">{r.reason}</td><td className="mono small" style={{ wordBreak: 'break-all' }}>{r.hex}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal === 'edit' && <EditTracker device={d} onClose={() => setModal(null)} onSaved={() => { setModal(null); reload(); toast('Saved'); }} />}
      {modal === 'code' && (
        <ConfirmModal
          title="Reset activation code"
          message="The old code stops working. Only do this if you'll put the new code on the box (or give it to the customer)."
          confirmLabel="Generate new code"
          onConfirm={async () => {
            const { data: r } = await api(`/admin/devices/${imei}/reset-code`, { method: 'POST' });
            setCode(r.activationCode);
            reload();
          }}
          onClose={() => setModal(null)}
        />
      )}
      {code && (
        <Modal title="New activation code" onClose={() => setCode(null)}>
          <div className="stack">
            <p>For IMEI <span className="mono">{imei}</span>. It can't be shown again.</p>
            <div className="code-box">{code}</div>
            <div className="row end"><CopyButton text={code} /></div>
          </div>
        </Modal>
      )}
      {modal === 'release' && (
        <ConfirmModal
          title="Release tracker"
          message="Removes the owner and all viewers and permanently deletes history, trips, alerts, geofences and share links. The tracker goes back to stock."
          confirmLabel="Release"
          danger
          requireText={imei}
          onConfirm={async () => {
            await api(`/admin/devices/${imei}/release`, { method: 'POST' });
            reload();
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'delete' && (
        <ConfirmModal
          title="Delete tracker"
          message={d.status === 'active'
            ? 'A customer owns this tracker. Deleting removes it from their account and deletes all its data permanently.'
            : 'Deletes the tracker and all its data permanently. It will be refused if it connects again.'}
          confirmLabel="Delete permanently"
          danger
          requireText={imei}
          onConfirm={async () => {
            await api(`/admin/devices/${imei}?force=true`, { method: 'DELETE' });
            navigate('/trackers');
          }}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function EditTracker({ device, onClose, onSaved }) {
  const [form, setForm] = useState({ simNumber: device.simNumber || '', model: device.model, name: device.name || '' });
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api(`/admin/devices/${device.imei}`, {
        method: 'PATCH',
        body: { simNumber: form.simNumber.trim() || null, model: form.model.trim() || 'GT06N', name: form.name.trim() || null },
      });
      onSaved();
    } catch (err) {
      setError(err);
    }
  }
  return (
    <Modal title="Edit tracker" onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="field">IMEI<input value={device.imei} disabled /></label>
        <div className="form-row">
          <label className="field">SIM number<input value={form.simNumber} onChange={set('simNumber')} /></label>
          <label className="field">Model<input value={form.model} onChange={set('model')} /></label>
        </div>
        <label className="field">Name<input value={form.name} onChange={set('name')} /></label>
        <ErrorBox error={error} />
        <div className="row end">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary">Save</button>
        </div>
      </form>
    </Modal>
  );
}

function CommandConsole({ imei, online }) {
  const [command, setCommand] = useState('WHERE#');
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);
  async function send(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api(`/admin/devices/${imei}/commands`, { method: 'POST', body: { command } });
      setLog((l) => [{ command, reply: data.response, ok: true, at: new Date() }, ...l]);
    } catch (err) {
      setLog((l) => [{ command, reply: err.message, ok: false, at: new Date() }, ...l]);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="card">
      <h3>Command console</h3>
      <form className="row" onSubmit={send}>
        <input className="mono" value={command} onChange={(e) => setCommand(e.target.value)} style={{ flex: 1 }} aria-label="Command" />
        <button className="btn primary" disabled={busy || !online}>{busy ? 'Waiting…' : 'Send'}</button>
      </form>
      <p className="muted small" style={{ marginTop: 8 }}>
        {online ? 'Same text as SMS commands: WHERE#, STATUS#, PARAM#, TIMER,30#, RESET#…' : 'Tracker is not connected.'}
      </p>
      {log.map((l, i) => (
        <div key={i} className={`alert-box ${l.ok ? 'info' : 'error'} mono small`} style={{ marginTop: 6 }}>
          → {l.command}<br />← {l.reply}
        </div>
      ))}
    </div>
  );
}
