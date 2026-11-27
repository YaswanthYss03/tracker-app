// Shared by every replay view (Replay page, Replay a day, a single trip).
export const ROUTE_RED = '#D93636';
// One colour per vehicle (by its place in the list): red, blue, green, amber, purple, teal.
export const ROUTE_COLORS = ['#D93636', '#2F64A8', '#1F8A55', '#C27400', '#7A4FA8', '#2A8C82'];

export const hhmm = (d = new Date()) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
export const validTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

/** Last point at or before time t (binary search). */
export function pointAt(points, t) {
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
function meters(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance, riding time, top and average speed of a run of positions. */
export function routeStats(points) {
  let m = 0;
  let idle = 0;
  let top = 0;
  for (let i = 0; i < points.length; i += 1) {
    top = Math.max(top, points[i].speed ?? 0);
    if (i === 0) continue;
    const dt = (Date.parse(points[i].t) - Date.parse(points[i - 1].t)) / 1000;
    if (dt <= 0) continue;
    const d = meters(points[i - 1], points[i]);
    if (d / dt <= 250 / 3.6) m += d;
    if (dt <= 600 && (points[i].speed ?? 0) < 5) idle += dt;
  }
  const total = points.length > 1 ? (Date.parse(points[points.length - 1].t) - Date.parse(points[0].t)) / 1000 : 0;
  const driveS = Math.max(0, Math.round(total - idle));
  const km = Math.round(m / 100) / 10;
  return { km, driveS, top, avg: driveS > 60 ? Math.min(top, Math.round(km / (driveS / 3600))) : 0 };
}

/** Same totals from a list of trips. */
export function tripStats(list) {
  const dist = list.reduce((a, t) => a + t.distanceKm, 0);
  const driveS = list.reduce((a, t) => a + Math.max(0, t.durationS - t.idleS), 0);
  const top = list.reduce((a, t) => Math.max(a, t.maxSpeed), 0);
  return {
    km: Math.round(dist * 10) / 10,
    driveS,
    hours: Math.round((driveS / 3600) * 10) / 10,
    top,
    avg: driveS > 60 ? Math.min(top, Math.round(dist / (driveS / 3600))) : 0,
  };
}

/** Replay speeds. 1x = one minute of the ride per second; 10x = ten minutes per second. */
export const SPEEDS = [1, 2, 3, 5, 10];
/** Milliseconds the whole replay takes at 1x (never shorter than 6 s so short trips can still be followed). */
export const baseDuration = (spanMs) => Math.max(6000, spanMs / 60);

/**
 * Places where the vehicle stood still in the middle of the route for `minS` seconds or more
 * (slower than 5 km/h and within 60 m of where it stopped). The wait before the first point and
 * after the last one is not a stop "in between", so it is left out.
 */
export function findStops(points, minS = 180) {
  const stops = [];
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

const clockOf = (ms) => new Date(ms).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
const waited = (s) => (s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min` : `${Math.max(1, Math.round(s / 60))} min`);
/** Text of the pop-up on a stop (HTML; only numbers and a plate, no free text). */
export function stopTip(s, plate) {
  const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  return `${plate ? `<b>${esc(plate)}</b><br>` : ''}<b>Stopped ${waited(s.durS)}</b><br>${clockOf(s.start)} to ${clockOf(s.end)}`;
}
