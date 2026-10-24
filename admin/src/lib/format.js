// Display helpers.

export function timeAgo(value) {
  if (!value) return 'never';
  const s = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s} s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

export function dateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export function timeOnly(value) {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function duration(seconds) {
  if (seconds == null) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return `${h} h ${m} min`;
}

export function km(value) {
  if (value == null) return '—';
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} km`;
}

/** yyyy-mm-dd in the browser's timezone, for <input type="date">. */
export function isoDay(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const ALERT_LABELS = {
  ignition_on: 'Ignition on',
  ignition_off: 'Ignition off',
  overspeed: 'Overspeed',
  geofence_enter: 'Entered area',
  geofence_exit: 'Left area',
  sos: 'SOS',
  power_cut: 'Power cut',
  vibration: 'Vibration',
  low_battery: 'Low battery',
  power_off: 'Tracker off',
  offline: 'Offline',
  online: 'Back online',
};

export function alertText(a) {
  const d = a.details || {};
  switch (a.type) {
    case 'overspeed': return `${d.speed} km/h (limit ${d.limit})`;
    case 'geofence_enter': return `Entered ${d.name || 'area'}`;
    case 'geofence_exit': return `Left ${d.name || 'area'}`;
    default: return ALERT_LABELS[a.type] || a.type;
  }
}

export const SEVERE_ALERTS = new Set(['sos', 'power_cut', 'overspeed', 'power_off']);

export function downloadCsv(filename, rows) {
  const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
