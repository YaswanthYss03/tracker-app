// Status groups (same rules as the app):
//   moving   online and 5 km/h or more
//   stopped  online and standing still
//   nogps    online, ignition on, but no fresh location for 15 minutes
//   offline  not connected
const GPS_LOST_MS = 15 * 60_000;

export function statusGroup(s) {
  if (!s || !s.online) return 'offline';
  if (s.ignition === true && s.lastSeenAt) {
    const fix = s.gpsTime ? Date.parse(s.gpsTime) : 0;
    if (Date.parse(s.lastSeenAt) - fix >= GPS_LOST_MS) return 'nogps';
  }
  if ((s.speed ?? 0) >= 5) return 'moving';
  return 'stopped';
}

export const STATUS_LABEL = { moving: 'Moving', stopped: 'Stopped', nogps: 'No GPS', offline: 'Offline' };
export const STATUS_ORDER = { moving: 0, stopped: 1, nogps: 2, offline: 3 };
export const STATUS_RING = { moving: '#1F8A55', stopped: '#333333', nogps: '#C27400', offline: '#8A8A8A' };
export const STATUS_DASHED = { moving: false, stopped: false, nogps: true, offline: true };
export const GROUPS = ['moving', 'stopped', 'nogps', 'offline'];
