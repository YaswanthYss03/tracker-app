// Home: logo + alerts bell, a map card with every vehicle (tap the corner
// button for full screen), quick actions, status filters, and one card per
// vehicle with its number plate, driver, km today, speed and last update.
import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Modal, Platform, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { errorText } from '@/api/client';
import { deviceName, plateOrName, type Device, type Live } from '@/api/types';
import { useTrackers } from '@/live/TrackersProvider';
import { useUnreadAlerts } from '@/lib/alertsSeen';
import { timeAgo } from '@/lib/format';
import { STATUS_LABEL, statusColor, statusGroup, type StatusGroup } from '@/lib/vehicleStatus';
import { AppMap } from '@/components/Map';
import { MapFullscreen, type Rect } from '@/components/MapFullscreen';
import { VehicleArt } from '@/components/VehicleArt';
import { AppText, Button, EmptyState, ErrorBox } from '@/components/ui';
import { SkeletonRows } from '@/components/effects';
import { radius, space, type, useColors } from '@/theme';

type Filter = 'all' | StatusGroup;
type Sort = 'status' | 'plate' | 'speed' | 'km';
const SORTS: [Sort, string][] = [['status', 'Status'], ['plate', 'Number plate'], ['speed', 'Speed'], ['km', 'Km today']];
const ORDER: Record<StatusGroup, number> = { moving: 0, idle: 1, stopped: 2, offline: 3 };

// Soft backgrounds behind the vehicle pictures (light mode).
const TINT: Record<string, string> = {
  car: '#DCE6F3', bike: '#F4DEDE', scooter: '#D9EFEB', bus: '#F5EAC9', van: '#E3E7EC',
  truck: '#F6E2CC', auto: '#E1EFD8', bicycle: '#DCEFE0', tractor: '#F4DCDC', other: '#ECE3EF',
};
const MONO = Platform.select({ android: 'monospace', ios: 'Menlo', default: 'monospace' });

