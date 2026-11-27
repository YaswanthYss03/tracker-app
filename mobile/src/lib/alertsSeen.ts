// "New alerts" badge on the bell: alerts newer than the last time the user
// opened the Alerts screen (remembered on the phone).
import * as SecureStore from 'expo-secure-store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { AlertEvent } from '@/api/types';

const KEY = 'alertsSeenAt';

export type FeedItem = AlertEvent & { deviceName: string };

/** Alerts of the last 7 days (shared by the bell badge and the Alerts screen). */
export function useAlertsFeed() {
  return useQuery({
    queryKey: ['my-events'],
    queryFn: () => api<{ data: FeedItem[] }>('/me/events?limit=200'),
    refetchInterval: 60_000,
  });
}

export function useUnreadAlerts() {
  const feed = useAlertsFeed();
  const seen = useQuery({
    queryKey: ['alerts-seen'],
    queryFn: async () => Number((await SecureStore.getItemAsync(KEY)) || 0),
    staleTime: Infinity,
  });
  const since = seen.data ?? Date.now();
  return (feed.data?.data || []).filter((e) => new Date(e.time).getTime() > since).length;
}

/** Call when the Alerts screen opens: clears the badge. */
export function useMarkAlertsSeen() {
  const queryClient = useQueryClient();
  return () => {
    const now = Date.now();
    queryClient.setQueryData(['alerts-seen'], now);
    SecureStore.setItemAsync(KEY, String(now)).catch(() => {});
  };
}
