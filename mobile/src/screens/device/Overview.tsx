// Vehicle details (design v2): picture + big speed + status + address, a map
// card that grows when expanded, totals, "Replay a day", and Driver / Service /
// Tracker / More tabs. More holds everything else (trips, report, alerts,
// geofences, sharing, navigate, settings).
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { api, errorText } from '@/api/client';
import { plateOrName, type Driver } from '@/api/types';
import { useDrivers } from '@/lib/drivers';
import { dueText, longDate, rupees, serviceType, useService } from '@/lib/service';
import { DriverAvatar } from '@/components/DriverAvatar';
import { shortAddress, useAddress } from '@/lib/address';
import { timeAgo, timeOnly } from '@/lib/format';
import { shareLiveLocation } from '@/lib/share';
import { STATUS_LABEL, statusGroup } from '@/lib/vehicleStatus';
import { AppMap } from '@/components/Map';
import { Card, PillButton, Plate, RoundButton, Sheet, Stat, StatusDot, TopBar, UnderlineTabs, VehicleTile, accentTint } from '@/components/kit';
import { DIcon } from '@/components/DesignIcon';
import { colorOf } from '@/lib/vehicleColors';
import { fonts, radius, shadow, space, type, useColors } from '@/theme';
import type { TabProps } from './types';

type Section = 'driver' | 'service' | 'tracker' | 'more';
type Summary = { totalKm: number; drivingHours: number; avgSpeed: number; trips: number };
type IconName = keyof typeof Ionicons.glyphMap;

const MAP_SMALL = 210;
const MAP_BIG = 430;
const SIGNAL = ['No signal', 'Weak', 'Fair', 'Good', 'Excellent'];

export function Overview({ device, state, isOwner }: TabProps) {
  const c = useColors();
  const params = useLocalSearchParams<{ section?: Section }>();
  const [section, setSection] = useState<Section>(params.section ?? 'driver');
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
        right={isOwner ? (
          <Pressable onPress={() => router.push(`/vehicles/edit?id=${device.id}`)} accessibilityRole="button" accessibilityLabel="Edit vehicle" style={styles.editBtn}>
            <DIcon name="edit" size={20} strokeWidth={2} />
          </Pressable>
        ) : undefined}
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: space.lg, paddingTop: 4, paddingBottom: 48, gap: 12 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <VehicleTile type={device.icon} color={device.color} width={88} height={62} dimmed={g === 'offline'} style={{ borderRadius: 18 }} />
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            {g === 'offline' ? (
              <Text style={{ fontFamily: fonts.bold, fontSize: 18, lineHeight: 22, color: c.textMuted }}>Offline</Text>
            ) : (
              <Text maxFontSizeMultiplier={1.2}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 36, lineHeight: 40, letterSpacing: -1, color: c.text }}>{state.speed ?? 0}</Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: c.textMuted }}> km/h</Text>
              </Text>
            )}
            <View style={styles.row6}>
              <StatusDot group={g} />
              <Text numberOfLines={1} style={[type.small, { color: g === 'moving' ? c.success : c.textMuted, flexShrink: 1 }]}>
                {state.lastSeenAt ? `${STATUS_LABEL[g]} · ${timeAgo(state.lastSeenAt)}` : 'Never connected'}
              </Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[type.small, { color: c.textMuted }]}>
              {hasPos ? address ? shortAddress(address, 38) : (addrLoading ? 'Finding address…' : `${state.lat!.toFixed(5)}, ${state.lon!.toFixed(5)}`) : 'No GPS position yet'}
            </Text>
          </View>
        </View>

        {/* Map card (grows when expanded) */}
        <Animated.View style={[styles.map, { backgroundColor: c.surface2 }, mapStyle]}>
          <AppMap
            initialCenter={hasPos ? { lat: state.lat!, lon: state.lon! } : undefined}
            initialZoom={15}
            selectedId={device.id}
            markers={hasPos ? [{ id: device.id, lat: state.lat!, lon: state.lon!, dot: colorOf(device.color)?.hex ?? '#202020' }] : []}
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

        <UnderlineTabs<Section> value={section} onChange={setSection} options={[['driver', 'Driver'], ['service', 'Service'], ['tracker', 'Tracker'], ['more', 'More']]} />

        {section === 'driver' && <DriverSection device={device} canEdit={isOwner} />}

        {section === 'service' && <ServiceSection deviceId={device.id} canEdit={isOwner} />}

        {section === 'more' && (
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

      </ScrollView>
    </SafeAreaView>
  );
}

