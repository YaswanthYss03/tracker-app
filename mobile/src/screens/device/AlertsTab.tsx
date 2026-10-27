// Alerts for this vehicle (last 7 days), all or important only. Minimal rows.
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { AlertEvent } from '@/api/types';
import { SEVERE_ALERTS } from '@/lib/format';
import { AlertRow } from '@/components/AlertRow';
import { MiniTabs } from '@/components/MiniTabs';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';
import type { TabProps } from './types';

export function AlertsTab({ device }: TabProps) {
  const c = useColors();
  const [filter, setFilter] = useState<'all' | 'severe'>('all');
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['events', device.id],
    queryFn: () => api<{ data: AlertEvent[] }>(`/devices/${device.id}/events?limit=300`),
  });
  const events = (data?.data || []).filter((e) => filter === 'all' || SEVERE_ALERTS.has(e.type));

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, paddingBottom: 24, gap: 8 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} colors={[c.text]} />}
    >
      <MiniTabs value={filter} options={[['all', 'All'], ['severe', 'Important']]} onChange={setFilter} />
      <View style={{ gap: 2, marginHorizontal: -12 }}>
        {isLoading ? (
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: c.textMuted, textAlign: 'center', paddingVertical: 32 }}>Loading…</Text>
        ) : events.length === 0 ? (
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: c.textMuted, textAlign: 'center', paddingVertical: 32 }}>No alerts in the last 7 days.</Text>
        ) : (
          events.map((e) => <AlertRow key={e.id} alert={e} />)
        )}
      </View>
    </ScrollView>
  );
}
