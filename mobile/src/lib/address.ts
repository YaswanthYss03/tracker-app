// Street address for a position, via our server (OpenStreetMap, cached there).
// Rounded to ~110 m here so a moving vehicle doesn't ask on every update.
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

export function useAddress(lat?: number | null, lon?: number | null) {
  const has = lat != null && lon != null;
  const rl = has ? Math.round(lat * 1000) / 1000 : 0;
  const ro = has ? Math.round(lon * 1000) / 1000 : 0;
  const q = useQuery({
    queryKey: ['address', rl, ro],
    queryFn: () => api<{ data: { address: string | null } }>(`/geocode/reverse?lat=${rl}&lon=${ro}`),
    enabled: has,
    staleTime: Infinity,
    gcTime: 60 * 60_000,
    retry: false,
    // Keep showing the last address while the next one loads (moving vehicle).
    placeholderData: keepPreviousData,
  });
  return { address: q.data?.data.address ?? null, isLoading: has && q.isLoading };
}

/**
 * Fit "Road, near Area" on one line (about `max` characters): keep both if they
 * fit, else just the road, else the road cut at a word with "…".
 */
export function shortAddress(address: string, max = 36) {
  const a = address.replace(/\s+/g, ' ').trim();
  if (a.length <= max) return a;
  const road = a.split(', near ')[0].split(',')[0].trim();
  if (road.length <= max) return road;
  const cut = road.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > max * 0.5 ? cut.slice(0, sp) : cut).replace(/[\s,-]+$/, '')}…`;
}
