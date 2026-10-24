// Alerts for this tracker (last 7 days), all or severe only.
import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { AlertEvent } from '@/api/types';
import { SEVERE_ALERTS } from '@/lib/format';
import { AlertRow } from '@/components/AlertRow';
import { EmptyState, Loading, Segmented } from '@/components/ui';
import { space } from '@/theme';
import type { TabProps } from './types';

export function AlertsTab({ device }: TabProps) {
  const [filter, setFilter] = useState<'all' | 'severe'>('all');
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['events', device.id],
    queryFn: () => api<{ data: AlertEvent[] }>(`/devices/${device.id}/events?limit=300`),
  });
  const events = (data?.data || []).filter((e) => filter === 'all' || SEVERE_ALERTS.has(e.type));

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: space.md, gap: space.md, paddingBottom: 48 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} />}
    >
      <Segmented value={filter} options={[['all', 'All (7 days)'], ['severe', 'Important']]} onChange={setFilter} />
      <View style={{ paddingHorizontal: space.lg, gap: space.sm }}>
        {isLoading ? <Loading /> : events.length === 0 ? (
          <EmptyState icon="notifications-off-outline" title="No alerts" text="Ignition, overspeed, geofence and power alerts show up here." />
        ) : (
          events.map((e) => <AlertRow key={e.id} alert={e} />)
        )}
      </View>
    </ScrollView>
  );
}
