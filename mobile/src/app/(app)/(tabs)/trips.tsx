// Trips of all vehicles, newest first, grouped by day. Tap one to open that
// vehicle's trips (route on the map).
import { useMemo, useState } from 'react';
import { Platform, Pressable, RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import type { Trip } from '@/api/types';
import { duration, km, timeOnly } from '@/lib/format';
import { VehicleArt } from '@/components/VehicleArt';
import { AppText, EmptyState, ErrorBox, Segmented } from '@/components/ui';
import { SkeletonRows } from '@/components/effects';
import { radius, space, type, useColors } from '@/theme';

type Period = '1' | '7' | '30';
type FleetTrip = Trip & { deviceId: string; vehicle: { registrationNumber: string | null; name: string; driverName: string | null; icon: string | null } };
const MONO = Platform.select({ android: 'monospace', ios: 'Menlo', default: 'monospace' });

function dayTitle(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function Trips() {
  const c = useColors();
  const [period, setPeriod] = useState<Period>('7');
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['fleet-trips', period],
    queryFn: () => api<{ data: FleetTrip[] }>(`/me/trips?days=${period}`),
  });
  const trips = data?.data || [];
  const totalKm = Math.round(trips.reduce((a, t) => a + t.distanceKm, 0) * 10) / 10;

  const sections = useMemo(() => {
    const groups = new Map<string, FleetTrip[]>();
    for (const t of trips) {
      const k = new Date(t.startTime).toDateString();
      groups.set(k, [...(groups.get(k) || []), t]);
    }
    return [...groups.values()].map((list) => ({ title: dayTitle(list[0].startTime), data: list }));
  }, [trips]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingHorizontal: space.lg, paddingTop: space.sm, gap: 2 }}>
        <AppText variant="h1">Trips</AppText>
        <AppText color="textMuted">{trips.length} trips · {km(totalKm)} km</AppText>
      </View>
      <View style={{ marginTop: space.xs }}>
        <Segmented<Period> value={period} onChange={setPeriod} options={[['1', 'Today'], ['7', 'Last 7 days'], ['30', 'Last 30 days']]} />
      </View>
      <ErrorBox error={error ? errorText(error) : null} />
      {isLoading ? (
        <SkeletonRows count={5} style={{ padding: space.lg }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(t) => t.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ padding: space.lg, paddingTop: space.sm, gap: space.sm, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} />}
          renderSectionHeader={({ section }) => <AppText variant="caption" color="textMuted" style={{ marginTop: space.md }}>{section.title.toUpperCase()}</AppText>}
          ListEmptyComponent={<EmptyState icon="git-branch-outline" title="No trips" text="Trips appear here after a vehicle drives with ignition on." />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/device/${item.deviceId}?tab=trips`)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.card, { backgroundColor: c.surface, borderColor: pressed ? c.accent : c.border }]}
            >
              <View style={[styles.art, { backgroundColor: c.surface2 }]}>
                <VehicleArt type={item.vehicle.icon} size={38} />
              </View>
              <View style={{ flex: 1, gap: 3, minWidth: 0 }}>
                <Text numberOfLines={1} style={{ fontFamily: MONO, fontWeight: '700', fontSize: 15, color: c.text }}>
                  {item.vehicle.registrationNumber || item.vehicle.name}
                </Text>
                <AppText variant="small" color="textMuted" numberOfLines={1}>
                  {timeOnly(item.startTime)} – {item.endTime ? timeOnly(item.endTime) : 'now'}
                  {item.vehicle.driverName ? ` · ${item.vehicle.driverName}` : ''}
                </AppText>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 3 }}>
                <Text>
                  <Text style={[type.h3, { color: c.text }]}>{km(item.distanceKm)}</Text>
                  <Text style={[type.caption, { color: c.textMuted }]}> km</Text>
                </Text>
                <AppText variant="caption" color={item.inProgress ? 'success' : 'textMuted'}>
                  {item.inProgress ? 'In progress' : `${duration(item.durationS)} · max ${item.maxSpeed}`}
                </AppText>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, borderWidth: 1,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  art: { width: 56, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
