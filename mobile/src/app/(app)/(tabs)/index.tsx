// Home (design v2): logo + alerts bell, a small live map (tap it for the Map
// tab), quick actions, status tabs with search and sort, then one row per
// vehicle: picture, number plate, driver + km today, speed and last update.
// The vehicle picked last (here or on the Map tab) is highlighted.
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { errorText } from '@/api/client';
import { plateOrName, type Device, type Live } from '@/api/types';
import { useTrackers } from '@/live/TrackersProvider';
import { useUnreadAlerts } from '@/lib/alertsSeen';
import { agoText, timeAgo } from '@/lib/format';
import { selectVehicle, useSelectedVehicle } from '@/lib/selectedVehicle';
import { STATUS_LABEL, STATUS_ORDER, statusGroup, type StatusGroup } from '@/lib/vehicleStatus';
import { colorOf } from '@/lib/vehicleColors';
import { DUE_SOON_DAYS, daysUntil, dueText } from '@/lib/service';
import { AppMap } from '@/components/Map';
import { Banner, PillButton, Plate, VehicleTile } from '@/components/kit';
import type { useHomeColors } from '@/theme/designHome';
import { DriverAvatar } from '@/components/DriverAvatar';
import { DIcon, type DesignIconName } from '@/components/DesignIcon';
import { DesignSheet } from '@/components/DesignSheet';
import { fonts, type } from '@/theme';
import { clamp, useResponsive } from '@/lib/responsive';
import { useHomeColors as useColors } from '@/theme/designHome';

type Filter = 'all' | StatusGroup;
type Sort = 'recent' | 'plate' | 'speed' | 'status';
const SORTS: [Sort, string][] = [['recent', 'Most recently updated'], ['plate', 'Number plate (A–Z)'], ['speed', 'Fastest first'], ['status', 'Moving first']];
const GROUPS: StatusGroup[] = ['moving', 'stopped', 'nogps', 'offline'];
/** Screen side padding from the design. */
const PAD = 20;
/** Service progress bar: a typical 6-month service interval. */
const SERVICE_CYCLE_DAYS = 182;

type Row = { d: Device; s: Live; g: StatusGroup };

