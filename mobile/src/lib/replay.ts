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
