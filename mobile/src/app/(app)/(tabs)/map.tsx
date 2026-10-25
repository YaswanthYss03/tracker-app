// Map tab: every vehicle on one map with its number plate. A bottom sheet
// picks the vehicle (plate chips), shows its speed and street address, and
// steps through vehicles with ‹ Details ›. Zoom, show-all and full screen on
// the right.
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { plateOrName } from '@/api/types';
import { useTrackers } from '@/live/TrackersProvider';
import { useAddress } from '@/lib/address';
import { timeAgo } from '@/lib/format';
import { STATUS_LABEL, statusColor, statusGroup, type StatusGroup } from '@/lib/vehicleStatus';
import { AppMap, type AppMapHandle, type LatLon } from '@/components/Map';
import { Chip, PillButton, Plate, RoundButton, StatusDot, VehicleTile } from '@/components/kit';
import { Button, EmptyState, Loading } from '@/components/ui';
import { radius, shadow, space, type, useColors } from '@/theme';

const ORDER: Record<StatusGroup, number> = { moving: 0, idle: 1, stopped: 2, offline: 3 };

export default function MapTab() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { devices, stateOf, isLoading } = useTrackers();
  const map = useRef<AppMapHandle>(null);
  const chips = useRef<ComponentRef<typeof ScrollView>>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fitCount, setFitCount] = useState(0);
  const [full, setFull] = useState(false);
  const [sheetH, setSheetH] = useState(0);

  // Vehicles in a stable order: moving first, then by plate.
  const rows = useMemo(() => devices
    .map((d) => ({ d, s: stateOf(d), g: statusGroup(stateOf(d)) }))
    .sort((a, b) => ORDER[a.g] - ORDER[b.g] || plateOrName(a.d).localeCompare(plateOrName(b.d))),
  [devices, stateOf]);
  const located = rows.filter((r) => r.s.lat != null && r.s.lon != null);
  const points: LatLon[] = located.map((r) => ({ lat: r.s.lat!, lon: r.s.lon! }));

  // Keep a vehicle selected (the first one on the map, if nothing else).
  useEffect(() => {
    if (!rows.length) return;
    if (!selectedId || !rows.some((r) => r.d.id === selectedId)) setSelectedId((located[0] ?? rows[0]).d.id);
  }, [rows, located, selectedId]);

  const index = Math.max(0, rows.findIndex((r) => r.d.id === selectedId));
  const sel = rows[index];
  const selPos = sel && sel.s.lat != null ? { lat: sel.s.lat, lon: sel.s.lon! } : null;
  const { address, isLoading: addrLoading } = useAddress(selPos?.lat, selPos?.lon);

  // Sheet slides down out of the way in full screen.
  const hide = useSharedValue(0);
  useEffect(() => {
    hide.value = withTiming(full ? 1 : 0, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, [full, hide]);
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: hide.value * (sheetH + 20) }] }));

  function select(id: string) {
    setSelectedId(id);
    const i = rows.findIndex((r) => r.d.id === id);
    chips.current?.scrollTo({ x: Math.max(0, i * 150 - 60), animated: true });
  }
  const step = (by: number) => rows.length && select(rows[(index + by + rows.length) % rows.length].d.id);

  if (isLoading) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}><Loading /></SafeAreaView>;
  if (!rows.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, justifyContent: 'center' }}>
        <EmptyState
          icon="map-outline"
          title="Nothing on the map yet"
          text="Add a vehicle to see it on the map."
          action={<Button title="Add vehicle" icon="add" onPress={() => router.push('/add-tracker')} />}
        />
      </SafeAreaView>
    );
  }

  const g = sel.g;
  const noGps = !selPos;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppMap
        ref={map}
        style={StyleSheet.absoluteFill}
        initialCenter={points[0]}
        initialZoom={13}
        showLabels
        selectedId={selectedId}
        padding={{ top: insets.top + 20, bottom: full ? 20 : sheetH + 20, left: 20, right: 70 }}
        markers={located.map((r) => ({ id: r.d.id, lat: r.s.lat!, lon: r.s.lon!, heading: r.s.heading, online: r.s.online, label: plateOrName(r.d), vehicle: r.d.icon }))}
        fitTo={points}
        fitKey={`${located.length}-${fitCount}`}
        follow={selPos}
        onMarkerPress={select}
      />

      {/* Map controls (right) */}
      <View style={[styles.controls, { top: insets.top + space.md }]} pointerEvents="box-none">
        <View style={[styles.zoom, { backgroundColor: c.surface }, shadow.card]}>
          <ZoomBtn icon="add" label="Zoom in" onPress={() => map.current?.zoomIn()} />
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border, marginHorizontal: 10 }} />
          <ZoomBtn icon="remove" label="Zoom out" onPress={() => map.current?.zoomOut()} />
        </View>
        <RoundButton icon="scan-outline" label="Show all vehicles" onPress={() => setFitCount((n) => n + 1)} iconSize={20} />
        <RoundButton icon={full ? 'contract-outline' : 'expand-outline'} label={full ? 'Exit full screen' : 'Full screen'} onPress={() => setFull(!full)} iconSize={20} />
      </View>

      {/* Bottom sheet */}
      <Animated.View
        onLayout={(e) => setSheetH(e.nativeEvent.layout.height)}
        style={[styles.sheet, { backgroundColor: c.surface }, shadow.lifted, sheetStyle]}
      >
        <View style={[styles.handle, { backgroundColor: c.border }]} />

        <ScrollView ref={chips} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.lg }}>
          {rows.map((r) => (
            <Chip
              key={r.d.id}
              mono
              outline
              label={plateOrName(r.d)}
              selected={r.d.id === selectedId}
              dot={r.d.id === selectedId && r.g === 'stopped' ? c.bg : statusColor(r.g, c)}
              hollow={r.g === 'offline'}
              onPress={() => select(r.d.id)}
            />
          ))}
        </ScrollView>

        <View style={styles.vehicle}>
          <VehicleTile type={sel.d.icon} color={sel.d.color} width={64} height={54} dimmed={g === 'offline'} />
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <Plate value={plateOrName(sel.d)} size={18} />
            <View style={styles.statusRow}>
              <StatusDot group={g} />
              <Text numberOfLines={1} style={[type.small, { color: c.textMuted, flexShrink: 1 }]}>
                {STATUS_LABEL[g]}{sel.d.driverName ? ` · ${sel.d.driverName}` : ''} · {timeAgo(sel.s.lastSeenAt)}
              </Text>
            </View>
          </View>
          {noGps ? (
            <Text style={[type.bodyStrong, { color: c.danger }]}>No GPS</Text>
          ) : g === 'offline' ? (
            <Text style={[type.bodyStrong, { color: c.textMuted }]}>Offline</Text>
          ) : (
            <Text maxFontSizeMultiplier={1.2}>
              <Text style={[type.number, { color: c.text, fontSize: 28 }]}>{sel.s.speed ?? 0}</Text>
              <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}> km/h</Text>
            </Text>
          )}
        </View>

        <View style={styles.address}>
          <Ionicons name="location-outline" size={18} color={c.textMuted} />
          <Text numberOfLines={1} style={[type.body, { color: noGps ? c.textMuted : c.text, flex: 1 }]}>
            {noGps ? 'No GPS position yet' : address ?? (addrLoading ? 'Finding address…' : `${selPos.lat.toFixed(5)}, ${selPos.lon.toFixed(5)}`)}
          </Text>
        </View>

        <View style={styles.nav}>
          <RoundButton icon="chevron-back" label="Previous vehicle" onPress={() => step(-1)} size={52} iconSize={22} />
          <PillButton title="Details" onPress={() => router.push(`/device/${sel.d.id}`)} style={{ flex: 1 }} />
          <RoundButton icon="chevron-forward" label="Next vehicle" onPress={() => step(1)} size={52} iconSize={22} />
        </View>
      </Animated.View>
    </View>
  );
}

function ZoomBtn({ icon, label, onPress }: { icon: 'add' | 'remove'; label: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({ width: 44, height: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? c.surface2 : 'transparent' })}
    >
      <Ionicons name={icon} size={22} color={c.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  controls: { position: 'absolute', right: space.lg, gap: space.md, alignItems: 'center' },
  zoom: { width: 44, borderRadius: 22, overflow: 'hidden' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingTop: space.sm, paddingBottom: space.lg, gap: space.md,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2 },
  vehicle: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  address: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: space.lg },
  nav: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg },
});
