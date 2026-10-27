// Time zones for the Settings picker, each shown as "UTC+5:30 · India · 3:42 pm".
import { ALL_ZONES } from './timezoneData';

export type Zone = { zone: string; country: string; city: string };

const cityOf = (zone: string) => zone.split('/').slice(1).join(' / ').replace(/_/g, ' ') || zone;

/** Every country's time zones, A–Z by country (India first for convenience is handled by the picker). */
export const ZONES: Zone[] = ALL_ZONES.map(([zone, country]) => ({ zone, country, city: cityOf(zone) }));
const byZone = new Map(ZONES.map((z) => [z.zone, z]));
const perCountry = new Map<string, number>();
for (const z of ZONES) perCountry.set(z.country, (perCountry.get(z.country) ?? 0) + 1);

/** Minutes the zone is ahead of UTC right now (5:30 -> 330). */
export function offsetMinutes(timeZone: string, at = new Date()): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
    }).formatToParts(at);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
    return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
  } catch {
    return 0;
  }
}

/** 330 -> "UTC+5:30", -300 -> "UTC-5:00", 0 -> "UTC+0:00" */
export function utcLabel(minutes: number) {
  const sign = minutes < 0 ? '-' : '+';
  const m = Math.abs(minutes);
  return `UTC${sign}${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

/** "3:42 pm" in that zone. */
export function clockIn(timeZone: string, at = new Date()) {
  try {
    return at.toLocaleTimeString('en-IN', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
}

/** "India", or "United States · New York" when the country has several zones. */
export function zoneName(timeZone: string) {
  const z = byZone.get(timeZone);
  if (!z) return cityOf(timeZone);
  return (perCountry.get(z.country) ?? 1) > 1 ? `${z.country} · ${z.city}` : z.country;
}
