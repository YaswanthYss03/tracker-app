// Every country's time zones, each shown as "UTC+5:30  India  7:09 pm".
import { ALL_ZONES } from './timezoneData';

const cityOf = (zone) => zone.split('/').slice(1).join(' / ').replace(/_/g, ' ') || zone;
export const ZONES = ALL_ZONES.map(([zone, country]) => ({ zone, country, city: cityOf(zone) }));
const byZone = new Map(ZONES.map((z) => [z.zone, z]));
const perCountry = new Map();
for (const z of ZONES) perCountry.set(z.country, (perCountry.get(z.country) ?? 0) + 1);

const fmtCache = new Map();
function partsFormatter(timeZone) {
  let f = fmtCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    fmtCache.set(timeZone, f);
  }
  return f;
}

/** Minutes the zone is ahead of UTC right now (5:30 -> 330). */
export function offsetMinutes(timeZone, at = new Date()) {
  try {
    const parts = partsFormatter(timeZone).formatToParts(at);
    const get = (t) => Number(parts.find((p) => p.type === t)?.value);
    const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
    return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
  } catch {
    return 0;
  }
}

export function utcLabel(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const m = Math.abs(minutes);
  return `UTC${sign}${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

export function clockIn(timeZone, at = new Date()) {
  try {
    return at.toLocaleTimeString('en-IN', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
}

export function zoneName(timeZone) {
  const z = byZone.get(timeZone);
  if (!z) return cityOf(timeZone);
  return (perCountry.get(z.country) ?? 1) > 1 ? `${z.country}, ${z.city}` : z.country;
}