export default function Home() {
  const c = useColors();
  const { devices, stateOf, isLoading, isRefetching, error, refetch, offline, updatedAt } = useTrackers();
  const unread = useUnreadAlerts();
  const r = useResponsive();
  const mapH = Math.round(clamp(r.height * 0.19, 120, 190));
  const selectedId = useSelectedVehicle();
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('recent');
  const [sheet, setSheet] = useState<'sort' | 'service' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const rows: Row[] = devices.map((d) => ({ d, s: stateOf(d), g: statusGroup(stateOf(d)) }));
  const counts: Record<StatusGroup, number> = { moving: 0, stopped: 0, nogps: 0, offline: 0 };
  rows.forEach((r) => (counts[r.g] += 1));

  // Vehicles with a service date, soonest first; "due soon" = within 15 days or overdue.
  const serviceList = devices
    .filter((d) => d.serviceDue)
    .map((d) => ({ d, days: daysUntil(d.serviceDue!) }))
    .sort((a, b) => a.days - b.days);
  const dueSoon = serviceList.filter((x) => x.days <= DUE_SOON_DAYS);
  const dueDays = new Map(serviceList.map((x) => [x.d.id, x.days]));

  // Map card: one dot per vehicle in its body colour.
  const dots = rows
    .filter((r) => r.s.lat != null && r.s.lon != null)
    .map((r) => ({ id: r.d.id, lat: r.s.lat!, lon: r.s.lon!, color: colorOf(r.d.color)?.hex ?? c.text }));
  const points = dots.map((p) => ({ lat: p.lat, lon: p.lon }));

  const q = query.trim().toLowerCase();
  const seen = (r: Row) => (r.s.lastSeenAt ? Date.parse(r.s.lastSeenAt) : 0);
  const visible = useMemo(() => rows
    .filter((r) => filter === 'all' || r.g === filter)
    .filter((r) => !q || [r.d.registrationNumber, r.d.name, r.d.driverName, r.d.imei].some((v) => v?.toLowerCase().includes(q)))
    .sort((a, b) => {
      if (sort === 'plate') return plateOrName(a.d).localeCompare(plateOrName(b.d));
      if (sort === 'speed') return (b.g === 'moving' ? b.s.speed ?? 0 : -1) - (a.g === 'moving' ? a.s.speed ?? 0 : -1);
      if (sort === 'status') return STATUS_ORDER[a.g] - STATUS_ORDER[b.g];
      return seen(b) - seen(a);
    }), [rows, filter, q, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  function open(id: string) {
    selectVehicle(id);
    router.push(`/device/${id}`);
  }
  // Driver's page if there is one, otherwise a new-driver form.
  function openDriver(d: Device) {
    selectVehicle(d.id);
    router.push(d.mainDriver?.id ? `/drivers/edit?id=${d.mainDriver.id}` : '/drivers/edit');
  }
  function closeSearch() {
    setQuery('');
    setSearchOpen(false);
  }

  const quickActions = (
    <View style={styles.actions} accessibilityRole="toolbar" accessibilityLabel="Quick actions">
      <Quick icon="replay" label="Replay trips" onPress={() => router.navigate('/trips')} />
      <Quick icon="carPlus" label="Add vehicle" onPress={() => router.push('/add-tracker')} />
      <Quick icon="users" label="Drivers" onPress={() => router.push('/drivers')} />
      <Quick icon="wrench" label="Service due" badge={dueSoon.length || undefined} onPress={() => setSheet('service')} />
    </View>
  );

  const header = (
    <View>
      <View style={{ gap: 18 }}>
        {/* Live map of every vehicle; tap for the Map tab */}
        <Pressable onPress={() => router.navigate('/map')} accessibilityRole="button" accessibilityLabel="Open the live map" style={[styles.mapCard, { backgroundColor: c.surface2, height: mapH }]}>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <AppMap initialCenter={points[0]} initialZoom={12} dots={dots} fitTo={points} fitKey={dots.length} padding={{ top: 24, bottom: 24, left: 24, right: 24 }} attribution="bottom-left" />
          </View>
          <View style={[styles.expand, { backgroundColor: c.dark ? c.surface : '#FFFFFF' }]}>
            <DIcon name="expand" size={18} strokeWidth={2.2} />
          </View>
        </Pressable>

        {quickActions}

        {offline && <Banner icon="cloud-offline-outline" text={`Offline · saved ${timeAgo(new Date(updatedAt).toISOString())}`} />}
        {!offline && error ? <Banner icon="alert-circle-outline" tone="soft" text={errorText(error)} /> : null}
      </View>

      {/* Status tabs + search + sort */}
      <View style={[styles.filterBar, { borderBottomColor: c.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ gap: 16 }}>
          <StatusTab label={`All ${devices.length}`} a11y={`All, ${devices.length}`} active={filter === 'all'} onPress={() => setFilter('all')} />
          {GROUPS.map((g) => (
            <StatusTab key={g} label={String(counts[g])} a11y={`${STATUS_LABEL[g]}, ${counts[g]}`} active={filter === g} onPress={() => setFilter(g)} group={g} />
          ))}
        </ScrollView>
        <Pressable onPress={() => (searchOpen || query ? closeSearch() : setSearchOpen(true))} accessibilityRole="button" accessibilityLabel="Search vehicles" accessibilityState={{ expanded: searchOpen }} style={styles.barBtn}>
          <DIcon name="search" size={17} strokeWidth={2} />
        </Pressable>
        <Pressable onPress={() => setSheet('sort')} accessibilityRole="button" accessibilityLabel={`Sort: ${SORTS.find((x) => x[0] === sort)![1]}`} style={styles.barBtn}>
          <DIcon name="sort" size={17} strokeWidth={1.9} />
          {sort !== 'recent' && <View style={[styles.sortDot, { backgroundColor: c.accent }]} />}
        </Pressable>
      </View>
      {searchOpen || query ? (
        <View style={[styles.search, { backgroundColor: c.surface }]}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholder="Number plate, name or driver"
            placeholderTextColor={c.textMuted}
            accessibilityLabel="Search vehicles"
            style={{ flex: 1, minWidth: 0, fontFamily: fonts.body, fontSize: 15, color: c.text, paddingVertical: 0 }}
          />
          <Pressable onPress={closeSearch} accessibilityRole="button" accessibilityLabel="Close search" style={styles.searchX}>
            <DIcon name="x" size={16} strokeWidth={2.2} color={c.textMuted} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={styles.topbar}>
        <View style={[styles.logoMark, { backgroundColor: c.accent }]}>
          <DIcon name="pin" size={20} strokeWidth={2.2} color="#FFFFFF" />
        </View>
        <Text maxFontSizeMultiplier={1} style={{ flex: 1, fontFamily: fonts.bold, fontSize: 24, lineHeight: 29, letterSpacing: -0.5, color: c.text }}>Pavakie</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={unread ? `Alerts, ${unread} new` : 'Alerts'} onPress={() => router.push('/alerts')} style={[styles.bell, { backgroundColor: c.surface }]}>
          <DIcon name="bell" size={18} strokeWidth={1.9} />
          {unread > 0 && (
            <View style={[styles.badge, { top: 2, right: 1, backgroundColor: c.accent, borderColor: c.surface }]}>
              <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{unread > 99 ? '99+' : unread}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.state}>
          {quickActions}
          <View style={{ gap: 10 }} accessibilityLabel="Loading vehicles">
            {[0, 1, 2].map((i) => <View key={i} style={{ height: 64, borderRadius: 18, backgroundColor: c.surface2 }} />)}
          </View>
        </View>
      ) : devices.length === 0 && error ? (
        <View style={styles.state}>
          {quickActions}
          <View style={styles.stateBody} accessibilityRole="alert">
            <Text style={[styles.stateTitle, { color: c.text }]}>{offline ? 'No internet connection' : 'Couldn’t load vehicles'}</Text>
            {!offline && <Text style={[type.small, { color: c.textMuted, textAlign: 'center' }]}>{errorText(error)}</Text>}
            <PillButton title="Try again" onPress={refetch} loading={isRefetching} style={{ alignSelf: 'center', minWidth: 160 }} />
          </View>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.state}>
          {quickActions}
          <View style={styles.stateBody}>
            <Text style={[styles.stateTitle, { color: c.text, fontSize: 20 }]}>Add your first vehicle</Text>
            <PillButton title="Add vehicle" onPress={() => router.push('/add-tracker')} style={{ alignSelf: 'stretch', marginTop: 4 }} />
          </View>
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(r) => r.d.id}
          ListHeaderComponent={header}
          ListHeaderComponentStyle={{ marginBottom: 8 }}
          contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: 12, paddingBottom: 24, gap: 4 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[c.text]} />}
          ListEmptyComponent={
            <Pressable onPress={() => { closeSearch(); setFilter('all'); }} accessibilityRole="button" style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.text, minHeight: 44, textAlignVertical: 'center' }}>No match — show all</Text>
            </Pressable>
          }
          renderItem={({ item }) => <VehicleRow row={item} selected={item.d.id === selectedId} dueDays={dueDays.get(item.d.id)} onPress={() => open(item.d.id)} onDriver={() => openDriver(item.d)} />}
        />
      )}

      {/* Sort */}
      <DesignSheet visible={sheet === 'sort'} onClose={() => setSheet(null)} title="Sort vehicles">
        <View>
          {SORTS.map(([key, label]) => (
            <Pressable key={key} onPress={() => { setSort(key); setSheet(null); }} accessibilityRole="radio" accessibilityState={{ selected: sort === key }} style={[styles.sortRow, { borderBottomColor: '#EDEDED' }]}>
              <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 16, color: c.text }}>{label}</Text>
              {sort === key && <DIcon name="check" size={20} strokeWidth={2.6} color={c.accent} />}
            </Pressable>
          ))}
        </View>
      </DesignSheet>

      {/* Service due */}
      <DesignSheet visible={sheet === 'service'} onClose={() => setSheet(null)} title="Service due">
        {serviceList.length === 0 ? (
          <Text style={[type.small, { color: c.textMuted }]}>No service dates yet. Add a service record on a vehicle's Service tab to get reminders.</Text>
        ) : (
          <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 6 }}>
            {serviceList.map(({ d, days }) => (
              <ServiceRow key={d.id} device={d} days={days} onPress={() => { setSheet(null); selectVehicle(d.id); router.push(`/device/${d.id}?section=service`); }} />
            ))}
          </ScrollView>
        )}
      </DesignSheet>
    </SafeAreaView>
  );
}

