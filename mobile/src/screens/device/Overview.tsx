// Vehicle details (design v2): picture + big speed + status + address, a map
// card that grows when expanded, totals, "Replay a day", and Driver / Service /
// Tracker tabs. Everything else (trips, report, alerts, geofences, sharing,
// settings) is one tap away in "More".
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { api } from '@/api/client';
import { plateOrName } from '@/api/types';
import { useAddress } from '@/lib/address';
import { timeAgo, timeOnly } from '@/lib/format';
import { shareLiveLocation } from '@/lib/share';
import { STATUS_LABEL, statusGroup } from '@/lib/vehicleStatus';
import { AppMap } from '@/components/Map';
import { Banner, Card, PillButton, Plate, RoundButton, Stat, StatusDot, TopBar, UnderlineTabs, VehicleTile, accentTint } from '@/components/kit';
import { radius, shadow, space, type, useColors } from '@/theme';
import type { TabProps } from './types';

type Section = 'driver' | 'service' | 'tracker';
type Summary = { totalKm: number; drivingHours: number; avgSpeed: number; trips: number };
type IconName = keyof typeof Ionicons.glyphMap;

const MAP_SMALL = 210;
const MAP_BIG = 430;
const SIGNAL = ['No signal', 'Weak', 'Fair', 'Good', 'Excellent'];

