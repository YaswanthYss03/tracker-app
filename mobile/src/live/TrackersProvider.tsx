/**
 * My trackers + their live state, shared by the Home and Map tabs so the app
 * keeps ONE live connection. Also shows alert banners while the tabs are open.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, type ApiError } from '@/api/client';
import { deviceName, type Device, type Live } from '@/api/types';
import { useLive } from '@/live/useLive';
import { alertText, SEVERE_ALERTS } from '@/lib/format';
import { AlertBanner, type BannerAlert } from '@/components/AlertBanner';

type TrackersValue = {
  devices: Device[];
  /** Latest live state (WebSocket, falling back to the last API answer). */
  stateOf: (d: Device) => Live;
  isLoading: boolean;
  isRefetching: boolean;
  error: unknown;
  /** No connection: the list shown is the last one saved (at updatedAt). */
  offline: boolean;
  updatedAt: number;
  refetch: () => void;
};

const Ctx = createContext<TrackersValue | null>(null);

export function TrackersProvider({ children }: { children: ReactNode }) {
  const [banner, setBanner] = useState<BannerAlert | null>(null);
  const { data, error, isLoading, refetch, isRefetching, dataUpdatedAt } = useQuery({
    queryKey: ['devices'],
    queryFn: () => api<{ data: Device[] }>('/devices'),
    // After a failure keep trying quietly, so the screen recovers by itself.
    refetchInterval: (q) => (q.state.status === 'error' ? 15_000 : false),
  });
  const devices = useMemo(() => data?.data || [], [data]);
  const names = useMemo(() => Object.fromEntries(devices.map((d) => [d.id, deviceName(d)])), [devices]);

  const { live } = useLive(devices.map((d) => d.id), {
    onAlert: (a) => setBanner({ title: names[a.deviceId] || 'Tracker', text: alertText(a), severe: SEVERE_ALERTS.has(a.type), deviceId: a.deviceId }),
    onRevoked: () => refetch(),
  });

  const value: TrackersValue = {
    devices,
    stateOf: (d) => live[d.id] || d.live,
    isLoading,
    isRefetching,
    error,
    offline: Boolean(error && (error as ApiError).code === 'NETWORK'),
    updatedAt: dataUpdatedAt,
    refetch: () => {
      refetch();
    },
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      {banner && <AlertBanner alert={banner} onClose={() => setBanner(null)} />}
    </Ctx.Provider>
  );
}

export function useTrackers() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTrackers outside TrackersProvider');
  return v;
}
