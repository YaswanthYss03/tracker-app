// Street address for a position, via our server (OpenStreetMap, cached there).
// Rounded to ~110 m here so a moving vehicle doesn't ask on every update.
import { useQuery } from '@tanstack/react-query';
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
  });
  return { address: q.data?.data.address ?? null, isLoading: has && q.isLoading };
}