type Slot = 'main' | 'backup';
type DriverRow = ReturnType<typeof useDrivers>['data'] extends (infer R)[] | undefined ? R : never;
const FIELD = { main: 'mainDriverId', backup: 'backupDriverId' } as const;
const vehicleLabel = (v: { registrationNumber: string | null; name: string | null }) => v.registrationNumber || v.name || 'another vehicle';

function DriverSection({ device, canEdit }: { device: TabProps['device']; canEdit: boolean }) {
  const c = useColors();
  const qc = useQueryClient();
  const { data: drivers = [] } = useDrivers();
  const [pick, setPick] = useState<Slot | null>(null);
  const [conflict, setConflict] = useState<DriverRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const main = device.mainDriver ?? null;
  const backup = device.backupDriver ?? null;
  const current = pick === 'main' ? main : backup;

  async function patch(deviceId: string, body: Record<string, string | null>) {
    await api(`/devices/${deviceId}`, { method: 'PATCH', body });
  }
  async function refresh() {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ['device'] }),
      qc.invalidateQueries({ queryKey: ['devices'] }),
      qc.invalidateQueries({ queryKey: ['drivers'] }),
    ]);
  }
  async function run(job: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await job();
      await refresh();
      setPick(null);
      setConflict(null);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  // Vehicles (other than this one) the driver already drives in this role.
  const elsewhere = (d: DriverRow, slot: Slot) => (slot === 'main' ? d.mainOf : d.backupOf).filter((v) => v.id !== device.id);

  /** `slot` of this vehicle gets `d`. Others they were driving: swapped to the old driver, or left empty. */
  function assign(d: DriverRow, slot: Slot, others: DriverRow['mainOf'], swap: boolean) {
    return run(async () => {
      const field = FIELD[slot];
      // Free the other vehicle(s) first (the old driver goes to the first one when swapping).
      for (let i = 0; i < others.length; i += 1) {
        await patch(others[i].id, { [field]: swap && i === 0 && current ? current.id : null });
      }
      await patch(device.id, { [field]: d.id });
    });
  }

  function choose(d: DriverRow) {
    if (!pick) return;
    const others = elsewhere(d, pick);
    if (others.length) setConflict(d);
    else assign(d, pick, [], false);
  }

  const other = pick === 'main' ? backup : main;
  const choices = drivers.filter((d) => d.id !== other?.id);
  const free = choices.filter((d) => !pick || elsewhere(d, pick).length === 0);
  const taken = choices.filter((d) => pick && elsewhere(d, pick).length > 0);
  const closeAll = () => { setPick(null); setConflict(null); setError(null); };
  const openPick = (s: Slot) => { setError(null); setPick(s); };

  return (
    <View>
      <DriverCard role="MAIN" driver={main} canEdit={canEdit} onAdd={() => openPick('main')} onChange={() => openPick('main')} />
      {canEdit && main && backup && (
        <View style={styles.swapWrap} pointerEvents="box-none">
          <Pressable
            onPress={() => !busy && run(async () => { await patch(device.id, { mainDriverId: backup.id, backupDriverId: main.id }); })}
            accessibilityRole="button"
            accessibilityLabel="Swap main and backup driver"
            style={[styles.swapBtn, { backgroundColor: c.dark ? c.surface : '#FFFFFF', borderColor: c.bg }]}
          >
            <DIcon name="swapV" size={18} strokeWidth={2.2} color={c.accent} />
          </Pressable>
        </View>
      )}
      <View style={{ height: 14 }} />
      <DriverCard role="BACKUP" driver={backup} canEdit={canEdit} onAdd={() => openPick('backup')} onChange={() => openPick('backup')} />

      <Sheet visible={!!pick} onClose={closeAll} title={conflict ? 'Driver already assigned' : pick === 'main' ? 'Main driver' : 'Backup driver'}>
        {conflict && pick ? (
          <View style={{ gap: 12 }}>
            <View style={styles.pickRow}>
              <DriverAvatar driver={conflict} size={44} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={[type.name, { color: c.text }]}>{conflict.name}</Text>
                <Text numberOfLines={1} style={[type.small, { color: c.danger }]}>
                  {pick === 'main' ? 'Main' : 'Backup'} driver of {elsewhere(conflict, pick).map(vehicleLabel).join(', ')}
                </Text>
              </View>
            </View>
            {current && (
              <PillButton
                title={`Swap with ${current.name.split(' ')[0]}`}
                icon="swap-horizontal"
                loading={busy}
                onPress={() => assign(conflict, pick, elsewhere(conflict, pick), true)}
              />
            )}
            <PillButton
              title={`Replace and leave ${vehicleLabel(elsewhere(conflict, pick)[0])} empty`}
              variant="secondary"
              onPress={() => assign(conflict, pick, elsewhere(conflict, pick), false)}
              disabled={busy}
            />
            <PillButton title="Cancel" variant="secondary" onPress={() => setConflict(null)} disabled={busy} />
            {error ? <Text style={[type.small, { color: c.danger }]}>{error}</Text> : null}
          </View>
        ) : (
          <>
            <ScrollView style={{ maxHeight: 380 }} contentContainerStyle={{ gap: 2 }}>
              {free.length > 0 && <Text style={[type.caption, styles.group, { color: c.textMuted }]}>AVAILABLE</Text>}
              {free.map((d) => {
                const on = current?.id === d.id;
                return (
                  <Pressable key={d.id} onPress={() => (on ? setPick(null) : choose(d))} disabled={busy} accessibilityRole="radio" accessibilityState={{ selected: on }} style={styles.pickRow}>
                    <DriverAvatar driver={d} size={44} />
                    <Text numberOfLines={1} style={[type.bodyStrong, { color: c.text, flex: 1 }]}>{d.name}</Text>
                    {on && <DIcon name="check" size={20} strokeWidth={2.6} color={c.accent} />}
                  </Pressable>
                );
              })}
              {taken.length > 0 && <Text style={[type.caption, styles.group, { color: c.textMuted }]}>ALREADY ASSIGNED</Text>}
              {taken.map((d) => (
                <Pressable key={d.id} onPress={() => choose(d)} disabled={busy} accessibilityRole="button" accessibilityLabel={`${d.name}, drives ${elsewhere(d, pick!).map(vehicleLabel).join(', ')}. Swap or replace`} style={styles.pickRow}>
                  <DriverAvatar driver={d} size={44} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={[type.bodyStrong, { color: c.text }]}>{d.name}</Text>
                    <Text numberOfLines={1} style={[type.caption, { color: c.danger, letterSpacing: 0 }]}>Drives {elsewhere(d, pick!).map(vehicleLabel).join(', ')}</Text>
                  </View>
                  <View style={[styles.swapChip, { backgroundColor: c.dangerSoft }]}>
                    <DIcon name="swap" size={18} strokeWidth={2.2} color={c.danger} />
                  </View>
                </Pressable>
              ))}
              {choices.length === 0 && <Text style={[type.small, { color: c.textMuted }]}>No other drivers yet.</Text>}
            </ScrollView>
            {error ? <Text style={[type.small, { color: c.danger }]}>{error}</Text> : null}
            <PillButton title="Add a new driver" icon="person-add-outline" variant="secondary" onPress={() => { closeAll(); router.push('/drivers/edit'); }} />
            {current && (
              <PillButton
                title={`Remove ${pick === 'main' ? 'main' : 'backup'} driver`}
                variant="danger"
                loading={busy}
                onPress={() => run(async () => { await patch(device.id, { [FIELD[pick!]]: null }); })}
              />
            )}
          </>
        )}
      </Sheet>
    </View>
  );
}

