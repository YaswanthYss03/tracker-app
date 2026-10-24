// Trips: list for a period; tap one to see its route.
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { RoutePoint, Trip } from '@/api/types';
import { dateTime, duration, km, timeOnly } from '@/lib/format';
import { brand } from '@/theme/colors';
import { AppMap } from '@/components/Map';
import { AppText, EmptyState, Pill, Row, Segmented } from '@/components/ui';
import { radius, space, useColors } from '@/theme';
import type { TabProps } from './types';
import { SkeletonRows } from '@/components/effects';

type Period = '1' | '7' | '30';

export function TripsTab({ device }: TabProps) {
  const c = useColors();
  const [period, setPeriod] = useState<Period>('7');
  const [selected, setSelected] = useState<string | null>(null);
  const from = useMemo(() => new Date(Date.now() - Number(period) * 86_400_000).toISOString(), [period]);

  const trips = useQuery({
    queryKey: ['trips', device.id, period],
    queryFn: () => api<{ data: Trip[] }>(`/devices/${device.id}/trips?from=${encodeURIComponent(from)}`),
  });
  const route = useQuery({
    queryKey: ['trip-route', device.id, selected],
    enabled: Boolean(selected),
    queryFn: () => api<{ data: { points: RoutePoint[] } }>(`/devices/${device.id}/trips/${selected}/route`),
  });
  const coords = (route.data?.data.points || []).map((p) => ({ lat: p.lat, lon: p.lon }));

  const list = trips.data?.data || [];

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: space.md, gap: space.md, paddingBottom: 48 }}>
      <Segmented value={period} options={[['1', '24 hours'], ['7', '7 days'], ['30', '30 days']]} onChange={(p) => { setPeriod(p); setSelected(null); }} />
      {selected && (
        <View style={[styles.mapBox, { borderColor: c.border }]}>
          <AppMap
            route={coords}
            dots={[
              ...(coords.length > 0 ? [{ id: 'start', ...coords[0], color: brand.marigold }] : []),
              ...(coords.length > 1 ? [{ id: 'end', ...coords[coords.length - 1], color: brand.aubergine }] : []),
            ]}
            fitTo={coords}
            fitKey={`${selected}-${coords.length}`}
          />
        </View>
      )}
      <View style={{ paddingHorizontal: space.lg, gap: space.md }}>
        {trips.isLoading ? (
          <SkeletonRows count={3} />
        ) : list.length === 0 ? (
          <EmptyState icon="car-outline" title="No trips" text="Trips appear here after the vehicle drives with ignition on." />
        ) : (
          list.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setSelected(t.id)}
              style={[styles.trip, { backgroundColor: c.surface, borderColor: selected === t.id ? c.accent : c.border, borderWidth: selected === t.id ? 2 : StyleSheet.hairlineWidth }]}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <AppText variant="bodyStrong">{dateTime(t.startTime)}{t.endTime ? ` – ${timeOnly(t.endTime)}` : ''}</AppText>
                <AppText variant="small" color="textMuted">
                  {duration(t.durationS)} · max {t.maxSpeed} km/h{t.idleS ? ` · idle ${duration(t.idleS)}` : ''}
                </AppText>
                {t.inProgress && <Pill label="Driving now" tone="accent" />}
              </View>
              <Row gap={2} style={{ alignItems: 'flex-end', flexWrap: 'nowrap' }}>
                <AppText variant="display">{km(t.distanceKm)}</AppText>
                <AppText variant="caption" color="textMuted" style={{ marginBottom: 8 }}>KM</AppText>
              </Row>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mapBox: { height: 280, marginHorizontal: space.lg, borderRadius: radius.md, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  trip: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.md },
});
