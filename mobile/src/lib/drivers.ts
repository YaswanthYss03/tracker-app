// Drivers: list + save helpers (React Query).
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { DriverFull } from '@/api/types';

export function useDrivers() {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: () => api<{ data: DriverFull[] }>('/drivers'),
    select: (r) => r.data,
  });
}

/** Refresh everything that shows drivers (lists, vehicles, a vehicle page). */
export function useRefreshDrivers() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ['drivers'] }),
      qc.invalidateQueries({ queryKey: ['devices'] }),
      qc.invalidateQueries({ queryKey: ['device'] }),
    ]);
}

/** "TN 38 BX 4521" -> "4521" (short label under a driver). */
export function plateTail(plate?: string | null, fallback?: string | null) {
  if (plate) return plate.split(' ').pop() ?? plate;
  return fallback ?? '';
}

/** 2026-11-12 <-> 12/11/2026 */
export const isoToDmy = (iso?: string | null) => (iso ? iso.split('-').reverse().join('/') : '');
export function dmyToIso(dmy: string): string | null | 'invalid' {
  const t = dmy.trim();
  if (!t) return null;
  const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return 'invalid';
  const [, d, mo, y] = m;
  const iso = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.getUTCDate() !== Number(d) ? 'invalid' : iso;
}

/** Types "12112026" as "12/11/2026". */
export function maskDate(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
}
