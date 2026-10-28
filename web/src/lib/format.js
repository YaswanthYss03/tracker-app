// Display helpers (same wording as the app).

export function timeAgo(value) {
  if (!value) return 'never';
  const s = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s} s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

/** "Just now", "4 min ago", "5 h ago", "3 d ago" (vehicle lists). */
export function agoText(value) {
  if (!value) return 'No data yet';
  const m = (Date.now() - new Date(value).getTime()) / 60000;
  if (m < 1) return 'Just now';
  if (m < 60) return `${Math.round(m)} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} d ago`;
}

export function dateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export function timeOnly(value) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export function duration(seconds) {
  if (seconds == null) return '-';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return `${h} h ${m} min`;
}

/** 12345.67 -> "12,345.7" (no unit). */
export function km(value) {
  if (value == null) return '-';
  return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 1 });
}

/** yyyy-mm-dd in the browser's time zone. */
export function isoDay(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const dmy = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

export function dayLabel(iso) {
  const d = new Date(iso);
  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(new Date()) - start(d)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Groups items (newest first) under Today / Yesterday / date headings. */
export function groupByDay(items, key = 'time') {
  const out = [];
  for (const it of items) {
    const title = dayLabel(it[key]);
    const last = out[out.length - 1];
    if (last && last.title === title) last.items.push(it);
    else out.push({ title, items: [it] });
  }
  return out;
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
  offline: 'Went offline',
  online: 'Back online',
  long_stop: 'Long stop',
  gps_lost: 'GPS lost',
};

/** Icon name (see Icon.jsx) per alert type. */
export const ALERT_ICONS = {
  ignition_on: 'key', ignition_off: 'key', overspeed: 'gauge', geofence_enter: 'pin', geofence_exit: 'pin', sos: 'alert',
  power_cut: 'battery', vibration: 'activity', low_battery: 'battery', power_off: 'power', offline: 'wifiOff', online: 'wifi',
  long_stop: 'clock', gps_lost: 'gpsOff',
};

export const SEVERE_ALERTS = new Set(['sos', 'power_cut', 'overspeed', 'power_off']);

export function stopLength(minutes) {
  if (!minutes || minutes < 60) return `${minutes || 0} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function alertText(a) {
  const d = a.details || {};
  switch (a.type) {
    case 'overspeed': return `${d.speed} km/h (limit ${d.limit})`;
    case 'geofence_enter': return `Entered ${d.name || 'area'}`;
    case 'geofence_exit': return `Left ${d.name || 'area'}`;
    case 'long_stop': return `Long stop, ${stopLength(d.minutes)}`;
    case 'gps_lost': return 'GPS signal lost';
    default: return ALERT_LABELS[a.type] || a.type;
  }
}

export const deviceName = (d) => d.name || `Tracker ${d.imei.slice(-4)}`;
/** Number plate if set, else the vehicle name. */
export const plateOrName = (d) => d.registrationNumber || deviceName(d);
/** "TN 38 BX 4521" -> "BX 4521" */
export function shortPlate(d) {
  const parts = (d.registrationNumber || '').split(' ');
  return parts.length >= 3 ? parts.slice(-2).join(' ') : plateOrName(d);
}
export const plateTail = (d) => (d.registrationNumber ? d.registrationNumber.split(' ').pop() : deviceName(d));

export function initials(name, email) {
  const src = (name || email || '?').trim();
  const parts = src.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[1][0] : '')).toUpperCase();
}

export function formatActivationCode(input) {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  return clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean;
}

/** Fit "Road, near Area" on one line: keep both if short, else the road, else cut at a word. */
export function shortAddress(address, max = 44) {
  const a = (address || '').replace(/\s+/g, ' ').trim();
  if (a.length <= max) return a;
  const road = a.split(', near ')[0].split(',')[0].trim();
  if (road.length <= max) return road;
  const cut = road.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > max * 0.5 ? cut.slice(0, sp) : cut).replace(/[\s,-]+$/, '')}...`;
}

export function downloadCsv(filename, rows) {
  const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
