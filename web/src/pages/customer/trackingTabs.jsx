// Tracker tabs that show data: Live, History, Trips, Daily report, Alerts.
import { useMemo, useState } from 'react';
import { CircleMarker, Marker, Polyline, Tooltip } from 'react-leaflet';
import { api } from '../../lib/api';
import { dateTime, duration, isoDay, km, timeAgo, timeOnly, alertText, ALERT_LABELS, SEVERE_ALERTS } from '../../lib/format';
import { MapView, FitBounds, Follow, vehicleIcon } from '../../components/MapView';
import { useAsync, Spinner, ErrorBox, Empty, Pill } from '../../components/ui';

const dayRange = (day) => {
  const from = new Date(`${day}T00:00:00`);
  return { from: from.toISOString(), to: new Date(from.getTime() + 86_400_000 - 1).toISOString() };
};

// ---------------- Live ----------------

export function LiveTab({ device, state, isOwner, newAlerts }) {
  const [follow, setFollow] = useState(true);
  const recent = useAsync(() => api(`/devices/${device.id}/events?limit=10`), [device.id]);
  const alerts = [...newAlerts, ...(recent.data?.data || [])]
    .filter((a, i, all) => all.findIndex((b) => b.id === a.id) === i)
    .slice(0, 10);
  const pos = state.lat != null ? [state.lat, state.lon] : null;

  return (
    <div className="split">
      <div className="stack">
        <div className="card">
          <dl className="kv">
            <dt>Speed</dt><dd>{state.speed ?? '—'} km/h</dd>
            <dt>Heading</dt><dd>{state.heading ?? '—'}°</dd>
            <dt>Ignition</dt><dd>{state.ignition == null ? '—' : state.ignition ? 'On' : 'Off'}</dd>
            <dt>Position time</dt><dd>{dateTime(state.gpsTime)}</dd>
            <dt>Last contact</dt><dd>{timeAgo(state.lastSeenAt)}</dd>
            <dt>Satellites</dt><dd>{state.satellites ?? '—'}</dd>
            <dt>Battery</dt><dd>{state.batteryPercent != null ? `${state.batteryPercent}%` : '—'}{state.externalPower ? ' (charging)' : ''}</dd>
            <dt>Signal</dt><dd>{state.gsmSignal != null ? `${state.gsmSignal}/4` : '—'}</dd>
          </dl>
          {pos && (
            <p className="small" style={{ marginTop: 12, marginBottom: 0 }}>
              <a href={`https://www.google.com/maps?q=${state.lat},${state.lon}`} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
            </p>
          )}
        </div>
        {isOwner && <Commands deviceId={device.id} online={state.online} />}
        <div className="card flush">
          <div className="card-head" style={{ padding: '14px 14px 0' }}><h3>Recent alerts</h3></div>
          {alerts.length === 0 ? <Empty>No alerts</Empty> : (
            <div className="list">
              {alerts.map((a) => (
                <div key={a.id} className="list-item">
                  <div className="grow">
                    <div className="title">{alertText(a)}</div>
                    <div className="muted small">{dateTime(a.time)}</div>
                  </div>
                  {SEVERE_ALERTS.has(a.type) && <Pill tone="danger">!</Pill>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="stack">
        <div className="row">
          <label className="check"><input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} /> Follow vehicle</label>
        </div>
        {pos ? (
          <MapView center={pos} zoom={16} className="map tall">
            <Follow point={pos} follow={follow} />
            <Marker position={pos} icon={vehicleIcon({ online: state.online, heading: state.heading })} />
          </MapView>
        ) : (
          <div className="card"><Empty>No position yet. It appears as soon as the tracker gets a GPS fix.</Empty></div>
        )}
      </div>
    </div>
  );
}

function Commands({ deviceId, online }) {
  const [busy, setBusy] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  async function send(type) {
    setBusy(type);
    setError(null);
    setResult(null);
    try {
      const { data } = await api(`/devices/${deviceId}/commands`, { method: 'POST', body: { type } });
      setResult(data.response);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  }
  return (
    <div className="card">
      <div className="card-head"><h3>Ask the tracker</h3></div>
      <div className="row">
        <button className="btn small" disabled={!online || busy} onClick={() => send('locate')}>{busy === 'locate' ? 'Waiting…' : 'Where are you?'}</button>
        <button className="btn small" disabled={!online || busy} onClick={() => send('status')}>{busy === 'status' ? 'Waiting…' : 'Status'}</button>
      </div>
      {!online && <p className="muted small" style={{ marginTop: 8, marginBottom: 0 }}>Available while the tracker is online.</p>}
      {result && <div className="alert-box info mono" style={{ marginTop: 10 }}>{result}</div>}
      {error && <div style={{ marginTop: 10 }}><ErrorBox error={error} /></div>}
    </div>
  );
}

// ---------------- History ----------------

export function HistoryTab({ device }) {
  const [day, setDay] = useState(isoDay());
  const [index, setIndex] = useState(null);
  const { from, to } = dayRange(day);
  const { data, error, loading } = useAsync(
    () => api(`/devices/${device.id}/positions?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&maxPoints=3000`),
    [device.id, day]
  );
  const points = data?.data.points || [];
  const line = points.map((p) => [p.lat, p.lon]);
  const current = index != null ? points[index] : null;

  return (
    <div className="stack">
      <div className="row">
        <label className="field" style={{ maxWidth: 200 }}>
          Day
          <input type="date" value={day} max={isoDay()} onChange={(e) => { setDay(e.target.value); setIndex(null); }} />
        </label>
        <div className="muted small" style={{ alignSelf: 'flex-end', paddingBottom: 10 }}>
          {loading ? 'Loading…' : `${data?.data.originalCount || 0} positions`}
        </div>
      </div>
      <ErrorBox error={error} />
      {points.length > 1 && (
        <div className="card">
          <div className="row">
            <input
              type="range" min={0} max={points.length - 1} value={index ?? 0}
              onChange={(e) => setIndex(Number(e.target.value))} style={{ flex: 1 }} aria-label="Playback"
            />
            <span className="small nowrap">
              {current ? `${timeOnly(current.t)} · ${current.speed} km/h` : 'Drag to replay the day'}
            </span>
          </div>
        </div>
      )}
      <MapView className="map tall">
        <FitBounds points={line} fitKey={`${day}-${points.length}`} />
        {line.length > 1 && <Polyline positions={line} pathOptions={{ color: '#0f766e', weight: 4 }} />}
        {line.length > 0 && (
          <>
            <CircleMarker center={line[0]} radius={7} pathOptions={{ color: '#15803d', fillOpacity: 1 }}><Tooltip>Start {timeOnly(points[0].t)}</Tooltip></CircleMarker>
            <CircleMarker center={line[line.length - 1]} radius={7} pathOptions={{ color: '#c2410c', fillOpacity: 1 }}><Tooltip>End {timeOnly(points[points.length - 1].t)}</Tooltip></CircleMarker>
          </>
        )}
        {current && <Marker position={[current.lat, current.lon]} icon={vehicleIcon({ heading: current.heading })} />}
      </MapView>
      {!loading && points.length === 0 && <Empty>No movement recorded on this day.</Empty>}
    </div>
  );
}

// ---------------- Trips ----------------

export function TripsTab({ device }) {
  const [days, setDays] = useState(7);
  const [selected, setSelected] = useState(null);
  const from = useMemo(() => new Date(Date.now() - days * 86_400_000).toISOString(), [days]);
  const { data, error, loading } = useAsync(() => api(`/devices/${device.id}/trips?from=${encodeURIComponent(from)}`), [device.id, from]);
  const route = useAsync(
    () => (selected ? api(`/devices/${device.id}/trips/${selected}/route`) : Promise.resolve(null)),
    [device.id, selected]
  );
  const trips = data?.data || [];
  const line = (route.data?.data.points || []).map((p) => [p.lat, p.lon]);

  return (
    <div className="split">
      <div className="card flush">
        <div className="row" style={{ padding: 12 }}>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Period">
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>
        <ErrorBox error={error} />
        {loading && !data ? <Spinner /> : trips.length === 0 ? <Empty>No trips in this period.</Empty> : (
          <div className="list">
            {trips.map((t) => (
              <div key={t.id} className={`list-item clickable ${selected === t.id ? 'selected' : ''}`} onClick={() => setSelected(t.id)}>
                <div className="grow">
                  <div className="title">{dateTime(t.startTime)} {t.endTime && `– ${timeOnly(t.endTime)}`}</div>
                  <div className="muted small">{km(t.distanceKm)} · {duration(t.durationS)} · max {t.maxSpeed} km/h{t.idleS ? ` · idle ${duration(t.idleS)}` : ''}</div>
                </div>
                {t.inProgress && <Pill tone="brand">Now</Pill>}
              </div>
            ))}
          </div>
        )}
      </div>
      <MapView className="map tall">
        <FitBounds points={line} fitKey={`${selected}-${line.length}`} />
        {line.length > 1 && <Polyline positions={line} pathOptions={{ color: '#0f766e', weight: 4 }} />}
        {line.length > 0 && <CircleMarker center={line[0]} radius={7} pathOptions={{ color: '#15803d', fillOpacity: 1 }} />}
        {line.length > 1 && <CircleMarker center={line[line.length - 1]} radius={7} pathOptions={{ color: '#c2410c', fillOpacity: 1 }} />}
      </MapView>
    </div>
  );
}

// ---------------- Daily report ----------------

export function ReportTab({ device }) {
  const [days, setDays] = useState(7);
  const to = isoDay();
  const from = isoDay(Date.now() - (days - 1) * 86_400_000);
  const { data, error, loading } = useAsync(() => api(`/devices/${device.id}/reports/daily?from=${from}&to=${to}`), [device.id, days]);
  const report = data?.data;

  // One bar per day, including days without trips.
  const byDay = Object.fromEntries((report?.days || []).map((d) => [d.day, d]));
  const allDays = Array.from({ length: days }, (_, i) => isoDay(Date.parse(`${from}T12:00:00`) + i * 86_400_000));
  const max = Math.max(1, ...allDays.map((d) => byDay[d]?.distanceKm || 0));

  return (
    <div className="stack">
      <div className="row">
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Period" style={{ maxWidth: 200 }}>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>
      <ErrorBox error={error} />
      {loading && !report ? <Spinner /> : report && (
        <>
          <div className="grid grid-4">
            <div className="card stat"><div className="value">{km(report.total.distanceKm)}</div><div className="label">Distance</div></div>
            <div className="card stat"><div className="value">{duration(report.total.drivingS)}</div><div className="label">Driving</div></div>
            <div className="card stat"><div className="value">{duration(report.total.idleS)}</div><div className="label">Idle (engine on, stopped)</div></div>
            <div className="card stat"><div className="value">{report.total.trips}</div><div className="label">Trips · max {report.total.maxSpeed} km/h</div></div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Distance per day</h3><span className="muted small">{report.timezone}</span></div>
            <div className="bars">
              {allDays.map((d) => {
                const v = byDay[d]?.distanceKm || 0;
                return (
                  <div className="bar" key={d} title={`${d}: ${v} km`}>
                    <span className="val">{v ? Math.round(v) : ''}</span>
                    <div className="fill" style={{ height: `${(v / max) * 120}px` }} />
                    <span className="lbl">{new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: days > 14 ? undefined : 'short' })}</span>
                  </div>
                );
              })}
            </div>
            <p className="muted small" style={{ marginTop: 10, marginBottom: 0 }}>{report.note}.</p>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------- Alerts ----------------

export function AlertsTab({ device }) {
  const [type, setType] = useState('');
  const { data, error, loading } = useAsync(
    () => api(`/devices/${device.id}/events?limit=300${type ? `&type=${type}` : ''}`),
    [device.id, type]
  );
  const events = data?.data || [];
  return (
    <div className="card flush">
      <div className="row" style={{ padding: 12 }}>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Alert type" style={{ maxWidth: 240 }}>
          <option value="">All alerts (last 7 days)</option>
          {Object.entries(ALERT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <ErrorBox error={error} />
      {loading && !data ? <Spinner /> : events.length === 0 ? <Empty>No alerts.</Empty> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Time</th><th>Alert</th><th>Where</th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="nowrap">{dateTime(e.time)}</td>
                  <td>{SEVERE_ALERTS.has(e.type) ? <Pill tone="danger">{alertText(e)}</Pill> : alertText(e)}</td>
                  <td>{e.lat != null ? <a href={`https://www.google.com/maps?q=${e.lat},${e.lon}`} target="_blank" rel="noreferrer">Map ↗</a> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
