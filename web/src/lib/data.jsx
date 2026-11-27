// Data layer: one QueryClient, the fleet (my vehicles + live state) shared by every page,
// and small hooks for drivers, service, alerts and the unread count.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { useLive } from './live';
import { alertText, plateOrName, SEVERE_ALERTS } from './format';
import { useToast } from './toast';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 15_000, refetchOnWindowFocus: true } },
});

const FleetCtx = createContext(null);

/** My vehicles and their live state. Rendered once inside the signed-in layout. */
export function FleetProvider({ children }) {
  const toast = useToast();
  const { data, error, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['devices'],
    queryFn: () => api('/devices'),
    refetchInterval: (q) => (q.state.status === 'error' ? 15_000 : 60_000),
  });
  const devices = useMemo(() => data?.data || [], [data]);
  const names = useMemo(() => Object.fromEntries(devices.map((d) => [d.id, plateOrName(d)])), [devices]);
  const qc = useQueryClient();

  const { live, connected } = useLive(devices.map((d) => d.id), {
    onAlert: (a) => {
      toast(`${names[a.deviceId] || 'Vehicle'}: ${alertText(a)}`, SEVERE_ALERTS.has(a.type) ? 'error' : 'info');
      qc.invalidateQueries({ queryKey: ['my-events'] });
    },
    onRevoked: () => refetch(),
  });

  const stateOf = useCallback((d) => live[d.id] || d.live, [live]);
  const value = useMemo(
    () => ({ devices, stateOf, isLoading, isRefetching, error, connected, refetch }),
    [devices, stateOf, isLoading, isRefetching, error, connected, refetch],
  );
  return <FleetCtx.Provider value={value}>{children}</FleetCtx.Provider>;
}

export function useFleet() {
  const v = useContext(FleetCtx);
  if (!v) throw new Error('useFleet outside FleetProvider');
  return v;
}

export function useDevice(id) {
  const { devices, stateOf } = useFleet();
  const fromList = devices.find((d) => d.id === id);
  const q = useQuery({ queryKey: ['device', id], queryFn: () => api(`/devices/${id}`), select: (r) => r.data, staleTime: 60_000 });
  const device = q.data || fromList;
  return { device, state: device ? stateOf(fromList || device) : null, isLoading: q.isLoading && !fromList, error: q.error, refetch: q.refetch };
}

export const useDrivers = () => useQuery({ queryKey: ['drivers'], queryFn: () => api('/drivers'), select: (r) => r.data });

export const useService = (deviceId) =>
  useQuery({ queryKey: ['service', deviceId], queryFn: () => api(`/devices/${deviceId}/service`) });

/** Refresh everything that shows vehicles or drivers. */
export function useRefresh() {
  const qc = useQueryClient();
  return useCallback(
    () => Promise.all(['devices', 'device', 'drivers', 'service'].map((k) => qc.invalidateQueries({ queryKey: [k] }))),
    [qc],
  );
}

/** Reverse geocode: a short street address for a position (cached on the server). */
export function useAddress(lat, lon) {
  const has = lat != null && lon != null;
  const rl = has ? Math.round(lat * 1000) / 1000 : 0;
  const ro = has ? Math.round(lon * 1000) / 1000 : 0;
  const q = useQuery({
    queryKey: ['address', rl, ro],
    queryFn: () => api(`/geocode/reverse?lat=${rl}&lon=${ro}`),
    enabled: has,
    staleTime: Infinity,
    gcTime: 3_600_000,
    retry: false,
    placeholderData: (prev) => prev,
  });
  return { address: q.data?.data?.address ?? null, loading: has && q.isLoading };
}

// ---- alerts of all my vehicles, and the "new" badge ----
const SEEN_KEY = 'pk.alertsSeenAt';
const seenListeners = new Set();
const readSeen = () => { try { return Number(localStorage.getItem(SEEN_KEY) || 0); } catch { return 0; } };
let seenAt = readSeen();

export const useAlertsFeed = () =>
  useQuery({ queryKey: ['my-events'], queryFn: () => api('/me/events?limit=200'), select: (r) => r.data, refetchInterval: 60_000 });

export function useSeenAt() {
  const [v, setV] = useState(seenAt);
  useEffect(() => {
    const l = () => setV(seenAt);
    seenListeners.add(l);
    return () => seenListeners.delete(l);
  }, []);
  return v;
}

export function markAlertsSeen() {
  seenAt = Date.now();
  try { localStorage.setItem(SEEN_KEY, String(seenAt)); } catch { /* private mode */ }
  seenListeners.forEach((l) => l());
}

export function useUnreadAlerts() {
  const feed = useAlertsFeed();
  const since = useSeenAt() || Date.now() - 86_400_000;
  return (feed.data || []).filter((e) => new Date(e.time).getTime() > since).length;
}

/** Public settings from the server: support contacts, app versions, Google sign-in id. */
export function useAppConfig() {
  return useQuery({ queryKey: ['app-config'], queryFn: () => api('/app/config', { auth: false }), select: (r) => r.data, staleTime: 3_600_000 }).data || null;
}