function DriverCard({ role, driver, canEdit, onAdd, onChange }: {
  role: 'MAIN' | 'BACKUP'; driver: Driver | null; canEdit: boolean; onAdd: () => void; onChange: () => void;
}) {
  const c = useColors();
  if (!driver) {
    return (
      <Pressable disabled={!canEdit} onPress={onAdd} accessibilityRole="button" style={[styles.driverCard, styles.dashed, { borderColor: c.offline }]}>
        <View style={[styles.avatar, { backgroundColor: c.dark ? c.surface : '#FFFFFF' }]}>
          <DIcon name="plus" size={24} strokeWidth={2.2} color={c.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.caption, { color: c.textMuted }]}>{role}</Text>
          <Text style={[type.name, { color: c.text }]}>{canEdit ? 'Add driver' : 'No driver set'}</Text>
        </View>
      </Pressable>
    );
  }
  return (
    <Card style={styles.driverCard} onPress={() => router.push(`/drivers/edit?id=${driver.id}`)}>
      <DriverAvatar driver={driver} size={60} />
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text style={[type.caption, { color: role === 'MAIN' ? c.accent : c.textMuted, fontFamily: type.fieldLabel.fontFamily }]}>{role}</Text>
        <Text numberOfLines={1} style={[type.name, { color: c.text }]}>{driver.name}</Text>
        {driver.phone ? <Text numberOfLines={1} style={[type.small, { color: c.textMuted }]}>{driver.phone}</Text> : null}
      </View>
      {driver.phone ? (
        <RoundButton icon="call-outline" label={`Call ${driver.name}`} onPress={() => Linking.openURL(`tel:${driver.phone!.replace(/[^+\d]/g, '')}`)} size={44} iconSize={18} />
      ) : null}
      {canEdit && (
        <Pressable onPress={onChange} accessibilityRole="button" accessibilityLabel={`Change ${role.toLowerCase()} driver`} style={[styles.editCircle, { backgroundColor: c.surface }]}>
          <DIcon name="edit" size={18} strokeWidth={2} />
        </Pressable>
      )}
    </Card>
  );
}