export function Overview({ device, state, isOwner }: TabProps) {
  const c = useColors();
  const [section, setSection] = useState<Section>('driver');
  const [big, setBig] = useState(false);
  const g = statusGroup(state);
  const hasPos = state.lat != null && state.lon != null;
  const { address, isLoading: addrLoading } = useAddress(state.lat, state.lon);
  const summary = useQuery({
    queryKey: ['summary', device.id],
    queryFn: () => api<{ data: Summary }>(`/devices/${device.id}/summary`),
  }).data?.data;

  const h = useSharedValue(MAP_SMALL);
  useEffect(() => {
    h.value = withTiming(big ? MAP_BIG : MAP_SMALL, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, [big, h]);
  const mapStyle = useAnimatedStyle(() => ({ height: h.value }));

  const open = (tab: string) => router.push(`/device/${device.id}?tab=${tab}`);
  const fmt = (n?: number) => (n == null ? '—' : n.toLocaleString('en-IN', { maximumFractionDigits: n >= 100 ? 0 : 1 }));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar
        onBack={() => router.back()}
        title={<Plate value={plateOrName(device)} size={20} />}
        right={isOwner ? <RoundButton icon="create-outline" label="Edit vehicle" onPress={() => open('settings')} size={40} iconSize={20} /> : undefined}
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 48, gap: space.lg }}>
        {/* Hero */}
        <View style={styles.hero}>
          <VehicleTile type={device.icon} width={104} height={86} dimmed={g === 'offline'} />
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            {g === 'offline' ? (
              <Text style={[type.title, { color: c.text }]}>Offline</Text>
            ) : (
              <Text maxFontSizeMultiplier={1.2}>
                <Text style={[type.number, { color: c.text, fontSize: 34, lineHeight: 40 }]}>{state.speed ?? 0}</Text>
                <Text style={[type.small, { color: c.textMuted }]}> km/h</Text>
              </Text>
            )}
            <View style={styles.row6}>
              <StatusDot group={g} />
              <Text numberOfLines={1} style={[type.small, { color: g === 'moving' ? c.success : c.textMuted, flexShrink: 1 }]}>
                {state.lastSeenAt ? `${STATUS_LABEL[g]} · ${timeAgo(state.lastSeenAt)}` : 'Never connected'}
              </Text>
            </View>
            <Text numberOfLines={2} style={[type.small, { color: c.textMuted }]}>
              {hasPos ? address ?? (addrLoading ? 'Finding address…' : `${state.lat!.toFixed(5)}, ${state.lon!.toFixed(5)}`) : 'No GPS position yet'}
            </Text>
          </View>
        </View>

        {g === 'offline' && state.lastSeenAt && (
          <Banner tone="soft" icon="cloud-offline-outline" text={`Offline since ${timeOnly(state.lastSeenAt)} · last data shown`} />
        )}

        {/* Map card (grows when expanded) */}
        <Animated.View style={[styles.map, { backgroundColor: c.surface2 }, mapStyle]}>
          <AppMap
            initialCenter={hasPos ? { lat: state.lat!, lon: state.lon! } : undefined}
            initialZoom={15}
            selectedId={device.id}
            markers={hasPos ? [{ id: device.id, lat: state.lat!, lon: state.lon!, heading: state.heading, online: state.online, vehicle: device.icon }] : []}
            follow={hasPos ? { lat: state.lat!, lon: state.lon! } : null}
          />
          <View style={styles.mapBtn}>
            <RoundButton icon={big ? 'contract-outline' : 'expand-outline'} label={big ? 'Smaller map' : 'Bigger map'} onPress={() => setBig(!big)} size={40} iconSize={18} />
          </View>
        </Animated.View>

        {/* Totals */}
        <View style={{ flexDirection: 'row', gap: space.md }}>
          <Stat value={fmt(summary?.totalKm)} unit="km" label="Total distance" />
          <Stat value={fmt(summary?.drivingHours)} unit="h" label="Driving hours" />
          <Stat value={fmt(summary?.avgSpeed)} unit="km/h" label="Avg speed" />
        </View>

        <PillButton title="Replay a day" icon="play-circle-outline" variant="secondary" onPress={() => open('history')} />

        <UnderlineTabs<Section> value={section} onChange={setSection} options={[['driver', 'Driver'], ['service', 'Service'], ['tracker', 'Tracker']]} />

        {section === 'driver' && <DriverSection name={device.driverName} canEdit={isOwner} onEdit={() => open('settings')} />}

        {section === 'service' && (
          <Card style={{ alignItems: 'center', gap: space.sm, paddingVertical: space.xl }}>
            <View style={[styles.tileIcon, { backgroundColor: accentTint, width: 48, height: 48, borderRadius: 24 }]}>
              <Ionicons name="construct-outline" size={22} color={c.text} />
            </View>
            <Text style={[type.name, { color: c.text }]}>No service records yet</Text>
            <Text style={[type.small, { color: c.textMuted, textAlign: 'center' }]}>Service history and reminders for this vehicle will show here.</Text>
          </Card>
        )}

        {section === 'tracker' && (
          <View style={styles.grid}>
            <Tile icon="wifi-outline" value={state.online ? 'Online' : 'Offline'} label="Connection" />
            <Tile icon="time-outline" value={state.gpsTime ? timeOnly(state.gpsTime) : '—'} label="Last GPS" />
            <Tile icon="key-outline" value={state.ignition == null ? '—' : state.ignition ? 'On' : 'Off'} label="Ignition" />
            <Tile
              icon={state.externalPower ? 'battery-charging-outline' : 'battery-half-outline'}
              value={state.batteryPercent != null ? `${state.batteryPercent}%` : '—'}
              label={state.externalPower ? 'Battery · charging' : 'Battery'}
            />
            <Tile icon="cellular-outline" value={state.gsmSignal != null ? SIGNAL[Math.max(0, Math.min(4, state.gsmSignal))] : '—'} label="Mobile signal" />
            <Tile icon="locate-outline" value={state.satellites != null ? String(state.satellites) : '—'} label="Satellites" />
          </View>
        )}

        {/* More */}
        <Text style={[type.fieldLabel, { color: c.textMuted, marginTop: space.sm }]}>MORE</Text>
        <Card padded={false}>
          <MoreRow icon="git-branch-outline" label="Trips" onPress={() => open('trips')} />
          <MoreRow icon="bar-chart-outline" label="Report" onPress={() => open('report')} />
          <MoreRow icon="notifications-outline" label="Alerts" onPress={() => open('alerts')} />
          <MoreRow icon="shapes-outline" label="Geofences" onPress={() => open('geofences')} />
          {isOwner && <MoreRow icon="people-outline" label="Share with family" onPress={() => open('sharing')} />}
          {isOwner && <MoreRow icon="share-social-outline" label="Share live location" onPress={() => shareLiveLocation(device).catch(() => {})} />}
          <MoreRow
            icon="navigate-outline"
            label="Navigate to vehicle"
            disabled={!hasPos}
            onPress={() => Linking.openURL(`google.navigation:q=${state.lat},${state.lon}`).catch(() => Linking.openURL(`https://www.google.com/maps?q=${state.lat},${state.lon}`))}
          />
          <MoreRow icon="settings-outline" label="Settings" onPress={() => open('settings')} last />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function DriverSection({ name, canEdit, onEdit }: { name?: string | null; canEdit: boolean; onEdit: () => void }) {
  const c = useColors();
  if (!name) {
    return (
      <Pressable
        disabled={!canEdit}
        onPress={onEdit}
        accessibilityRole="button"
        style={[styles.driverCard, styles.dashed, { borderColor: c.border }]}
      >
        <View style={[styles.avatar, { backgroundColor: c.surface }]}>
          <Ionicons name="add" size={26} color={c.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.caption, { color: c.textMuted }]}>MAIN</Text>
          <Text style={[type.name, { color: c.text }]}>{canEdit ? 'Add driver' : 'No driver set'}</Text>
        </View>
      </Pressable>
    );
  }
  return (
    <Card style={styles.driverCard}>
      <View style={[styles.avatar, { backgroundColor: accentTint }]}>
        <Text style={[type.title, { color: c.text, fontSize: 22 }]}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[type.caption, { color: c.text, fontFamily: type.fieldLabel.fontFamily }]}>MAIN</Text>
        <Text numberOfLines={1} style={[type.name, { color: c.text }]}>{name}</Text>
      </View>
      {canEdit && <RoundButton icon="create-outline" label="Edit driver" onPress={onEdit} size={40} iconSize={18} />}
    </Card>
  );
}

function Tile({ icon, value, label }: { icon: IconName; value: string; label: string }) {
  const c = useColors();
  return (
    <View style={[styles.tile, { backgroundColor: c.surface }, shadow.card]}>
      <View style={[styles.tileIcon, { backgroundColor: accentTint }]}>
        <Ionicons name={icon} size={18} color={c.text} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={[type.name, { color: c.text, fontSize: 15 }]}>{value}</Text>
        <Text numberOfLines={1} style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{label}</Text>
      </View>
    </View>
  );
}

function MoreRow({ icon, label, onPress, disabled, last }: { icon: IconName; label: string; onPress: () => void; disabled?: boolean; last?: boolean }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [styles.moreRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }, { opacity: disabled ? 0.4 : pressed ? 0.7 : 1 }]}
    >
      <Ionicons name={icon} size={20} color={c.text} />
      <Text style={[type.body, { color: c.text, flex: 1 }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  row6: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  map: { borderRadius: radius.card, overflow: 'hidden' },
  mapBtn: { position: 'absolute', top: 12, right: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  tile: { width: '47.5%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md },
  tileIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.card },
  dashed: { borderWidth: 1.5, borderStyle: 'dashed' },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  moreRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, minHeight: 52 },
});