export default function Home() {
  const c = useColors();
  const { devices, stateOf, isLoading, isRefetching, error, refetch } = useTrackers();
  const unread = useUnreadAlerts();
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('status');
  const [sortOpen, setSortOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [cardRect, setCardRect] = useState<Rect | null>(null);
  const mapCard = useRef<ComponentRef<typeof View>>(null);

  const rows = devices.map((d) => ({ d, s: stateOf(d), g: statusGroup(stateOf(d)) }));
  const counts = { moving: 0, stopped: 0, idle: 0, offline: 0 } as Record<StatusGroup, number>;
  rows.forEach((r) => (counts[r.g] += 1));

  const markers = rows
    .filter((r) => r.s.lat != null && r.s.lon != null)
    .map((r) => ({ id: r.d.id, lat: r.s.lat!, lon: r.s.lon!, heading: r.s.heading, online: r.s.online, label: plateOrName(r.d), vehicle: r.d.icon }));
  const points = markers.map((m) => ({ lat: m.lat, lon: m.lon }));

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => rows
    .filter((r) => filter === 'all' || r.g === filter)
    .filter((r) => !q || [r.d.registrationNumber, r.d.name, r.d.driverName, r.d.imei].some((v) => v?.toLowerCase().includes(q)))
    .sort((a, b) => {
      if (sort === 'plate') return plateOrName(a.d).localeCompare(plateOrName(b.d));
      if (sort === 'speed') return (b.s.online ? b.s.speed ?? 0 : -1) - (a.s.online ? a.s.speed ?? 0 : -1);
      if (sort === 'km') return (b.d.todayKm ?? 0) - (a.d.todayKm ?? 0);
      return ORDER[a.g] - ORDER[b.g];
    }), [rows, filter, q, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  function openFull() {
    mapCard.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      setCardRect({ x, y, width, height });
      setFull(true);
    });
  }

  const header = (
    <View style={{ gap: space.lg }}>
      <ErrorBox error={error ? errorText(error) : null} />

      {/* Map of all vehicles */}
      <View ref={mapCard} collapsable={false} style={[styles.mapCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        <AppMap
          initialCenter={points[0]}
          initialZoom={12}
          markers={markers}
          fitTo={points}
          fitKey={markers.length}
          onMarkerPress={(id) => router.push(`/device/${id}`)}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Full screen map" onPress={openFull} style={[styles.fullBtn, { backgroundColor: c.surface }]}>
          <Ionicons name="expand-outline" size={20} color={c.text} />
        </Pressable>
      </View>

      {/* Quick actions */}
      <View style={styles.actions}>
        <Quick icon="time-outline" label="Trips" onPress={() => router.push('/trips')} />
        <Quick icon="car-sport-outline" plus label="Add vehicle" onPress={() => router.push('/add-tracker')} />
        <Quick icon="people-outline" label="Share with family" onPress={() => (devices.length === 1 ? router.push(`/device/${devices[0].id}?tab=sharing`) : setShareOpen(true))} />
        <Quick icon="construct-outline" label="Service & support" onPress={() => router.push('/contact')} />
      </View>

      {/* Status filters + search + sort */}
      <View style={[styles.filterBar, { borderBottomColor: c.border }]}>
        <View style={styles.filters}>
          <FilterTab active={filter === 'all'} onPress={() => setFilter('all')} label={`All ${devices.length}`} />
          {(['moving', 'stopped', 'idle', 'offline'] as StatusGroup[]).map((g) => (
            <FilterTab key={g} active={filter === g} onPress={() => setFilter(filter === g ? 'all' : g)} label={String(counts[g])} dot={statusColor(g, c)} hollow={g === 'offline'} a11y={`${STATUS_LABEL[g]}: ${counts[g]}`} />
          ))}
        </View>
        <Pressable accessibilityLabel="Search vehicles" onPress={() => setSearchOpen(!searchOpen)} hitSlop={8} style={styles.barIcon}>
          <Ionicons name="search" size={20} color={c.text} />
        </Pressable>
        <Pressable accessibilityLabel="Sort vehicles" onPress={() => setSortOpen(true)} hitSlop={8} style={styles.barIcon}>
          <MaterialCommunityIcons name="sort" size={22} color={c.text} />
        </Pressable>
      </View>
      {searchOpen && (
        <View style={[styles.search, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Ionicons name="search" size={18} color={c.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholder="Number plate, driver or name"
            placeholderTextColor={c.textMuted}
            autoCapitalize="characters"
            style={[type.body, { flex: 1, color: c.text, paddingVertical: 0 }]}
          />
          {query ? <Ionicons name="close-circle" size={18} color={c.textMuted} onPress={() => setQuery('')} /> : null}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={styles.topbar}>
        <View style={styles.brand}>
          <View style={[styles.logoMark, { backgroundColor: c.accent }]}>
            <Ionicons name="location" size={18} color={c.onAccent} />
          </View>
          <Text maxFontSizeMultiplier={1} style={[type.wordmark, { fontSize: 30, lineHeight: 40, color: c.text }]}>Pavakie</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={unread ? `Alerts, ${unread} new` : 'Alerts'} onPress={() => router.push('/alerts')} style={[styles.bell, { backgroundColor: c.surface }]}>
          <Ionicons name="notifications-outline" size={22} color={c.text} />
          {unread > 0 && (
            <View style={[styles.badge, { backgroundColor: c.danger, borderColor: c.bg }]}>
              <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {isLoading ? (
        <SkeletonRows count={4} style={{ padding: space.lg }} />
      ) : devices.length === 0 ? (
        <EmptyState
          icon="car-sport-outline"
          title="No vehicles yet"
          text="Add your tracker with the IMEI and activation code printed on the box."
          action={<Button title="Add vehicle" icon="add" onPress={() => router.push('/add-tracker')} />}
        />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(r) => r.d.id}
          ListHeaderComponent={header}
          ListHeaderComponentStyle={{ marginBottom: space.md }}
          contentContainerStyle={{ padding: space.lg, paddingTop: space.sm, gap: space.md }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListEmptyComponent={<AppText color="textMuted" center style={{ padding: space.xl }}>No vehicles match.</AppText>}
          renderItem={({ item }) => <VehicleCard device={item.d} state={item.s} group={item.g} />}
        />
      )}

      <MapFullscreen visible={full} from={cardRect} markers={markers} onClose={() => setFull(false)} onMarkerPress={(id) => { setFull(false); router.push(`/device/${id}`); }} />

      {/* Sort menu */}
      <Modal visible={sortOpen} transparent animationType="fade" onRequestClose={() => setSortOpen(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={() => setSortOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: c.surface }]}>
            <AppText variant="h3">Sort by</AppText>
            {SORTS.map(([key, label]) => (
              <Pressable key={key} onPress={() => { setSort(key); setSortOpen(false); }} style={styles.sheetRow} accessibilityRole="radio" accessibilityState={{ selected: sort === key }}>
                <Ionicons name={sort === key ? 'radio-button-on' : 'radio-button-off'} size={20} color={sort === key ? c.text : c.textMuted} />
                <AppText>{label}</AppText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Choose a vehicle to share */}
      <Modal visible={shareOpen} transparent animationType="fade" onRequestClose={() => setShareOpen(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={() => setShareOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: c.surface }]}>
            <AppText variant="h3">Share which vehicle?</AppText>
            {devices.map((d) => (
              <Pressable key={d.id} onPress={() => { setShareOpen(false); router.push(`/device/${d.id}?tab=sharing`); }} style={styles.sheetRow}>
                <VehicleArt type={d.icon} size={32} />
                <AppText style={{ fontFamily: MONO, fontWeight: '700' }}>{plateOrName(d)}</AppText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function Quick({ icon, label, onPress, plus }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; plus?: boolean }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.quick, { backgroundColor: c.surface, opacity: pressed ? 0.8 : 1 }]}>
      <Ionicons name={icon} size={24} color={c.text} />
      {plus && (
        <View style={[styles.plus, { backgroundColor: c.accent }]}>
          <Ionicons name="add" size={11} color={c.onAccent} />
        </View>
      )}
    </Pressable>
  );
}

function FilterTab({ label, active, onPress, dot, hollow, a11y }: { label: string; active: boolean; onPress: () => void; dot?: string; hollow?: boolean; a11y?: string }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="tab" accessibilityLabel={a11y ?? label} accessibilityState={{ selected: active }} style={styles.filterTab}>
      <View style={styles.filterInner}>
        {dot && <View style={[styles.dot, hollow ? { borderWidth: 1.5, borderColor: dot } : { backgroundColor: dot }]} />}
        <AppText variant={active ? 'bodyStrong' : 'body'} color={active ? 'text' : 'textMuted'}>{label}</AppText>
      </View>
      <View style={{ height: 3, borderRadius: 2, backgroundColor: active ? c.accent : 'transparent', marginTop: 8 }} />
    </Pressable>
  );
}

/** Picture · number plate · driver + km today · speed + last update. */
function VehicleCard({ device, state, group }: { device: Device; state: Live; group: StatusGroup }) {
  const c = useColors();
  const offline = group === 'offline';
  const driver = device.driverName || (device.registrationNumber ? device.name : null) || 'No driver set';
  const updated = state.lastSeenAt ? timeAgo(state.lastSeenAt) : 'never';
  return (
    <Pressable
      onPress={() => router.push(`/device/${device.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${plateOrName(device)}, driver ${driver}, ${offline ? 'offline' : `${state.speed ?? 0} kilometres per hour`}`}
      style={({ pressed }) => [styles.card, { backgroundColor: pressed ? c.surface : c.surface, borderColor: pressed ? c.accent : c.border }]}
    >
      <View style={[styles.art, { backgroundColor: c.dark ? c.surface2 : TINT[device.icon ?? 'other'] ?? TINT.other }]}>
        <VehicleArt type={device.icon} size={50} dimmed={offline} />
      </View>
      <View style={{ flex: 1, gap: 6, minWidth: 0 }}>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.2} style={{ fontFamily: MONO, fontWeight: '700', fontSize: 17, letterSpacing: 0.5, color: c.text }}>
          {device.registrationNumber || deviceName(device)}
        </Text>
        <View style={styles.driverRow}>
          <View style={[styles.avatar, { backgroundColor: c.dark ? c.surface2 : 'rgba(234,170,0,0.25)' }]}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: c.text }}>{driver.charAt(0).toUpperCase()}</Text>
          </View>
          <AppText variant="small" color="textMuted" numberOfLines={1} style={{ flexShrink: 1 }}>
            {driver} · {device.todayKm ?? 0} km
          </AppText>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        {offline ? (
          <AppText variant="bodyStrong" color="textMuted">Offline</AppText>
        ) : (
          <Text maxFontSizeMultiplier={1.2}>
            <Text style={[type.h3, { color: c.text }]}>{state.speed ?? 0}</Text>
            <Text style={[type.caption, { color: c.textMuted }]}> km/h</Text>
          </Text>
        )}
        <View style={styles.driverRow}>
          <View style={[styles.dot, offline ? { borderWidth: 1.5, borderColor: c.offline } : { backgroundColor: statusColor(group, c) }]} />
          <AppText variant="caption" color={offline ? 'textMuted' : 'text'}>{updated === 'just now' ? 'Just now' : updated}</AppText>
        </View>
      </View>
    </Pressable>
  );
}

const shadow = { elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } };
const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.xs },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  logoMark: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  bell: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', ...shadow },
  badge: { position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  mapCard: { height: 190, borderRadius: radius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  fullBtn: { position: 'absolute', right: 12, bottom: 12, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', ...shadow },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.sm },
  quick: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', ...shadow },
  plus: { position: 'absolute', right: 10, top: 12, width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  filterBar: { flexDirection: 'row', alignItems: 'flex-end', borderBottomWidth: StyleSheet.hairlineWidth },
  filters: { flex: 1, flexDirection: 'row', gap: space.md },
  filterTab: { paddingTop: space.xs },
  filterInner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 2 },
  barIcon: { paddingHorizontal: 8, paddingBottom: 10 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, height: 46, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: space.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, borderWidth: 1, ...shadow },
  art: { width: 72, height: 60, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatar: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { padding: space.lg, gap: space.sm, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingBottom: space.xxl },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 48 },
});
