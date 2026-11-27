// Vehicle details (design v2): picture + big speed + status + address, a map
// card that grows when expanded, totals, "Replay a day", and Driver / Service /
// Tracker / More tabs. More holds everything else (trips, report, alerts,
// geofences, sharing, navigate, settings).
import { useState } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LayoutAnimation, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { plateOrName, type Driver } from '@/api/types';
import { useDrivers } from '@/lib/drivers';
import { daysUntil, dueText, longDate, rupees, serviceType, useService } from '@/lib/service';
import { DriverAvatar } from '@/components/DriverAvatar';
import { shortAddress, useAddress } from '@/lib/address';
import { timeAgo, timeOnly } from '@/lib/format';
import { shareCurrentLocation, shareLiveLocation } from '@/lib/share';
import { STATUS_LABEL, statusGroup } from '@/lib/vehicleStatus';
import { AppMap } from '@/components/Map';
import { PillButton, Plate, RoundButton, Stat, StatusDot, TopBar, UnderlineTabs, VehicleTile, accentTint } from '@/components/kit';
import { DesignSheet } from '@/components/DesignSheet';
import { BottomNav } from '@/components/BottomNav';
import { DIcon } from '@/components/DesignIcon';
import { colorOf } from '@/lib/vehicleColors';
import { fonts, radius, shadow, space, type, useColors } from '@/theme';
import { clamp, useResponsive } from '@/lib/responsive';
import type { TabProps } from './types';

type Section = 'driver' | 'service' | 'tracker' | 'more';
type Summary = { totalKm: number; drivingHours: number; avgSpeed: number; trips: number };
type IconName = keyof typeof Ionicons.glyphMap;

const SIGNAL = ['No signal', 'Weak', 'Fair', 'Good', 'Excellent'];

