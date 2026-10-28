// Replay: pick a vehicle (or several with Compare), a day and a time window. The map replays the
// route(s) with a moving dot, the dial shows the speed, the line chart shows speed over time.
// Also used inside a vehicle as "Replay a day" (locked to that vehicle).
import { useEffect, useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useFleet } from '../lib/data';
import { dmy, duration, isoDay, km, plateOrName, plateTail, shortPlate, timeOnly } from '../lib/format';
import { usePlayback } from '../lib/playback';
import { ROUTE_COLORS, ROUTE_RED, hhmm, pointAt, tripStats, validTime } from '../lib/replay';
import { STATUS_RING, statusGroup } from '../lib/status';
import { ReplayTotals, SpeedChart } from '../components/Charts';
import Icon from '../components/Icon';
import { MapView } from '../components/MapView';
import ReplayBar from '../components/ReplayBar';
import TripView from '../components/TripView';
import { Button, Card, Chip, Drawer, Empty, Field, Input, PageHead, Skeleton } from '../components/ui';

const DAY = 86_400_000;

export default function ReplayPage() {
  return (
    <div className="page">
      <ReplayView />
    </div>
  );
}

export function ReplayView({ lockedId }) {
  const { devices, stateOf } = useFleet();
  const today = isoDay();
  const sorted = useMemo(() => [...devices].sort((a, b) => plateOrName(a).localeCompare(plateOrName(b))), [devices]);
  const colorOf = (id) => ROUTE_COLORS[Math.max(0, sorted.findIndex((d) => d.id === id)) % ROUTE_COLORS.length];
  const [compare, setCompare] = useState(false);
  const [selected, setSelected] = useState(lockedId ? [lockedId] : []);
  const [date, setDate] = useState(today);
  const [fromText, setFrom] = useState('00:00');
  const [toText, setTo] = useState(hhmm());
  const [open, setOpen] = useState(null); // trip shown in the side panel
  const pb = usePlayback(12_000);

  useEffect(() => { if (!lockedId && !selected.length && sorted.length) setSelected([sorted[0].id]); }, [lockedId, sorted, selected.length]);
  useEffect(() => { if (lockedId) setSelected([lockedId]); }, [lockedId]);

  const from = validTime(fromText) ? fromText : '00:00';
  const to = validTime(toText) ? toText : date === today ? hhmm() : '23:59';
  const winStart = new Date(`${date}T${from}:00`).getTime();
  const winEnd = new Date(`${date}T${to}:59`).getTime();
  const anchor = Date.parse(`${today}T12:00:00`) - Date.parse(`${date}T12:00:00`) < 7 * DAY ? today : date;
  const week = Array.from({ length: 7 }, (_, i) => isoDay(Date.parse(`${anchor}T12:00:00`) - (6 - i) * DAY));
  const weekStart = new Date(`${week[0]}T00:00:00`).toISOString();
  const weekEnd = new Date(`${anchor}T23:59:59`).toISOString();

  const tripQs = useQueries({ queries: selected.map((id) => ({ queryKey: ['trips-week', id, anchor], queryFn: () => api(`/devices/${id}/trips?from=${encodeURIComponent(weekStart)}&to=${encodeURIComponent(weekEnd)}`) })) });
  const routeQs = useQueries({
    queries: selected.map((id) => ({
      queryKey: ['positions-window', id, winStart, winEnd],
      enabled: winEnd > winStart,
      queryFn: () => api(`/devices/${id}/positions?from=${encodeURIComponent(new Date(winStart).toISOString())}&to=${encodeURIComponent(new Date(Math.min(winEnd, Date.now())).toISOString())}&maxPoints=1500`),
    })),
  });
  const loading = tripQs.some((q) => q.isLoading) || routeQs.some((q) => q.isLoading);
  const allTrips = selected.flatMap((id, i) => (tripQs[i]?.data?.data || []).map((t) => ({ ...t, deviceId: id })));
  const perDay = week.map((d) => allTrips.filter((t) => isoDay(Date.parse(t.startTime)) === d).reduce((a, t) => a + t.distanceKm, 0));
  const maxDay = Math.max(1, ...perDay);
  const windowTrips = allTrips.filter((t) => Date.parse(t.startTime) >= winStart && Date.parse(t.startTime) <= winEnd).sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime));

  const pointsBy = selected.map((id, i) => ({ id, color: colorOf(id), points: routeQs[i]?.data?.data.points || [] }));
  const times = pointsBy.flatMap((r) => (r.points.length ? [Date.parse(r.points[0].t), Date.parse(r.points[r.points.length - 1].t)] : []));
  const t0 = times.length ? Math.min(...times) : winStart;
  const t1 = times.length ? Math.max(...times) : winEnd;
  const tNow = t0 + pb.progress * (t1 - t0);
  const hasRoute = pointsBy.some((r) => r.points.length > 1);
  useEffect(() => { pb.reset(); }, [date, from, to, selected.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const byId = new Map(devices.map((d) => [d.id, d]));
  const markers = pointsBy.flatMap((r) => {
    const p = pointAt(r.points, tNow);
    const d = byId.get(r.id);
    return p && d ? [{ id: r.id, kind: 'replay', lat: p.lat, lon: p.lon, fill: compare ? r.color : ROUTE_RED, label: compare ? plateTail(d) : undefined }] : [];
  });
  const fit = pointsBy.flatMap((r) => r.points.map((p) => ({ lat: p.lat, lon: p.lon })));
  const routes = pointsBy.filter((r) => r.points.length > 1).map((r) => ({ id: r.id, color: compare ? r.color : ROUTE_RED, points: r.points.map((p) => ({ lat: p.lat, lon: p.lon })) }));
  const dots = windowTrips.slice(0, 40).flatMap((t) => [{ id: `${t.id}s`, lat: t.start.lat, lon: t.start.lon }, ...(t.end ? [{ id: `${t.id}e`, lat: t.end.lat, lon: t.end.lon }] : [])]);

  const total = tripStats(windowTrips);
  const playing = pb.progress > 0 && pb.progress < 1;
  const playSpeed = !compare && playing && pointsBy[0] ? pointAt(pointsBy[0].points, tNow)?.speed ?? 0 : null;
  const clock = new Date(tNow).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

  function toggle(id) {
    if (lockedId) return;
    if (!compare) return setSelected([id]);
    setSelected(selected.includes(id) ? (selected.length > 1 ? selected.filter((x) => x !== id) : selected) : [...selected, id]);
  }
  function setCompareMode(on) { setCompare(on); if (!on) setSelected(selected.slice(0, 1)); }
  function pickDay(d) { setDate(d); setFrom('00:00'); setTo(d === today ? hhmm() : '23:59'); }

  if (!devices.length) return <Empty icon="trips" title="No vehicles yet">Replay appears once a vehicle is added and drives.</Empty>;

  return (
    <div className="stack lg">
      {!lockedId && (
        <PageHead title="Replay" sub="Watch a day or a trip again, with speed">
          <Button variant={compare ? 'primary' : 'outline'} icon="swap" onClick={() => setCompareMode(!compare)} aria-pressed={compare}>Compare vehicles</Button>
        </PageHead>
      )}
      {!lockedId && (
        <div className="chips">
          {compare && <Chip on={selected.length === sorted.length} onClick={() => setSelected(selected.length === sorted.length ? [sorted[0].id] : sorted.map((d) => d.id))}>All</Chip>}
          {sorted.map((d) => (
            <Chip key={d.id} on={selected.includes(d.id)} dot={compare ? undefined : statusGroup(stateOf(d))} ring={compare ? colorOf(d.id) : undefined} onClick={() => toggle(d.id)}>
              <span className="plate">{shortPlate(d)}</span>
            </Chip>
          ))}
        </div>
      )}

      <div className="grid main-side">
        <div className="stack">
          <MapView height={460} expandable routes={routes} dots={dots} markers={markers} fitTo={fit} fitKey={`${selected.join(',')}-${winStart}-${winEnd}-${fit.length > 0}`} note={!loading && !hasRoute ? 'No driving in this time window' : undefined} />
          <Card>
            <ReplayBar progress={pb.progress} playing={pb.playing} onToggle={pb.toggle} onSeek={pb.seek} disabled={!hasRoute} label={hasRoute ? clock : undefined} />
          </Card>
          {hasRoute && (
            <Card title="Speed" action={<span className="muted small">km/h over time</span>}>
              <SpeedChart
                series={pointsBy.filter((r) => r.points.length > 1).map((r) => ({ color: compare ? r.color : 'var(--accent)', points: r.points.map((p) => [Date.parse(p.t), p.speed ?? 0]) }))}
                cursor={playing ? pb.progress : null}
                height={170}
              />
              {compare && <div className="legend" style={{ marginTop: 8 }}>{pointsBy.map((r) => <span key={r.id}><i style={{ background: r.color }} />{plateOrName(byId.get(r.id))}</span>)}</div>}
            </Card>
          )}
        </div>

        <div className="stack">
          <Card title="When">
            <div className="stack">
              <Input label="Date" type="date" max={today} value={date} onChange={(e) => e.target.value && pickDay(e.target.value)} />
              <div className="form-grid">
                <Input label="From" type="time" value={fromText} onChange={(e) => setFrom(e.target.value)} />
                <Input label="To" type="time" value={toText} onChange={(e) => setTo(e.target.value)} />
              </div>
              <div className="week" aria-label="Kilometres per day">
                {week.map((d, i) => {
                  const on = d === date;
                  return (
                    <button key={d} type="button" className={`day ${on ? 'on' : ''}`} onClick={() => pickDay(d)} aria-pressed={on} aria-label={`${dmy(d)}, ${km(perDay[i])} km`}>
                      <span className="km" style={{ opacity: on ? 1 : 0 }}>{Math.round(perDay[i])} km</span>
                      <span className="b" style={{ height: 28 + (perDay[i] / maxDay) * 36 }} />
                      <span className="n">{d === today ? 'Today' : new Date(`${d}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card title={compare ? 'Comparison' : 'Totals'}>
            {loading ? <Skeleton h={150} /> : compare ? (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Vehicle</th><th className="num">km</th><th className="num">Hrs</th><th className="num">Top</th><th className="num">Avg</th></tr></thead>
                  <tbody>
                    {selected.map((id) => {
                      const d = byId.get(id);
                      const s = tripStats(windowTrips.filter((x) => x.deviceId === id));
                      return d && (
                        <tr key={id}>
                          <td><span className="row" style={{ gap: 8 }}><span className="dot" style={{ background: colorOf(id) }} /><span className="plate">{shortPlate(d)}</span></span></td>
                          <td className="num bold">{km(s.km)}</td><td className="num">{s.hours}</td><td className="num">{s.top}</td><td className="num">{s.avg}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <ReplayTotals distanceKm={km(total.km)} driveText={duration(total.driveS)} top={total.top} avg={total.avg} playSpeed={playSpeed} caption={playSpeed != null ? `km/h ${clock}` : undefined} size={140} />
            )}
          </Card>

          <Card title={`${windowTrips.length} ${windowTrips.length === 1 ? 'trip' : 'trips'}`} pad={false}>
            {windowTrips.length === 0 ? <div className="muted small" style={{ padding: '0 20px 20px' }}>No trips started in this time window.</div> : (
              <div style={{ padding: '0 12px 12px' }}>
                {windowTrips.map((t) => {
                  const d = byId.get(t.deviceId);
                  return (
                    <div key={t.id} className="item click" onClick={() => setOpen(t)}>
                      {compare && <span className="dot" style={{ background: colorOf(t.deviceId) }} />}
                      <div className="body">
                        <div className="t plate" style={{ fontSize: 14 }}>{d ? plateOrName(d) : ''}</div>
                        <div className="d">{timeOnly(t.startTime)} - {t.endTime ? timeOnly(t.endTime) : 'now'} - {t.inProgress ? 'in progress' : duration(t.durationS)}</div>
                      </div>
                      <b>{km(t.distanceKm)} km</b>
                      <Icon name="chevR" size={16} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
      {open && (
        <Drawer title={`Trip, ${dmy(isoDay(Date.parse(open.startTime)))}`} onClose={() => setOpen(null)}>
          <TripView deviceId={open.deviceId} tripId={open.id} kind="auto" />
        </Drawer>
      )}
    </div>
  );
}
