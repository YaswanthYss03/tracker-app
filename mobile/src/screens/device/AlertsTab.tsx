// Alerts for this vehicle (last 7 days): filter chips, then day by day. Flat list, no cards.
import { useMemo, useState } from 'react';
import { RefreshControl, SectionList, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { AlertEvent } from '@/api/types';
import { SEVERE_ALERTS } from '@/lib/format';
import { groupByDay } from '@/lib/alertGroups';
import { AlertRow } from '@/components/AlertRow';
import { MiniTabs } from '@/components/MiniTabs';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';
import type { TabProps } from './types';

type Filter = 'all' | 'important' | 'ignition' | 'speed' | 'areas' | 'status';
const KIND: Record<Exclude<Filter, 'all' | 'important'>, string[]> = {
  ignition: ['ignition_on', 'ignition_off'],
  speed: ['overspeed'],
  areas: ['geofence_enter', 'geofence_exit'],
  status: ['offline', 'online', 'long_stop', 'gps_lost', 'low_battery', 'power_off'],
};
const OPTIONS: [Filter, string][] = [['all', 'All'], ['important', 'Important'], ['ignition', 'Ignition'], ['speed', 'Speed'], ['areas', 'Areas'], ['status', 'Status']];

export function AlertsTab({ device }: TabProps) {
  const c = useColors();
  const [filter, setFilter] = useState<Filter>('all');
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['events', device.id],
    queryFn: () => api<{ data: AlertEvent[] }>(`/devices/${device.id}/events?limit=300`),
  });
  const sections = useMemo(() => {
    const all = data?.data || [];
    const shown = all.filter((e) => (filter === 'all' ? true : filter === 'important' ? SEVERE_ALERTS.has(e.type) : KIND[filter].includes(e.type)));
    return groupByDay(shown);
  }, [data, filter]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingVertical: 8 }}>
        <MiniTabs scroll value={filter} options={OPTIONS} onChange={setFilter} />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(e) => e.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} colors={[c.text]} />}
        renderSectionHeader={({ section }) => (
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 0.6, color: c.textMuted, paddingTop: 14, paddingBottom: 2 }}>{section.title.toUpperCase()}</Text>
        )}
        renderItem={({ item }) => <AlertRow alert={item} />}
        ListEmptyComponent={
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: c.textMuted, textAlign: 'center', paddingVertical: 32 }}>{isLoading ? 'Loading…' : 'No alerts here.'}</Text>
        }
      />
    </View>
  );
}
