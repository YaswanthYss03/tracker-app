// One trip in a side panel: route replay, totals with the speedometer, speed chart, from and to.
// `kind` 'auto' = detected by the tracker, 'log' = started by hand.
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAddress } from '../lib/data';
import { duration, km, shortAddress, timeOnly } from '../lib/format';
import { usePlayback } from '../lib/playback';
import { ROUTE_RED, pointAt } from '../lib/replay';
import { ReplayTotals, SpeedChart } from './Charts';
import { MapView } from './MapView';
import ReplayBar from './ReplayBar';
import { ErrorBox, Skeleton } from './ui';
import { errorText } from '../lib/api';

export default function TripView({ deviceId, tripId, kind = 'auto' }) {
  const route = kind === 'log' ? 'trip-logs' : 'trips';
  const q = useQuery({ queryKey: ['trip-route', route, deviceId, tripId], queryFn: () => api(`/devices/${deviceId}/${route}/${tripId}/route?maxPoints=1500`), refetchInterval: kind === 'log' ? 20_000 : false });
  const trip = q.data?.data.trip;
  const points = useMemo(() => q.data?.data.points || [], [q.data]);
  const pb = usePlayback(10_000);
  const has = points.length > 1;
  const t0 = has ? Date.parse(points[0].t) : 0;
  const t1 = has ? Date.parse(points[points.length - 1].t) : 1;
  const tNow = t0 + pb.progress * (t1 - t0);
  const cur = has ? pointAt(points, tNow) : null;
  const coords = useMemo(() => points.map((p) => ({ lat: p.lat, lon: p.lon })), [points]);
  const hasData = points.length > 0;
  const startAddr = useAddress(hasData ? trip?.start.lat : null, hasData ? trip?.start.lon : null).address;
  const endAddr = useAddress(hasData ? trip?.end?.lat ?? points[points.length - 1]?.lat : null, hasData ? trip?.end?.lon ?? points[points.length - 1]?.lon : null).address;

  if (q.isLoading) return <div className="stack"><Skeleton h={300} /><Skeleton h={120} /></div>;
  if (!trip) return <ErrorBox error={q.error ? errorText(q.error) : 'Trip not found'} />;
  const driveS = Math.max(0, trip.durationS - trip.idleS);
  const top = Math.max(trip.maxSpeed, ...points.map((p) => p.speed ?? 0));
  const avg = Math.min(top, trip.avgSpeed || (driveS > 60 ? Math.round(trip.distanceKm / (driveS / 3600)) : 0));
  const playing = pb.progress > 0 && pb.progress < 1;
  const clock = timeOnly(new Date(tNow));
  const endpoints = has ? [{ id: 's', lat: coords[0].lat, lon: coords[0].lon }, { id: 'e', lat: coords[coords.length - 1].lat, lon: coords[coords.length - 1].lon }] : [];

  return (
    <div className="stack">
      <MapView
        height={280}
        expandable
        routes={has ? [{ id: 'trip', color: ROUTE_RED, points: coords }] : []}
        dots={endpoints}
        markers={cur ? [{ id: 'now', kind: 'replay', lat: cur.lat, lon: cur.lon, fill: ROUTE_RED }] : []}
        fitTo={coords}
        fitKey={`${tripId}-${coords.length}`}
        note={!hasData ? 'Nothing recorded yet' : undefined}
      />
      {!hasData && <p className="muted small center">{trip.inProgress ? 'Everything the vehicle records from now on is saved to this trip until the next trip is started.' : 'Nothing was recorded in this trip.'}</p>}
      <ReplayBar progress={pb.progress} playing={pb.playing} onToggle={pb.toggle} onSeek={pb.seek} disabled={!has} label={playing ? clock : undefined} />
      <ReplayTotals distanceKm={km(trip.distanceKm)} driveText={duration(driveS)} top={top} avg={avg} playSpeed={playing ? cur?.speed ?? 0 : null} caption={playing ? `km/h ${clock}` : undefined} size={140} />
      {hasData && (
        <div className="stack sm">
          <div className="bold small">Speed (km/h)</div>
          <SpeedChart points={points.map((p) => [Date.parse(p.t), p.speed ?? 0])} cursor={playing ? pb.progress : null} height={140} />
        </div>
      )}
      <div className="stack sm">
        <div className="row"><span className="dot" style={{ background: ROUTE_RED }} /><span className="bold ellipsis" style={{ flex: 1 }}>{!hasData ? 'Waiting for the first position' : startAddr ? shortAddress(startAddr, 40) : `${trip.start.lat.toFixed(4)}, ${trip.start.lon.toFixed(4)}`}</span><span className="muted small">{timeOnly(trip.startTime)}</span></div>
        <div className="row"><span className="dot" style={{ background: 'var(--ink)' }} /><span className="bold ellipsis" style={{ flex: 1 }}>{trip.inProgress ? (hasData ? 'Still going' : '-') : endAddr ? shortAddress(endAddr, 40) : '-'}</span><span className="muted small">{trip.endTime ? timeOnly(trip.endTime) : 'now'}</span></div>
      </div>
    </div>
  );
}