export function Overview({ device, state, isOwner }: TabProps) {
  const c = useColors();
  const r = useResponsive();
  const mapH = Math.round(clamp(r.height * 0.18, 110, 170));
  const params = useLocalSearchParams<{ section?: Section; from?: string }>();
  const [section, setSection] = useState<Section>(params.section ?? 'driver');
  const [big, setBig] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const g = statusGroup(state);
  const hasPos = state.lat != null && state.lon != null;
  const { address, isLoading: addrLoading } = useAddress(state.lat, state.lon);
  const summary = useQuery({
    queryKey: ['summary', device.id],
    queryFn: () => api<{ data: Summary }>(`/devices/${device.id}/summary`),
  }).data?.data;

  const open = (tab: string) => router.push(`/device/${device.id}?tab=${tab}`);
  const fmt = (n?: number) => (n == null ? '—' : n.toLocaleString('en-IN', { maximumFractionDigits: n >= 100 ? 0 : 1 }));
  const toggleBig = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBig(!big);
  };

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

      {/* Short map and loose space at the bottom: the page scrolls a little on small phones. */}
      <ScrollView bounces={false} overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        {/* Hero */}
        <View style={styles.hero}>
          <VehicleTile type={device.icon} color={device.color} width={r.small ? 72 : 88} height={r.small ? 52 : 62} dimmed={g === 'offline'} style={{ borderRadius: 18 }} />
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            {g === 'offline' ? (
              <Text style={{ fontFamily: fonts.bold, fontSize: r.small ? 20 : 24, lineHeight: 30, letterSpacing: -0.4, color: c.textMuted }}>Offline</Text>
            ) : (
              <Text maxFontSizeMultiplier={1.2}>
                <Text style={{ fontFamily: fonts.bold, fontSize: r.small ? 34 : 40, lineHeight: r.small ? 40 : 46, letterSpacing: -1, color: c.text }}>{state.speed ?? 0}</Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: c.textMuted }}> km/h</Text>
              </Text>
            )}
            <View style={styles.row6}>
              <StatusDot group={g} />
              <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: 11, lineHeight: 15, color: g === 'moving' ? c.success : c.textMuted, flexShrink: 1 }}>
                {state.lastSeenAt ? `${STATUS_LABEL[g]} · ${timeAgo(state.lastSeenAt)}` : 'Never connected'}
              </Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[type.small, { color: c.textMuted, fontSize: 13, lineHeight: 18 }]}>
              {hasPos ? address ? shortAddress(address, 38) : (addrLoading ? 'Finding address…' : `${state.lat!.toFixed(5)}, ${state.lon!.toFixed(5)}`) : 'No GPS position yet'}
            </Text>
          </View>
        </View>

        {/* Map card: takes the free height; the button makes it fill the page */}
        <View style={[styles.map, { backgroundColor: c.surface2, height: mapH }, big && { height: Math.round(clamp(r.height * 0.42, 240, 380)) }]}>
          <AppMap
            initialCenter={hasPos ? { lat: state.lat!, lon: state.lon! } : undefined}
            initialZoom={15}
            selectedId={device.id}
            markers={hasPos ? [{ id: device.id, lat: state.lat!, lon: state.lon!, dot: colorOf(device.color)?.hex ?? '#202020' }] : []}
            follow={hasPos ? { lat: state.lat!, lon: state.lon! } : null}
          />
          <View style={styles.mapBtn}>
            <Pressable onPress={toggleBig} accessibilityRole="button" accessibilityLabel={big ? 'Smaller map' : 'Bigger map'} style={styles.mapToggle}>
              <DIcon name={big ? 'shrink' : 'expand'} size={16} strokeWidth={2.2} color="#202020" />
            </Pressable>
          </View>
        </View>

        {!big && (
          <>
            {/* Totals */}
            <View style={{ flexDirection: 'row', gap: space.md }}>
              <Stat value={fmt(summary?.totalKm)} unit="km" label="Total distance" />
              <Stat value={fmt(summary?.drivingHours)} unit="h" label="Driving hours" />
              <Stat value={fmt(summary?.avgSpeed)} unit="km/h" label="Avg speed" />
            </View>

            <Pressable onPress={() => open('history')} accessibilityRole="button" style={({ pressed }) => [styles.replay, { borderColor: c.dark ? c.border : '#F3D3D3', backgroundColor: c.dark ? c.surface : '#FFFFFF', opacity: pressed ? 0.8 : 1 }]}>
              <DIcon name="replay" size={16} strokeWidth={2} color={c.accent} />
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, lineHeight: 18, color: c.accent }}>Replay a day</Text>
            </Pressable>

            <UnderlineTabs<Section> value={section} onChange={setSection} options={[['driver', 'Driver'], ['service', 'Service'], ['tracker', 'Tracker'], ['more', 'More']]} />

            {section === 'driver' && <DriverSection device={device} canEdit={isOwner} />}

            {section === 'service' && <ServiceSection deviceId={device.id} canEdit={isOwner} />}

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

            {section === 'more' && (
              <View style={styles.grid}>
                <MoreTile icon="play-circle-outline" label="Replay a day" onPress={() => open('history')} />
                <MoreTile icon="git-branch-outline" label="Trips" onPress={() => open('trips')} />
                <MoreTile icon="bar-chart-outline" label="Report" onPress={() => open('report')} />
                <MoreTile icon="notifications-outline" label="Alerts" onPress={() => open('alerts')} />
                <MoreTile icon="shapes-outline" label="Geofences" onPress={() => open('geofences')} />
                <MoreTile icon="share-social-outline" label="Share" onPress={() => setShareOpen(true)} />
                <MoreTile
                  icon="navigate-outline"
                  label="Navigate"
                  disabled={!hasPos}
                  onPress={() => Linking.openURL(`google.navigation:q=${state.lat},${state.lon}`).catch(() => Linking.openURL(`https://www.google.com/maps?q=${state.lat},${state.lon}`))}
                />
                <MoreTile icon="settings-outline" label="Settings" onPress={() => open('settings')} />
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Share: choose Live or Current, then the phone's share sheet (WhatsApp, etc.) */}
      <DesignSheet visible={shareOpen} onClose={() => setShareOpen(false)} title="Share location">
        <ShareChoice
          icon="radio-outline"
          title="Live location"
          text="A link that follows the vehicle for 1 hour"
          disabled={!isOwner}
          onPress={() => { setShareOpen(false); shareLiveLocation(device).catch(() => {}); }}
        />
        <ShareChoice
          icon="location-outline"
          title="Current location"
          text={hasPos ? 'Where it is right now (a map link)' : 'No GPS position yet'}
          disabled={!hasPos}
          onPress={() => { setShareOpen(false); shareCurrentLocation(device, state.lat!, state.lon!).catch(() => {}); }}
        />
      </DesignSheet>
      <BottomNav active={params.from === 'map' ? 'map' : 'home'} />
    </SafeAreaView>
  );
}

type Slot = 'main' | 'backup';
type DriverRow = ReturnType<typeof useDrivers>['data'] extends (infer R)[] | undefined ? R : never;
const FIELD = { main: 'mainDriverId', backup: 'backupDriverId' } as const;
const vehicleLabel = (v: { registrationNumber: string | null; name: string | null }) => v.registrationNumber || v.name || 'another vehicle';

