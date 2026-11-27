// Shared by every replay screen (Replay tab, Replay a day, a single trip).
import type { RoutePoint } from '@/api/types';

export const ROUTE_RED = '#D93636';

export const hhmm = (d = new Date()) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
export const validTime = (t: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

/** Last point at or before time t (binary search). */
export function pointAt(points: RoutePoint[], t: number) {
  let lo = 0;
  let hi = points.length - 1;
  if (hi < 0 || Date.parse(points[0].t) > t) return null;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (Date.parse(points[mid].t) <= t) lo = mid;
    else hi = mid - 1;
  }
  return points[lo];
}

const R = 6371000;
function meters(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance, riding time, top and average speed of a run of positions. */
export function routeStats(points: RoutePoint[]) {
  let m = 0;
  let idle = 0;
  let top = 0;
  for (let i = 0; i < points.length; i += 1) {
    top = Math.max(top, points[i].speed ?? 0);
    if (i === 0) continue;
    const dt = (Date.parse(points[i].t) - Date.parse(points[i - 1].t)) / 1000;
    if (dt <= 0) continue;
    const d = meters(points[i - 1], points[i]);
    if (d / dt <= 250 / 3.6) m += d; // skip GPS jumps over 250 km/h
    if (dt <= 600 && (points[i].speed ?? 0) < 5) idle += dt;
  }
  const total = points.length > 1 ? (Date.parse(points[points.length - 1].t) - Date.parse(points[0].t)) / 1000 : 0;
  const driveS = Math.max(0, Math.round(total - idle));
  const km = Math.round(m / 100) / 10;
  return { km, driveS, top, avg: driveS > 60 ? Math.min(top, Math.round(km / (driveS / 3600))) : 0 };
}

/** White ringed dots at the start and end of a route. */
export function endDots(points: { lat: number; lon: number }[], id = 'r') {
  if (points.length < 2) return [];
  const a = points[0];
  const b = points[points.length - 1];
  return [
    { id: `${id}-s`, lat: a.lat, lon: a.lon, color: '#FFFFFF', hollow: true },
    { id: `${id}-e`, lat: b.lat, lon: b.lon, color: '#FFFFFF', hollow: true },
  ];
}

/** Replay speeds. 1x = one minute of the ride per second; 10x = ten minutes per second. */
export const SPEEDS = [1, 2, 3, 5, 10];
/** Milliseconds the whole replay takes at 1x (never shorter than 6 s so short trips can still be followed). */
export const baseDuration = (spanMs: number) => Math.max(6000, spanMs / 60);

export type Stop = { lat: number; lon: number; start: number; end: number; durS: number };

/**
 * Places where the vehicle stood still in the middle of the route for `minS` seconds or more
 * (slower than 5 km/h and within 60 m of where it stopped). The wait before the first point and
 * after the last one is not a stop "in between", so it is left out.
 */
export function findStops(points: RoutePoint[], minS = 180): Stop[] {
  const stops: Stop[] = [];
  const n = points.length;
  let i = 0;
  while (i < n) {
    let j = i;
    while (j + 1 < n && (points[j + 1].speed ?? 0) < 5 && meters(points[i], points[j + 1]) < 60) j += 1;
    const start = Date.parse(points[i].t);
    const end = Date.parse(points[j].t);
    if (i > 0 && j < n - 1 && (points[i].speed ?? 0) < 5 && (end - start) / 1000 >= minS) {
      stops.push({ lat: points[i].lat, lon: points[i].lon, start, end, durS: Math.round((end - start) / 1000) });
    }
    i = j + 1;
  }
  return stops;
}

const clockOf = (ms: number) => new Date(ms).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
const waited = (s: number) => (s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min` : `${Math.max(1, Math.round(s / 60))} min`);

/** Map dots for the stops of one route; `now` (ms) keeps the stop the replay is at open. */
export function stopDots(points: RoutePoint[], id: string, now: number | null, plate?: string | null) {
  return findStops(points).map((s, i) => ({
    id: `stop-${id}-${i}`, lat: s.lat, lon: s.lon, color: '#C27400',
    stop: { title: `Stopped ${waited(s.durS)}`, sub: `${clockOf(s.start)} to ${clockOf(s.end)}`, plate: plate ?? undefined, active: now != null && now >= s.start && now <= s.end },
  }));
}
