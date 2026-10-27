// Map tab (design): every vehicle as a round bubble with its picture and number
// plate (red pulse on the selected one). Controls on the right: map/satellite,
// zoom, show all. Bottom sheet: plate chips to pick a vehicle, its picture,
// plate and speed, the street address, and ‹ Details › to step through.
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { plateOrName } from '@/api/types';
import { useTrackers } from '@/live/TrackersProvider';
import { useAddress } from '@/lib/address';
import { usePref } from '@/lib/prefs';
import { STATUS_DASHED, STATUS_LABEL, STATUS_ORDER as ORDER, STATUS_RING, statusGroup, type StatusGroup } from '@/lib/vehicleStatus';
import { selectVehicle, useSelectedVehicle } from '@/lib/selectedVehicle';
import { AppMap, type AppMapHandle, type LatLon } from '@/components/Map';
import { VehicleTile } from '@/components/kit';
import { DIcon, type DesignIconName } from '@/components/DesignIcon';
import { Button, EmptyState, Loading } from '@/components/ui';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';

type HC = ReturnType<typeof useColors>;

export default function MapTab() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { devices, stateOf, isLoading } = useTrackers();
  const platesOnMap = usePref('platesOnMap');
  const map = useRef<AppMapHandle>(null);
  const chips = useRef<ComponentRef<typeof ScrollView>>(null);
  const selectedId = useSelectedVehicle();
  const [fitCount, setFitCount] = useState(0);
  const [satellite, setSatellite] = useState(false);
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
    if (!selectedId || !rows.some((r) => r.d.id === selectedId)) selectVehicle((located[0] ?? rows[0]).d.id);
  }, [rows, located, selectedId]);

  const index = Math.max(0, rows.findIndex((r) => r.d.id === selectedId));
  const sel = rows[index];
  const selPos = sel && sel.s.lat != null ? { lat: sel.s.lat, lon: sel.s.lon! } : null;
  const { address, isLoading: addrLoading } = useAddress(selPos?.lat, selPos?.lon);

  function select(id: string) {
    selectVehicle(id);
    const i = rows.findIndex((r) => r.d.id === id);
    chips.current?.scrollTo({ x: Math.max(0, i * 130 - 40), animated: true });
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
  const hasSpeed = g === 'moving' || g === 'stopped';
  const addressText = !selPos
    ? 'No GPS position yet'
    : address ?? (addrLoading ? 'Finding address…' : `${selPos.lat.toFixed(5)}, ${selPos.lon.toFixed(5)}`);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppMap
        ref={map}
        style={StyleSheet.absoluteFill}
        initialCenter={points[0]}
        initialZoom={13}
        design
        satellite={satellite}
        showLabels={platesOnMap}
        selectedId={selectedId}
        attribution="bottom-left"
        padding={{ top: insets.top + 20, bottom: sheetH + 20, left: 20, right: 70 }}
        markers={located.map((r) => ({
          id: r.d.id, lat: r.s.lat!, lon: r.s.lon!, label: plateOrName(r.d), vehicle: r.d.icon,
          ring: STATUS_RING[r.g], dashed: STATUS_DASHED[r.g],
        }))}
        fitTo={points}
        fitKey={`${located.length}-${fitCount}`}
        follow={selPos}
        onMarkerPress={select}
      />

      {/* Controls (right): map/satellite, zoom, show all */}
      <View style={[styles.controls, { top: insets.top + 12 }]} pointerEvents="box-none">
        <Pressable
          onPress={() => setSatellite(!satellite)}
          accessibilityRole="button"
          accessibilityState={{ selected: satellite }}
          accessibilityLabel="Satellite view"
          style={[styles.layerBtn, shadow, { backgroundColor: satellite ? '#202020' : '#FFFFFF' }]}
        >
          <DIcon name="layers" size={20} strokeWidth={2} color={satellite ? '#FFFFFF' : '#202020'} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 10, lineHeight: 10, color: satellite ? '#FFFFFF' : '#202020' }}>{satellite ? 'SAT' : 'MAP'}</Text>
        </Pressable>
        <View style={[styles.zoom, shadow]}>
          <CtlBtn icon="plus" label="Zoom in" onPress={() => map.current?.zoomIn()} />
          <CtlBtn icon="minus" label="Zoom out" onPress={() => map.current?.zoomOut()} />
        </View>
        <Pressable onPress={() => setFitCount((n) => n + 1)} accessibilityRole="button" accessibilityLabel="Show all vehicles" style={[styles.fit, shadow]}>
          <DIcon name="fit" size={20} strokeWidth={2} color="#202020" />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <View onLayout={(e) => setSheetH(e.nativeEvent.layout.height)} style={[styles.sheet, { backgroundColor: c.dark ? c.surface : '#FFFFFF' }]}>
        <View style={styles.handle} />

        <ScrollView ref={chips} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 18, paddingBottom: 2 }}>
          {rows.map((r) => (
            <PlateChip key={r.d.id} plate={plateOrName(r.d)} group={r.g} selected={r.d.id === selectedId} onPress={() => select(r.d.id)} c={c} />
          ))}
        </ScrollView>

        <View style={styles.vehicle}>
          <VehicleTile type={sel.d.icon} color={sel.d.color} width={74} height={52} dimmed={g === 'offline'} deep style={{ borderRadius: 16 }} />
          <Text numberOfLines={1} maxFontSizeMultiplier={1.2} style={{ flex: 1, minWidth: 0, fontFamily: fonts.mono, fontSize: 17, color: c.text }}>{plateOrName(sel.d)}</Text>
          <Text maxFontSizeMultiplier={1.2} numberOfLines={1}>
            <Text style={hasSpeed
              ? { fontFamily: fonts.bold, fontSize: 28, letterSpacing: -0.6, color: c.text }
              : { fontFamily: fonts.bold, fontSize: 14, color: g === 'nogps' ? c.amberText : c.textMuted }}>
              {hasSpeed ? String(sel.s.speed ?? 0) : STATUS_LABEL[g]}
            </Text>
            {hasSpeed ? <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: c.textMuted }}> km/h</Text> : null}
          </Text>
        </View>

        <View style={styles.address}>
          <DIcon name="pin" size={16} strokeWidth={2} color={c.textMuted} />
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, minWidth: 0, fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: selPos ? (c.dark ? c.text : '#3A3A3A') : c.textMuted }}>{addressText}</Text>
        </View>

        <View style={styles.nav}>
          <RoundNav icon="chevL" label="Previous vehicle" onPress={() => step(-1)} c={c} />
          <Pressable onPress={() => router.push(`/device/${sel.d.id}`)} accessibilityRole="button" style={[styles.details, { backgroundColor: c.accent }]}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: '#FFFFFF' }}>Details</Text>
          </Pressable>
          <RoundNav icon="chevR" label="Next vehicle" onPress={() => step(1)} c={c} />
        </View>
      </View>
    </View>
  );
}