function DriverSection({ device, canEdit }: { device: TabProps['device']; canEdit: boolean }) {
  const c = useColors();
  const r = useResponsive();
  const qc = useQueryClient();
  const { data: drivers = [] } = useDrivers();
  const [pick, setPick] = useState<Slot | null>(null);
  const [conflict, setConflict] = useState<DriverRow | null>(null);
  // Swap button: the arrows make a U-turn (a half flip) each time it is tapped.
  const turn = useSharedValue(0);
  const turnStyle = useAnimatedStyle(() => ({ transform: [{ perspective: 260 }, { rotateX: `${turn.value}deg` }] }));
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
  // 4 in a row; 5 once there are more than 24 drivers.
  const cols = choices.length > 24 ? 5 : r.tiny ? 3 : 4;
  const closeAll = () => { setPick(null); setConflict(null); setError(null); };
  const openPick = (s: Slot) => { setError(null); setPick(s); };

  return (
    <View>
      <DriverCard role="MAIN" driver={main} canEdit={canEdit} onAdd={() => openPick('main')} onChange={() => openPick('main')} />
      {canEdit && main && backup && (
        <View style={styles.swapWrap} pointerEvents="box-none">
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <Pressable
            onPress={() => {
              if (busy) return;
              turn.value = withTiming(turn.value + 180, { duration: 450, easing: Easing.inOut(Easing.cubic) });
              run(async () => { await patch(device.id, { mainDriverId: backup.id, backupDriverId: main.id }); });
            }}
            accessibilityRole="button"
            accessibilityLabel="Swap main and backup driver"
            style={[styles.swapBtn, { backgroundColor: c.dark ? c.surface : '#FFFFFF', borderColor: c.bg }]}
          >
            <Animated.View style={turnStyle}>
              <DIcon name="swapV" size={14} strokeWidth={2.2} color={c.accent} />
            </Animated.View>
          </Pressable>
        </View>
      )}
      <View style={{ height: 14 }} />
      <DriverCard role="BACKUP" driver={backup} canEdit={canEdit} onAdd={() => openPick('backup')} onChange={() => openPick('backup')} />

      <DesignSheet visible={!!pick} onClose={closeAll} title={conflict ? 'Driver already assigned' : pick === 'main' ? 'Main driver' : 'Backup driver'}>
        {conflict && pick ? (
          <View style={{ gap: 12 }}>
            <View style={styles.pickRow}>
              <DriverAvatar driver={conflict} size={52} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={[type.name, { color: c.text }]}>{conflict.name}</Text>
                <Text numberOfLines={2} style={[type.small, { color: c.danger }]}>
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
            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              <View style={styles.pickGrid}>
                {choices.map((d) => {
                  const on = current?.id === d.id;
                  const busyElsewhere = !!pick && elsewhere(d, pick).length > 0;
                  return (
                    <Pressable
                      key={d.id}
                      onPress={() => (on ? setPick(null) : choose(d))}
                      disabled={busy}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={busyElsewhere ? `${d.name}, drives ${elsewhere(d, pick!).map(vehicleLabel).join(', ')}. Swap or replace` : d.name}
                      style={[styles.pickCell, { width: `${100 / cols}%` }]}
                    >
                      <View style={[styles.pickRing, { borderColor: on ? c.accent : 'transparent' }]}>
                        <DriverAvatar driver={d} size={cols === 5 ? 50 : 56} />
                        {busyElsewhere && (
                          <View style={[styles.takenBadge, { backgroundColor: c.danger, borderColor: c.dark ? c.surface : '#FFFFFF' }]}>
                            <DIcon name="swap" size={11} strokeWidth={2.4} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 12, color: c.text, maxWidth: '92%' }}>{d.name.split(' ')[0]}</Text>
                    </Pressable>
                  );
                })}
                {/* Add a new driver (last) */}
                <Pressable
                  onPress={() => { closeAll(); router.push('/drivers/edit'); }}
                  accessibilityRole="button"
                  accessibilityLabel="Add a new driver"
                  style={[styles.pickCell, { width: `${100 / cols}%` }]}
                >
                  <View style={[styles.pickRing, { borderColor: 'transparent' }]}>
                    <View style={[styles.plusCircle, { width: cols === 5 ? 50 : 56, height: cols === 5 ? 50 : 56, backgroundColor: c.surface }]}>
                      <DIcon name="plus" size={24} strokeWidth={2.2} color={c.accent} />
                    </View>
                  </View>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.text }}>Add</Text>
                </Pressable>
              </View>
            </ScrollView>
            {error ? <Text style={[type.small, { color: c.danger }]}>{error}</Text> : null}
            {current && (
              <Pressable onPress={() => run(async () => { await patch(device.id, { [FIELD[pick!]]: null }); })} disabled={busy} accessibilityRole="button" style={{ alignSelf: 'center', minHeight: 40, justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: c.danger }}>{pick === 'backup' ? 'No backup driver' : 'Remove main driver'}</Text>
              </Pressable>
            )}
          </>
        )}
      </DesignSheet>
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
        <View style={[styles.avatar, { backgroundColor: c.dark ? c.surface2 : '#FFFFFF' }]}>
          <DIcon name="plus" size={22} strokeWidth={2.2} color={c.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.caption, { color: c.textMuted }]}>{role}</Text>
          <Text style={[type.name, { color: c.text }]}>{canEdit ? 'Add driver' : 'No driver set'}</Text>
        </View>
      </Pressable>
    );
  }
  // The card itself does nothing when tapped (avoids accidental opens); only the call and edit buttons act.
  return (
    <View style={styles.driverCard}>
      <DriverAvatar driver={driver} size={48} />
      <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
        <Text style={[type.caption, { color: role === 'MAIN' ? c.accent : c.textMuted, fontFamily: type.fieldLabel.fontFamily }]}>{role}</Text>
        <Text numberOfLines={1} style={[type.name, { color: c.text }]}>{driver.name}</Text>
      </View>
      {driver.phone ? (
        <Pressable
          onPress={() => Linking.openURL(`tel:${driver.phone!.replace(/[^+\d]/g, '')}`)}
          accessibilityRole="button"
          accessibilityLabel={`Call ${driver.name}`}
          hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
          style={styles.callBtn}
        >
          <DIcon name="phone" size={17} strokeWidth={2} />
        </Pressable>
      ) : null}
      {canEdit && (
        <Pressable onPress={onChange} accessibilityRole="button" accessibilityLabel={`Change ${role.toLowerCase()} driver`} style={[styles.editCircle, { backgroundColor: c.surface }]}>
          <DIcon name="edit" size={18} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

function ServiceSection({ deviceId, canEdit }: { deviceId: string; canEdit: boolean }) {
  const c = useColors();
  const { data, isLoading } = useService(deviceId);
  const records = data?.data ?? [];
  const next = data?.next ?? null;
  const [picked, setPicked] = useState<string | null>(null);
  const add = () => router.push(`/service/edit?deviceId=${deviceId}`);
  const edit = (id: string) => router.push(`/service/edit?deviceId=${deviceId}&id=${id}`);
  const muted = { fontFamily: fonts.body, fontSize: 12, lineHeight: 16, color: c.textMuted } as const;

  if (isLoading) return <Text style={[muted, { textAlign: 'center', paddingVertical: 24 }]}>Loading…</Text>;

  const selected = records.find((r) => r.id === picked) ?? records[0] ?? null;
  const t = selected ? serviceType(selected.type) : null;
  // This record's own next date, or else the vehicle's next service overall.
  const dueDate = selected?.nextDueDate ?? next?.date ?? null;
  const days = dueDate ? daysUntil(dueDate) : null;
  const late = days != null && days < 0;
  const progress = dueDate && next && dueDate === next.date ? next.progress : null;

  return (
    <View style={{ gap: 12 }}>
      {/* One tag per service record; tap a tag to see it */}
      {records.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {records.map((r) => {
            const on = r.id === selected?.id;
            return (
              <Pressable
                key={r.id}
                onPress={() => setPicked(r.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={{ height: 32, paddingHorizontal: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: on ? (c.dark ? c.text : '#202020') : c.surface }}
              >
                <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: on ? (c.dark ? c.bg : '#FFFFFF') : c.text }}>{serviceType(r.type).label}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: on ? (c.dark ? c.bg : '#FFFFFF') : c.textMuted }}>{longDate(r.date)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {selected && t ? (
        <View style={[styles.svcCard, { backgroundColor: c.surface }]}>
          <View style={styles.row6}>
            <View style={[styles.tileIcon, { backgroundColor: c.dark ? c.surface2 : '#FFFFFF', width: 36, height: 36, borderRadius: 18 }]}>
              <Ionicons name={t.icon} size={17} color={c.accent} />
            </View>
            <View style={{ flex: 1, minWidth: 0, marginLeft: 4 }}>
              <Text numberOfLines={1} style={[type.name, { color: c.text }]}>{t.label}</Text>
              <Text numberOfLines={1} style={muted}>{[longDate(selected.date), selected.garage].filter(Boolean).join(' · ')}</Text>
            </View>
            {canEdit && (
              <Pressable onPress={() => edit(selected.id)} accessibilityRole="button" accessibilityLabel="Edit this service record" hitSlop={8} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                <DIcon name="edit" size={16} strokeWidth={2} />
              </Pressable>
            )}
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            {selected.odometerKm != null && <Detail label="Odometer" value={`${selected.odometerKm.toLocaleString('en-IN')} km`} />}
            {selected.cost != null && <Detail label="Cost" value={rupees(selected.cost)} />}
          </View>
          {selected.notes ? <Text style={[muted, { fontSize: 13, lineHeight: 18, color: c.text }]}>{selected.notes}</Text> : null}

          {/* Next service due */}
          <View style={{ gap: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border, paddingTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={muted}>Next service due</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: late ? c.danger : c.text }}>
                {dueDate ? `${longDate(dueDate)} · ${dueText(days!)}` : 'Not set'}
              </Text>
            </View>
            {progress != null && (
              <View style={[styles.bar, { backgroundColor: c.dark ? c.surface2 : '#EDEDED' }]}>
                <View style={[styles.barFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: late ? c.danger : c.accent }]} />
              </View>
            )}
          </View>
        </View>
      ) : (
        <Text style={[muted, { textAlign: 'center', paddingVertical: 20 }]}>No service records yet. Keep the history here and get a reminder before the next one.</Text>
      )}

      {canEdit && <PillButton title="Add service record" icon="add" variant="dark" onPress={add} style={{ minHeight: 46 }} />}
    </View>
  );
}

function ShareChoice({ icon, title, text, onPress, disabled }: { icon: IconName; title: string; text: string; onPress: () => void; disabled?: boolean }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 60, opacity: disabled ? 0.4 : pressed ? 0.7 : 1 })}>
      <View style={[styles.tileIcon, { backgroundColor: accentTint, width: 44, height: 44, borderRadius: 22 }]}>
        <Ionicons name={icon} size={20} color={c.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.text }}>{title}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: c.textMuted }}>{text}</Text>
      </View>
      <DIcon name="chevR" size={18} strokeWidth={2.2} color={c.textMuted} />
    </Pressable>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  const c = useColors();
  return (
    <View style={{ gap: 1 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: c.text }}>{value}</Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 11, color: c.textMuted }}>{label}</Text>
    </View>
  );
}