function ServiceSection({ deviceId, canEdit }: { deviceId: string; canEdit: boolean }) {
  const c = useColors();
  const { data, isLoading } = useService(deviceId);
  const records = data?.data ?? [];
  const next = data?.next ?? null;
  const add = () => router.push(`/service/edit?deviceId=${deviceId}`);
  const open = (id: string) => canEdit && router.push(`/service/edit?deviceId=${deviceId}&id=${id}`);

  if (isLoading) return <Card><Text style={[type.small, { color: c.textMuted }]}>Loading…</Text></Card>;
  if (!records.length) {
    return (
      <Card style={{ alignItems: 'center', gap: space.sm, paddingVertical: space.xl }}>
        <View style={[styles.tileIcon, { backgroundColor: accentTint, width: 48, height: 48, borderRadius: 24 }]}>
          <Ionicons name="construct-outline" size={22} color={c.text} />
        </View>
        <Text style={[type.name, { color: c.text }]}>No service records yet</Text>
        <Text style={[type.small, { color: c.textMuted, textAlign: 'center' }]}>Keep the service history here and get a reminder before the next one.</Text>
        {canEdit && <PillButton title="Add service record" icon="add" variant="dark" onPress={add} style={{ alignSelf: 'stretch', marginTop: space.sm }} />}
      </Card>
    );
  }

  const [latest, ...older] = records;
  const t = serviceType(latest.type);
  const late = next && next.daysLeft < 0;
  return (
    <View style={{ gap: space.md }}>
      <Card onPress={canEdit ? () => open(latest.id) : undefined} style={{ gap: space.md }}>
        <View style={styles.row6}>
          <View style={[styles.tileIcon, { backgroundColor: accentTint, width: 44, height: 44, borderRadius: 22 }]}>
            <Ionicons name={t.icon} size={20} color={c.text} />
          </View>
          <View style={{ flex: 1, minWidth: 0, marginLeft: 6 }}>
            <Text style={[type.name, { color: c.text }]}>{t.label}</Text>
            <Text numberOfLines={1} style={[type.small, { color: c.textMuted }]}>{[longDate(latest.date), latest.garage].filter(Boolean).join(' · ')}</Text>
          </View>
        </View>
        {(latest.odometerKm != null || latest.cost != null) && (
          <View style={{ flexDirection: 'row' }}>
            {latest.odometerKm != null && <Stat value={latest.odometerKm.toLocaleString('en-IN')} unit="km" label="Odometer" />}
            {latest.cost != null && <Stat value={rupees(latest.cost)} label="Cost" />}
          </View>
        )}
        {next && (
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[type.small, { color: c.textMuted }]}>Next service · {longDate(next.date)}</Text>
              <Text style={[type.small, { color: late ? c.danger : c.text, fontFamily: type.fieldLabel.fontFamily }]}>{dueText(next.daysLeft)}</Text>
            </View>
            <View style={[styles.bar, { backgroundColor: c.surface2 }]}>
              <View style={[styles.barFill, { width: `${Math.round(next.progress * 100)}%`, backgroundColor: late ? c.danger : c.accent }]} />
            </View>
          </View>
        )}
      </Card>

      {older.length > 0 && (
        <Card padded={false}>
          {older.map((r, i) => {
            const ot = serviceType(r.type);
            return (
              <Pressable
                key={r.id}
                disabled={!canEdit}
                onPress={() => open(r.id)}
                style={[styles.moreRow, i < older.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}
              >
                <Ionicons name={ot.icon} size={18} color={c.text} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[type.bodyStrong, { color: c.text }]}>{ot.label}</Text>
                  <Text numberOfLines={1} style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{[longDate(r.date), r.garage].filter(Boolean).join(' · ')}</Text>
                </View>
                {r.cost != null && <Text style={[type.bodyStrong, { color: c.text }]}>{rupees(r.cost)}</Text>}
              </Pressable>
            );
          })}
        </Card>
      )}

      {canEdit && <PillButton title="Add service record" icon="add" variant="dark" onPress={add} />}
    </View>
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
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20 },
  dashed: { borderWidth: 1.5, borderStyle: 'dashed' },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  swapWrap: { position: 'absolute', left: 0, right: 0, top: '50%', marginTop: -22, alignItems: 'center', zIndex: 2 },
  pickRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56 },
  group: { marginTop: 8, marginBottom: 2, letterSpacing: 1 },
  swapChip: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  swapBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  editBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  editCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  bar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  moreRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, minHeight: 52 },
});
