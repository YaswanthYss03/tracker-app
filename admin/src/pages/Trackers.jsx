// Admin: tracker stock — search, filter, register one, register many, export.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../lib/api';
import { timeAgo, downloadCsv } from '../lib/format';
import { useAsync, Spinner, ErrorBox, Empty, Modal, StatusPill, OnlinePill, CopyButton } from '../components/ui';

const PAGE = 50;

export default function Trackers() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState(null); // 'one' | 'bulk'

  // Search after typing stops.
  useEffect(() => {
    const t = setTimeout(() => { setQuery(q.trim()); setPage(0); }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data, error, loading, reload } = useAsync(
    () => api(`/admin/devices?limit=${PAGE}&offset=${page * PAGE}${query ? `&q=${encodeURIComponent(query)}` : ''}${status ? `&status=${status}` : ''}`),
    [query, status, page]
  );
  const devices = data?.data || [];
  const total = data?.total ?? 0;

  return (
    <>
      <div className="page-head">
        <h1>Trackers</h1>
        <div className="row">
          <button className="btn" onClick={() => setModal('bulk')}>Register many</button>
          <button className="btn primary" onClick={() => setModal('one')}>+ Register tracker</button>
        </div>
      </div>
      <div className="card flush">
        <div className="row" style={{ padding: 12 }}>
          <input placeholder="Search IMEI, SIM number or name" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 220 }} aria-label="Search" />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} style={{ width: 170 }} aria-label="Status">
            <option value="">All statuses</option>
            <option value="inventory">In stock</option>
            <option value="active">Claimed</option>
            <option value="suspended">Suspended</option>
          </select>
          <button
            className="btn"
            disabled={!devices.length}
            onClick={() => downloadCsv('trackers.csv', [
              ['imei', 'sim', 'model', 'name', 'status', 'online', 'last_seen'],
              ...devices.map((d) => [d.imei, d.simNumber, d.model, d.name, d.status, d.live.online, d.live.lastSeenAt]),
            ])}
          >
            Export
          </button>
        </div>
        <ErrorBox error={error} />
        {loading && !data ? <Spinner /> : devices.length === 0 ? <Empty>No trackers found.</Empty> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>IMEI</th><th>Name</th><th>SIM</th><th>Status</th><th>Connection</th><th>Last seen</th></tr></thead>
              <tbody>
                {devices.map((d) => (
                  <tr key={d.id} className="clickable" onClick={() => navigate(`/trackers/${d.imei}`)}>
                    <td className="mono">{d.imei}</td>
                    <td>{d.name || <span className="muted">—</span>}</td>
                    <td className="mono small">{d.simNumber || '—'}</td>
                    <td><StatusPill status={d.status} /></td>
                    <td><OnlinePill online={d.live.online} lastSeenAt={d.live.lastSeenAt} /></td>
                    <td className="nowrap">{timeAgo(d.live.lastSeenAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="row" style={{ padding: 12 }}>
          <span className="muted small">{total} tracker{total === 1 ? '' : 's'}</span>
          <span className="spacer" />
          <button className="btn small" disabled={page === 0} onClick={() => setPage(page - 1)}>← Prev</button>
          <button className="btn small" disabled={(page + 1) * PAGE >= total} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      </div>
      {modal === 'one' && <RegisterOne onClose={() => setModal(null)} onDone={reload} />}
      {modal === 'bulk' && <RegisterMany onClose={() => setModal(null)} onDone={reload} />}
    </>
  );
}

function RegisterOne({ onClose, onDone }) {
  const [form, setForm] = useState({ imei: '', simNumber: '', model: 'GT06N', name: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const body = Object.fromEntries(Object.entries(form).filter(([, v]) => v.trim()).map(([k, v]) => [k, v.trim()]));
      const { data } = await api('/admin/devices', { method: 'POST', body });
      setResult(data);
      onDone();
    } catch (err) {
      setError(err);
    }
  }

  if (result) {
    return (
      <Modal title="Tracker registered" onClose={onClose}>
        <div className="stack">
          <p>Print this on the box for IMEI <span className="mono">{result.imei}</span>. <strong>It can't be shown again</strong> (you can reset it later).</p>
          <div className="code-box">{result.activationCode}</div>
          <div className="row end">
            <CopyButton text={`${result.imei},${result.activationCode}`} label="Copy IMEI + code" />
            <button className="btn primary" onClick={() => { setResult(null); setForm({ ...form, imei: '', simNumber: '', name: '' }); }}>Register another</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Register tracker" onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="field">IMEI (15 digits)<input inputMode="numeric" pattern="\d{15}" maxLength={15} value={form.imei} onChange={set('imei')} required autoFocus /></label>
        <div className="form-row">
          <label className="field">SIM number<input value={form.simNumber} onChange={set('simNumber')} placeholder="Airtel IoT SIM" /></label>
          <label className="field">Model<input value={form.model} onChange={set('model')} /></label>
        </div>
        <label className="field">Name / note (optional)<input value={form.name} onChange={set('name')} /></label>
        <ErrorBox error={error} />
        <div className="row end">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary">Register</button>
        </div>
      </form>
    </Modal>
  );
}

function RegisterMany({ onClose, onDone }) {
  const [mode, setMode] = useState('list');
  const [text, setText] = useState('');
  const [firstImei, setFirstImei] = useState('');
  const [count, setCount] = useState(10);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const body = mode === 'list'
        ? { imeis: text.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean) }
        : { firstImei: firstImei.trim(), count: Number(count) };
      const res = await api('/admin/devices/bulk', { method: 'POST', body });
      setResults(res);
      onDone();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  if (results) {
    const rows = results.data;
    return (
      <Modal title="Registration results" onClose={onClose} wide>
        <div className="stack">
          <div className="alert-box info">{results.created} registered, {results.failed} failed. <strong>Download the codes now</strong>; they can't be shown again.</div>
          <div className="row">
            <button className="btn primary" onClick={() => downloadCsv(`activation-codes-${Date.now()}.csv`, [['imei', 'activation_code', 'error'], ...rows.map((r) => [r.imei, r.activationCode, r.error])])}>
              Download CSV
            </button>
          </div>
          <div className="table-wrap" style={{ maxHeight: 360 }}>
            <table>
              <thead><tr><th>IMEI</th><th>Activation code</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.imei}><td className="mono">{r.imei}</td><td className={r.error ? '' : 'mono'}>{r.activationCode || <span style={{ color: 'var(--danger)' }}>{r.error}</span>}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Register many trackers" onClose={onClose} wide>
      <form className="form" onSubmit={submit}>
        <div className="tabs">
          <button type="button" className={mode === 'list' ? 'active' : ''} onClick={() => setMode('list')}>Paste IMEIs</button>
          <button type="button" className={mode === 'range' ? 'active' : ''} onClick={() => setMode('range')}>Consecutive range</button>
        </div>
        {mode === 'list' ? (
          <label className="field">IMEIs (one per line, or separated by commas), up to 1000<textarea value={text} onChange={(e) => setText(e.target.value)} required placeholder={'359710049100000\n359710049100001'} /></label>
        ) : (
          <div className="form-row">
            <label className="field">First IMEI<input inputMode="numeric" pattern="\d{15}" maxLength={15} value={firstImei} onChange={(e) => setFirstImei(e.target.value)} required /></label>
            <label className="field">How many<input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(e.target.value)} required /></label>
          </div>
        )}
        <ErrorBox error={error} />
        <div className="row end">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={busy}>{busy ? 'Registering…' : 'Register'}</button>
        </div>
      </form>
    </Modal>
  );
}