function Tile({ icon, value, label }: { icon: IconName; value: string; label: string }) {
  const c = useColors();
  return (
    <View style={[styles.tile, { backgroundColor: c.surface }]}>
      <View style={[styles.tileIcon, { backgroundColor: c.dark ? c.surface2 : '#FFFFFF' }]}>
        <Ionicons name={icon} size={17} color={c.accent} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={[type.name, { color: c.text, fontSize: 15, lineHeight: 20 }]}>{value}</Text>
        <Text numberOfLines={1} style={[type.caption, { color: c.textMuted, letterSpacing: 0, fontSize: 11, lineHeight: 14 }]}>{label}</Text>
      </View>
    </View>
  );
}

function MoreTile({ icon, label, onPress, disabled }: { icon: IconName; label: string; onPress: () => void; disabled?: boolean }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [styles.moreTile, { backgroundColor: c.surface, opacity: disabled ? 0.4 : pressed ? 0.7 : 1 }]}
    >
      <Ionicons name={icon} size={19} color={c.accent} />
      <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40, gap: 14 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  row6: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  map: { height: 140, borderRadius: radius.card, overflow: 'hidden' },
  mapBtn: { position: 'absolute', top: 10, right: 10 },
  mapToggle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  replay: { height: 40, borderRadius: 20, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { width: '48.5%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 16 },
  moreTile: { width: '48.5%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, height: 46, borderRadius: 16 },
  tileIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 20 },
  dashed: { borderWidth: 1.5, borderStyle: 'dashed' },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  swapWrap: { position: 'absolute', left: 0, right: 0, top: '50%', marginTop: -16, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  divider: { position: 'absolute', left: 0, right: 0, top: 15.5, height: 1 },
  pickRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56 },
  pickGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 16, paddingTop: 4, paddingBottom: 8 },
  pickCell: { alignItems: 'center', gap: 6 },
  pickRing: { padding: 2, borderRadius: 40, borderWidth: 3 },
  plusCircle: { borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  takenBadge: { position: 'absolute', right: -2, bottom: -2, width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  swapBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  callBtn: { width: 28, height: 36, alignItems: 'center', justifyContent: 'center' },
  editBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  editCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  svcCard: { padding: 12, borderRadius: 20, gap: 10 },
  bar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
});
