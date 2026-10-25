// Simple status groups for the Home filters and cards.
import type { Live } from '@/api/types';
import type { Palette } from '@/theme';

export type StatusGroup = 'moving' | 'stopped' | 'idle' | 'offline';

export function statusGroup(s: Live): StatusGroup {
  if (!s.online) return 'offline';
  if ((s.speed ?? 0) >= 5) return 'moving';
  if (s.ignition === true) return 'idle';
  return 'stopped';
}

export const STATUS_LABEL: Record<StatusGroup, string> = { moving: 'Moving', stopped: 'Stopped', idle: 'Idle', offline: 'Offline' };

export function statusColor(g: StatusGroup, c: Palette) {
  return { moving: c.success, stopped: c.text, idle: c.accent, offline: c.offline }[g];
}