function Quick({ icon, label, onPress, badge }: { icon: DesignIconName; label: string; onPress: () => void; badge?: number }) {
  const c = useColors();
  const r = useResponsive();
  const size = r.tiny ? 44 : 50;
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Pressable accessibilityRole="button" accessibilityLabel={badge ? `${label}, ${badge}` : label} onPress={onPress} style={({ pressed }) => [styles.quick, { width: size, height: size, borderRadius: size / 2, backgroundColor: c.surface, opacity: pressed ? 0.8 : 1 }]}>
        <DIcon name={icon} size={21} strokeWidth={2.5} color={c.accent} />
        {badge ? (
          <View style={[styles.badge, { top: -2, right: -2, backgroundColor: c.amber, borderColor: c.bg }]}>
            <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{badge}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

function StatusTab({ label, a11y, active, onPress, group }: { label: string; a11y: string; active: boolean; onPress: () => void; group?: StatusGroup }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="tab" accessibilityLabel={a11y} accessibilityState={{ selected: active }} style={[styles.tab, { borderBottomColor: active ? c.accent : 'transparent' }]}>
      {group && <Dot group={group} c={c} />}
      <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: active ? fonts.bold : fonts.medium, fontSize: 15, lineHeight: 20, color: active ? c.text : c.textMuted }}>{label}</Text>
    </Pressable>
  );
}

