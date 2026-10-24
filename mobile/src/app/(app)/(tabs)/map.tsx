// Map tab: every vehicle on one full-screen map. Tap a vehicle for a quick
// card (speed, status, Live / History) without leaving the map.
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { VehicleBadge } from '@/components/VehicleArt';
import { deviceName } from '@/api/types';
import { useTrackers } from '@/live/TrackersProvider';
import { timeAgo } from '@/lib/format';
import { AppMap, type LatLon } from '@/components/Map';
import { AppText, Button, EmptyState, IconButton, Loading, Pill, Row } from '@/components/ui';
import { radius, space, useColors } from '@/theme';

export default function MapTab() {
  const c = useColors();
  const { devices, stateOf, isLoading } = useTrackers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focus, setFocus] = useState<LatLon | null>(null);
  const [fitCount, setFitCount] = useState(0);

  const located = devices.filter((d) => stateOf(d).lat != null);
  const points = located.map((d) => ({ lat: stateOf(d).lat!, lon: stateOf(d).lon! }));
  const selected = useMemo(() => devices.find((d) => d.id === selectedId) || null, [devices, selectedId]);
  const sel = selected ? stateOf(selected) : null;

  if (isLoading) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}><Loading /></SafeAreaView>;
  if (located.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, justifyContent: 'center' }}>
        <EmptyState
          icon="map-outline"
          title="Nothing on the map yet"
          text={devices.length ? 'Your trackers appear here once they send a GPS position.' : 'Add a tracker to see it on the map.'}
          action={devices.length ? undefined : <Button title="Add tracker" icon="add" onPress={() => router.push('/add-tracker')} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppMap
        style={StyleSheet.absoluteFill}
        initialCenter={points[0]}
        initialZoom={13}
        markers={located.map((d) => {
          const s = stateOf(d);
          return { id: d.id, lat: s.lat!, lon: s.lon!, heading: s.heading, online: s.online, label: deviceName(d), vehicle: d.icon };
        })}
        fitTo={points}
        fitKey={`${located.length}-${fitCount}`}
        follow={focus}
        onMarkerPress={(id) => {
          setSelectedId(id);
          const s = located.find((d) => d.id === id);
          if (s) setFocus({ lat: stateOf(s).lat!, lon: stateOf(s).lon! });
        }}
      />

      <SafeAreaView edges={['top']} style={styles.topRight} pointerEvents="box-none">
        <IconButton
          icon="scan-outline"
          label="Show all vehicles"
          onPress={() => {
            setFocus(null);
            setSelectedId(null);
            setFitCount((n) => n + 1);
          }}
        />
      </SafeAreaView>

      {selected && sel && (
        <View style={[styles.sheet, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Pressable onPress={() => router.push(`/device/${selected.id}`)} style={styles.sheetTop}>
            <VehicleBadge type={selected.icon} online={sel.online} />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="h3" numberOfLines={1}>{deviceName(selected)}</AppText>
              <Row gap={6}>
                <Pill label={sel.online ? 'Online' : 'Offline'} tone={sel.online ? 'ok' : 'offline'} />
                <AppText variant="small" color="textMuted">{timeAgo(sel.lastSeenAt)}</AppText>
              </Row>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText variant="display">{sel.speed ?? 0}</AppText>
              <AppText variant="label" color="textMuted">KM/H</AppText>
            </View>
          </Pressable>
          <Row gap={space.sm} style={{ flexWrap: 'nowrap' }}>
            <Button title="Live" icon="locate-outline" small onPress={() => router.push(`/device/${selected.id}?tab=live`)} style={{ flex: 1 }} />
            <Button title="History" icon="time-outline" small variant="secondary" onPress={() => router.push(`/device/${selected.id}?tab=history`)} style={{ flex: 1 }} />
            <Pressable accessibilityLabel="Close" onPress={() => setSelectedId(null)} hitSlop={10} style={styles.close}>
              <Ionicons name="close" size={22} color={c.textMuted} />
            </Pressable>
          </Row>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topRight: { position: 'absolute', top: 0, right: 0, padding: space.lg },
  sheet: {
    position: 'absolute', left: space.md, right: space.md, bottom: space.md,
    borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: space.lg, gap: space.md, elevation: 6,
  },
  sheetTop: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  close: { width: 40, alignItems: 'center', justifyContent: 'center' },
});
