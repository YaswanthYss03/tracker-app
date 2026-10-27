// Display helpers (same as web/src/lib/format.js).
import type { AlertEvent } from '@/api/types';

export function timeAgo(value?: string | null) {
  if (!value) return 'never';
  const s = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s} s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

/** "Just now", "4 min ago", "5 h ago", "3 d ago" (Home vehicle list). */
export function agoText(value?: string | null) {
  if (!value) return 'No data yet';
  const m = (Date.now() - new Date(value).getTime()) / 60_000;
  if (m < 1) return 'Just now';
  if (m < 60) return `${Math.round(m)} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} d ago`;
}

export function dateTime(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function timeOnly(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function duration(seconds?: number | null) {
  if (seconds == null) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h === 0 ? `${m} min` : `${h} h ${m} min`;
}

export function km(value?: number | null) {
  if (value == null) return '—';
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

/** yyyy-mm-dd in local time. */
export function isoDay(date: Date | number = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const ALERT_LABELS: Record<string, string> = {
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

export const ALERT_ICONS: Record<string, string> = {
  ignition_on: 'key',
  ignition_off: 'key-outline',
  overspeed: 'speedometer',
  geofence_enter: 'enter-outline',
  geofence_exit: 'exit-outline',
  sos: 'warning',
  power_cut: 'flash-off',
  vibration: 'pulse',
  low_battery: 'battery-dead',
  power_off: 'power',
  offline: 'cloud-offline-outline',
  online: 'cloud-done-outline',
  long_stop: 'hourglass-outline',
  gps_lost: 'locate-outline',
};

export const SEVERE_ALERTS = new Set(['sos', 'power_cut', 'overspeed', 'power_off']);

/** 503 -> "8 h 23 min" */
export function stopLength(minutes?: number) {
  if (!minutes || minutes < 60) return `${minutes || 0} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function alertText(a: Pick<AlertEvent, 'type' | 'details'>) {
  const d = a.details || {};
  switch (a.type) {
    case 'overspeed': return `${d.speed} km/h (limit ${d.limit})`;
    case 'geofence_enter': return `Entered ${d.name || 'area'}`;
    case 'geofence_exit': return `Left ${d.name || 'area'}`;
    case 'long_stop': return `Long stop · ${stopLength(d.minutes)}`;
    case 'gps_lost': return 'GPS signal lost';
    default: return ALERT_LABELS[a.type] || a.type;
  }
}

/** Formats an activation code as XXXXX-XXXXX while typing. */
export function formatActivationCode(input: string) {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  return clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean;
}

/** "Meera Raman" -> "MR" (falls back to the email). */
export function initials(name?: string | null, email?: string) {
  const src = (name || email || '?').trim();
  const parts = src.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[1][0] : '')).toUpperCase();
}
