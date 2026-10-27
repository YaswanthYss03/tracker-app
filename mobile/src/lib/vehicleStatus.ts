// Status groups for the Home filters, cards and the map:
//   moving   online and going 5 km/h or more
//   stopped  online and standing still
//   nogps    online, ignition on, but no fresh location for 15 min
//            (same rule as the server's "GPS lost" alert)
//   offline  not connected (or never sent anything)
import type { Live } from '@/api/types';
import type { Palette } from '@/theme';

export type StatusGroup = 'moving' | 'stopped' | 'nogps' | 'offline';

const GPS_LOST_MS = 15 * 60_000;

export function statusGroup(s: Live): StatusGroup {
  if (!s.online) return 'offline';
  if (s.ignition === true && s.lastSeenAt) {
    const fix = s.gpsTime ? Date.parse(s.gpsTime) : 0;
    if (Date.parse(s.lastSeenAt) - fix >= GPS_LOST_MS) return 'nogps';
  }
  if ((s.speed ?? 0) >= 5) return 'moving';
  return 'stopped';
}

export const STATUS_LABEL: Record<StatusGroup, string> = { moving: 'Moving', stopped: 'Stopped', nogps: 'No GPS', offline: 'Offline' };
export const STATUS_ORDER: Record<StatusGroup, number> = { moving: 0, stopped: 1, nogps: 2, offline: 3 };

export function statusColor(g: StatusGroup, c: Palette) {
  return { moving: c.success, stopped: c.text, nogps: c.accent, offline: c.offline }[g];
}