type HC = ReturnType<typeof useHomeColors>;
function dotColor(g: StatusGroup, c: HC) {
  return { moving: c.green, stopped: c.dark ? c.text : '#333333', nogps: c.amber, offline: c.offline }[g];
}

function Dot({ group, c }: { group: StatusGroup; c: HC }) {
  const col = dotColor(group, c);
  return <View style={[styles.dot, group === 'offline' ? { borderWidth: 1.5, borderColor: col } : { backgroundColor: col }]} />;
}

/** Picture (+ service warning) · plate · driver + km today · speed + last update. */
function VehicleRow({ row: { d, s, g }, selected, dueDays, onPress, onDriver }: { row: Row; selected: boolean; dueDays?: number; onPress: () => void; onDriver: () => void }) {
  const c = useColors();
  const r = useResponsive();
  const never = !s.lastSeenAt;
  const hasSpeed = g === 'moving' || g === 'stopped';
  const speed = hasSpeed ? String(s.speed ?? 0) : never ? 'Waiting' : STATUS_LABEL[g];
  const ago = agoText(s.lastSeenAt);
  const driver = d.mainDriver?.name || d.driverName || null;
  const km = `${Math.round(d.todayKm ?? 0)} km`;
  const svcWarn = dueDays != null && dueDays <= DUE_SOON_DAYS;
  const overdue = dueDays != null && dueDays < 0;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${d.registrationNumber || 'No number plate'}, ${driver ? `driver ${driver}` : 'no driver'}, ${hasSpeed ? `${s.speed ?? 0} kilometres per hour` : speed}, ${ago}${svcWarn ? `, service ${dueText(dueDays!).toLowerCase()}` : ''}`}
      style={({ pressed }) => [styles.row, { backgroundColor: selected || pressed ? c.surface : 'transparent' }]}
    >
      <View>
        <VehicleTile type={d.icon} color={d.color} width={r.small ? 62 : 74} height={r.small ? 46 : 52} dimmed={g === 'offline'} style={{ borderRadius: r.small ? 14 : 16 }} />
        {svcWarn && (
          <View style={[styles.svcBadge, { borderColor: c.bg, backgroundColor: overdue ? '#FBE5E5' : '#FBEBD0' }]}>
            <DIcon name="wrench" size={13} strokeWidth={2.2} color={overdue ? '#B42828' : '#7F4A00'} />
          </View>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        {d.registrationNumber ? <Plate value={d.registrationNumber} size={r.tiny ? 14 : r.small ? 15 : 16} /> : <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: c.textMuted }}>No number plate</Text>}
        <View style={styles.inline}>
          <Pressable
            onPress={onDriver}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 8 }}
            accessibilityRole="link"
            accessibilityLabel={driver ? `Driver ${driver}, open details` : 'No driver, add one'}
            style={styles.inline}
          >
            {driver ? (
              <>
                {d.mainDriver ? (
                  <DriverAvatar driver={d.mainDriver} size={20} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: c.dark ? c.surface2 : '#FBE4E4' }]}>
                    <Text style={{ fontSize: 11, fontFamily: fonts.bold, color: c.text }}>{driver.charAt(0).toUpperCase()}</Text>
                  </View>
                )}
                <Text numberOfLines={1} style={[styles.meta, { color: c.textMuted, flexShrink: 1 }]}>{driver.split(' ')[0]}</Text>
              </>
            ) : (
              <Text style={[styles.meta, { fontFamily: fonts.bold, color: c.accent }]}>+ Add driver</Text>
            )}
          </Pressable>
          <Text style={[styles.meta, { color: c.textMuted }]}>· {km}</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text maxFontSizeMultiplier={1.2} numberOfLines={1}>
          <Text style={{ fontFamily: fonts.bold, fontSize: hasSpeed ? 17 : 12, color: hasSpeed ? c.text : g === 'nogps' ? c.amberText : c.textMuted }}>{speed}</Text>
          {hasSpeed ? <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}> km/h</Text> : null}
        </Text>
        <View style={styles.inline}>
          <Dot group={g} c={c} />
          <Text numberOfLines={1} style={[styles.meta, { fontSize: 11, lineHeight: 15, color: hasSpeed ? c.greenText : g === 'nogps' ? c.amberText : c.textMuted }]}>{ago}</Text>
        </View>
      </View>
    </Pressable>
  );
}

/** Service sheet row: picture · plate · when it's due · how close (bar). */
function ServiceRow({ device, days, onPress }: { device: Device; days: number; onPress: () => void }) {
  const c = useColors();
  const col = days < 0 ? c.danger : days <= DUE_SOON_DAYS ? c.amber : c.green;
  const fill = days < 0 ? 1 : Math.max(0, Math.min(1, (SERVICE_CYCLE_DAYS - days) / SERVICE_CYCLE_DAYS));
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${plateOrName(device)}, service ${dueText(days).toLowerCase()}`} style={[styles.svcRow, { borderBottomColor: c.border }]}>
      <VehicleTile type={device.icon} color={device.color} width={56} height={40} style={{ borderRadius: 12 }} />
      <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <Plate value={plateOrName(device)} size={14} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: days < 0 ? c.danger : c.text }}>{dueText(days)}</Text>
        </View>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: c.track, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${Math.round(fill * 100)}%`, borderRadius: 3, backgroundColor: col }} />
        </View>
      </View>
    </Pressable>
  );
}

const shadow = { elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } };
const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: PAD, paddingTop: 18, paddingBottom: 6 },
  logoMark: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  bell: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  badgeText: { fontSize: 11, lineHeight: 13, fontFamily: fonts.bold },
  mapCard: { height: 150, borderRadius: 22, overflow: 'hidden' },
  expand: { position: 'absolute', right: 10, bottom: 10, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', ...shadow },
  actions: { flexDirection: 'row', gap: 8 },
  quick: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  filterBar: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 18, marginHorizontal: -PAD, paddingLeft: PAD, paddingRight: 10, borderBottomWidth: 1 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, paddingBottom: 8.5, paddingHorizontal: 2, borderBottomWidth: 2.5 },
  barBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  sortDot: { position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, marginTop: 14, borderRadius: 23, paddingLeft: 16 },
  searchX: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, marginHorizontal: -10, borderRadius: 20 },
  svcBadge: { position: 'absolute', right: -5, bottom: -5, width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  avatar: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, borderBottomWidth: 1 },
  svcRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1 },
  state: { paddingHorizontal: PAD, paddingTop: 12, gap: 18 },
  stateBody: { alignItems: 'center', gap: 10, paddingTop: 20, paddingHorizontal: 8 },
  stateTitle: { fontFamily: fonts.bold, fontSize: 18, textAlign: 'center' },
});
