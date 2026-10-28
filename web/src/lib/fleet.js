// Fleet helpers shared by the dashboard, vehicle list and map pages.
import { plateOrName } from './format';
import { STATUS_DASHED, STATUS_RING, statusGroup } from './status';

/** Rows with live state and status group for every vehicle. */
export function fleetRows(devices, stateOf) {
  return devices.map((d) => {
    const s = stateOf(d);
    return { d, s, g: statusGroup(s) };
  });
}

export function countByGroup(rows) {
  const n = { moving: 0, stopped: 0, nogps: 0, offline: 0 };
  rows.forEach((r) => { n[r.g] += 1; });
  return n;
}

/** Map markers (round picture with a status ring and plate tag). */
export function fleetMarkers(rows, selectedId) {
  return rows
    .filter((r) => r.s?.lat != null && r.s?.lon != null)
    .map((r) => ({
      id: r.d.id, kind: 'vehicle', lat: r.s.lat, lon: r.s.lon, vehicle: r.d.icon, ring: STATUS_RING[r.g], dashed: STATUS_DASHED[r.g],
      label: plateOrName(r.d), selected: r.d.id === selectedId,
    }));
}
