// Admin dashboard: health, counts, ingest stats, connected trackers.
import { Fragment } from 'react';
import { Link } from 'react-router';
import { api } from '../lib/api';
import { timeAgo } from '../lib/format';
import { useAsync, Spinner, ErrorBox, Pill } from '../components/ui';

export default function Dashboard() {
  const health = useAsync(() => fetch('/health').then((r) => r.json()), []);
  const system = useAsync(() => api('/admin/system'), []);
  const stats = useAsync(() => api('/admin/stats'), []);
  const conns = useAsync(() => api('/admin/connections'), []);

  const h = health.data;
  const sys = system.data?.data;
  const st = stats.data?.data;
  const dropped = st ? Object.entries(st.ingest.dropped || {}) : [];

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <button className="btn" onClick={() => { health.reload(); system.reload(); stats.reload(); conns.reload(); }}>Refresh</button>
      </div>
      <ErrorBox error={system.error || stats.error} />
      {!sys || !h ? <Spinner /> : (
        <div className="stack">
          <div className="grid grid-4">
            <div className="card stat">
              <div className="value">{h.status === 'ok' ? <Pill tone="ok" dot>Healthy</Pill> : <Pill tone="danger" dot>Degraded</Pill>}</div>
              <div className="label">Database {h.database ? 'up' : 'DOWN'} · push {h.push ? 'on' : 'off'} · disk {h.disk?.freePercent ?? '?'}% free</div>
            </div>
            <div className="card stat"><div className="value">{h.gateway.devicesConnected}</div><div className="label">Trackers connected now</div></div>
            <div className="card stat"><div className="value">{sys.counts.claimed} / {sys.counts.devices}</div><div className="label">Trackers claimed / registered</div></div>
            <div className="card stat"><div className="value">{sys.counts.users}</div><div className="label">Accounts</div></div>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <h3>Data</h3>
              <dl className="kv">
                <dt>Database size</dt><dd>{sys.databaseMb} MB (positions {sys.positionsMb} MB)</dd>
                <dt>Compressed chunks</dt><dd>{sys.compression.compressedChunks} / {sys.compression.chunks}{sys.compression.beforeMb ? ` (${sys.compression.beforeMb} → ${sys.compression.afterMb} MB)` : ''}</dd>
                <dt>Trips / alerts</dt><dd>{sys.counts.trips} / {sys.counts.events}</dd>
                <dt>Server uptime</dt><dd>{Math.round(sys.uptimeS / 3600)} h · {sys.memoryMb} MB memory</dd>
                <dt>Live map clients</dt><dd>{h.liveClients ?? 0}</dd>
              </dl>
            </div>
            <div className="card">
              <h3>GPS points since start</h3>
              {st && (
                <dl className="kv">
                  <dt>Received</dt><dd>{st.ingest.received}</dd>
                  <dt>Stored</dt><dd>{st.ingest.stored}</dd>
                  <dt>Write backlog</dt><dd>{st.writer.backlog}{st.writer.failing && <Pill tone="danger">failing</Pill>}</dd>
                  {dropped.map(([reason, n]) => (<Fragment key={reason}><dt>Dropped: {reason.replace(/_/g, ' ')}</dt><dd>{n}</dd></Fragment>))}
                </dl>
              )}
            </div>
          </div>
          <div className="card flush">
            <div className="card-head" style={{ padding: '14px 14px 0' }}><h3>Connected trackers</h3></div>
            {(conns.data?.data || []).length === 0 ? <div className="empty">None connected</div> : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>IMEI</th><th>From</th><th>Connected</th><th>Last packet</th></tr></thead>
                  <tbody>
                    {conns.data.data.map((c) => (
                      <tr key={c.deviceId}>
                        <td className="mono"><Link to={`/trackers/${c.imei}`}>{c.imei}</Link></td>
                        <td className="mono small">{c.remoteAddress}</td>
                        <td>{timeAgo(c.connectedAt)}</td>
                        <td>{timeAgo(c.lastPacketAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