function CtlBtn({ icon, label, onPress }: { icon: DesignIconName; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => ({ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
      <DIcon name={icon} size={20} strokeWidth={2.2} color="#202020" />
    </Pressable>
  );
}

function RoundNav({ icon, label, onPress, c }: { icon: DesignIconName; label: string; onPress: () => void; c: HC }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.round, { backgroundColor: c.surface, opacity: pressed ? 0.7 : 1 }]}>
      <DIcon name={icon} size={20} strokeWidth={2.2} color={c.text} />
    </Pressable>
  );
}

/** Pill with a status dot and the plate; dark when selected. */
function PlateChip({ plate, group, selected, onPress, c }: { plate: string; group: StatusGroup; selected: boolean; onPress: () => void; c: HC }) {
  const ring = STATUS_RING[group];
  // On the dark selected chip a dark dot would vanish: use white.
  const dot = selected && group === 'stopped' ? '#FFFFFF' : ring;
  const fg = selected ? '#FFFFFF' : c.text;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={`${plate}, ${STATUS_LABEL[group]}`} style={[styles.chip, { backgroundColor: selected ? '#202020' : c.surface }]}>
      <View style={[styles.dot, group === 'offline' ? { borderWidth: 1.5, borderColor: selected ? '#FFFFFF' : ring } : { backgroundColor: dot }]} />
      <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.mono, fontSize: 13, color: fg }}>{plate}</Text>
    </Pressable>
  );
}

const shadow = { elevation: 4, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 2 } };
const styles = StyleSheet.create({
  controls: { position: 'absolute', right: 12, gap: 8, alignItems: 'center' },
  layerBtn: { width: 44, height: 52, borderRadius: 22, alignItems: 'center', justifyContent: 'center', gap: 2 },
  zoom: { width: 44, borderRadius: 22, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  fit: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, gap: 12, paddingTop: 8, paddingBottom: 16,
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    elevation: 12, shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 30, shadowOffset: { width: 0, height: -8 },
  },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: '#D6D6D6' },
  chip: { height: 38, paddingHorizontal: 13, borderRadius: 19, flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  vehicle: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18 },
  address: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, minHeight: 20, overflow: 'hidden' },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18 },
  round: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  details: { flex: 1, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
});
