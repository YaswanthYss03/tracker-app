// Time zones for the Settings picker, each shown as "UTC+5:30 · India · 3:42 pm".
export const TIMEZONES: [string, string][] = [
  ['Asia/Kolkata', 'India'],
  ['Asia/Kathmandu', 'Nepal'],
  ['Asia/Colombo', 'Sri Lanka'],
  ['Asia/Dhaka', 'Bangladesh'],
  ['Asia/Dubai', 'Dubai'],
  ['Asia/Riyadh', 'Saudi Arabia'],
  ['Asia/Singapore', 'Singapore'],
  ['Asia/Kuala_Lumpur', 'Malaysia'],
  ['Asia/Bangkok', 'Thailand'],
  ['Asia/Hong_Kong', 'Hong Kong'],
  ['Asia/Tokyo', 'Japan'],
  ['Australia/Sydney', 'Sydney'],
  ['Europe/London', 'London'],
  ['Europe/Paris', 'Paris'],
  ['UTC', 'UTC'],
  ['America/New_York', 'New York'],
  ['America/Chicago', 'Chicago'],
  ['America/Los_Angeles', 'Los Angeles'],
];

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

export function zoneName(timeZone: string) {
  return TIMEZONES.find(([z]) => z === timeZone)?.[1] ?? timeZone.split('/').pop()!.replace(/_/g, ' ');
}
