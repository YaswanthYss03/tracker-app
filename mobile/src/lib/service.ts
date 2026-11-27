// Service records: types, labels and "when is the next service" text.
import { useQuery } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';
import { api } from '@/api/client';
import type { NextService, ServiceRecord } from '@/api/types';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const SERVICE_TYPES: { type: ServiceRecord['type']; label: string; icon: IconName }[] = [
  { type: 'general', label: 'General service', icon: 'construct-outline' },
  { type: 'oil', label: 'Oil change', icon: 'water-outline' },
  { type: 'tyres', label: 'Tyres', icon: 'disc-outline' },
  { type: 'brakes', label: 'Brakes', icon: 'stop-circle-outline' },
  { type: 'battery', label: 'Battery', icon: 'battery-charging-outline' },
  { type: 'other', label: 'Other', icon: 'build-outline' },
];
export const serviceType = (t: string) => SERVICE_TYPES.find((x) => x.type === t) ?? SERVICE_TYPES[5];

/** Service due within this many days counts as "due soon" (badge). */
export const DUE_SOON_DAYS = 15;

export function useService(deviceId: string) {
  return useQuery({
    queryKey: ['service', deviceId],
    queryFn: () => api<{ data: ServiceRecord[]; next: NextService | null; estimatedOdometerKm: number | null }>(`/devices/${deviceId}/service`),
  });
}

/** Days from today (local) to a YYYY-MM-DD date. */
export function daysUntil(isoDay: string) {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.parse(`${isoDay}T00:00:00Z`) - today) / 86_400_000);
}

export function dueText(days: number) {
  if (days === 0) return 'Due today';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  return days === -1 ? 'Overdue by 1 day' : `Overdue by ${-days} days`;
}

/** 14 May 2026 */
export function longDate(isoDay: string) {
  return new Date(`${isoDay}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Today as YYYY-MM-DD (local), and n months later. */
export function isoToday(offsetMonths = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offsetMonths);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function addMonths(isoDay: string, months: number) {
  const [y, m, d] = isoDay.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + months, d));
  return dt.toISOString().slice(0, 10);
}
