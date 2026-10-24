// History: pick a day, see the route, replay it.
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/api/client';
import type { RoutePoint } from '@/api/types';
import { isoDay, timeOnly } from '@/lib/format';
import { brand } from '@/theme/colors';
import { AppMap } from '@/components/Map';
import { AppText, Card, EmptyState, IconButton, Loading, Row } from '@/components/ui';
import { radius, space, useColors } from '@/theme';
import type { TabProps } from './types';

const DAY = 86_400_000;

function dayLabel(day: string) {
  const today = isoDay();
  if (day === today) return 'Today';
  if (day === isoDay(Date.now() - DAY)) return 'Yesterday';
  return new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function HistoryTab({ device }: TabProps) {
  const c = useColors();
  const [day, setDay] = useState(isoDay());
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [barWidth, setBarWidth] = useState(1);

  const from = new Date(`${day}T00:00:00`);
  const { data, isLoading } = useQuery({
    queryKey: ['positions', device.id, day],
    queryFn: () =>
      api<{ data: { points: RoutePoint[]; originalCount: number } }>(
        `/devices/${device.id}/positions?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(new Date(from.getTime() + DAY - 1).toISOString())}&maxPoints=3000`
      ),
  });
  const points = data?.data.points || [];
  const coords = useMemo(() => points.map((p) => ({ lat: p.lat, lon: p.lon })), [points]);
  const current = index != null ? points[index] : null;

  useEffect(() => {
    setIndex(null);
    setPlaying(false);
  }, [day]);

  // Playback: advance one point every 120 ms.
  useEffect(() => {
    if (!playing || points.length < 2) return undefined;
    const t = setInterval(() => {
      setIndex((i) => {
        const next = (i ?? 0) + 1;
        if (next >= points.length) {
          setPlaying(false);
          return points.length - 1;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(t);
  }, [playing, points.length]);

  const shiftDay = (delta: number) => setDay(isoDay(new Date(`${day}T12:00:00`).getTime() + delta * DAY));

  return (
    <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: 48 }}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon="chevron-back" label="Previous day" onPress={() => shiftDay(-1)} />
        <View style={{ alignItems: 'center' }}>
          <AppText variant="h3">{dayLabel(day)}</AppText>
          <AppText variant="caption" color="textMuted">{data ? `${data.data.originalCount} POSITIONS` : ' '}</AppText>
        </View>
        <IconButton icon="chevron-forward" label="Next day" onPress={() => day < isoDay() && shiftDay(1)} color={day >= isoDay() ? c.border : undefined} />
      </Card>

      <View style={[styles.mapBox, { borderColor: c.border }]}>
        <AppMap
          route={coords}
          dots={[
            ...(coords.length > 0 ? [{ id: 'start', ...coords[0], color: brand.marigold }] : []),
            ...(coords.length > 1 ? [{ id: 'end', ...coords[coords.length - 1], color: brand.aubergine }] : []),
          ]}
          markers={current ? [{ id: 'playback', lat: current.lat, lon: current.lon, heading: current.heading, vehicle: device.icon }] : []}
          fitTo={coords}
          fitKey={`${day}-${coords.length}`}
        />
      </View>

      {isLoading ? (
        <Loading />
      ) : points.length < 2 ? (
        <EmptyState icon="footsteps-outline" title="No movement" text="Nothing was recorded on this day." />
      ) : (
        <Card style={{ gap: space.md }}>
          <Row style={{ flexWrap: 'nowrap' }} gap={space.md}>
            <Pressable
              accessibilityLabel={playing ? 'Pause' : 'Play'}
              onPress={() => {
                if (!playing && (index == null || index >= points.length - 1)) setIndex(0);
                setPlaying(!playing);
              }}
              style={[styles.play, { backgroundColor: c.accent }]}
            >
              <Ionicons name={playing ? 'pause' : 'play'} size={26} color={c.onAccent} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">{current ? timeOnly(current.t) : 'Replay the day'}</AppText>
              <AppText variant="small" color="textMuted">{current ? `${current.speed} km/h` : `${timeOnly(points[0].t)} – ${timeOnly(points[points.length - 1].t)}`}</AppText>
            </View>
          </Row>
          {/* Tap anywhere on the bar to jump there */}
          <Pressable
            onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
            onPress={(e) => setIndex(Math.min(points.length - 1, Math.max(0, Math.round((e.nativeEvent.locationX / barWidth) * (points.length - 1)))))}
            style={[styles.bar, { backgroundColor: c.surface2 }]}
            accessibilityLabel="Playback position"
          >
            <View style={{ width: `${((index ?? 0) / (points.length - 1)) * 100}%`, height: '100%', backgroundColor: c.accent, borderRadius: 6 }} />
          </Pressable>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mapBox: { height: 340, borderRadius: radius.md, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  play: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  bar: { height: 12, borderRadius: 6, overflow: 'hidden' },
});
