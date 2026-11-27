// Trips: pick a vehicle (or several with Compare), a day and a time window.
// Week bars show km per day; the map replays the route(s) for the window;
// totals (or a comparison table) and the trips list sit underneath.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { LockableScrollView } from '@/components/LockableScrollView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueries } from '@tanstack/react-query';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { api } from '@/api/client';
import { plateOrName, type Device, type RoutePoint, type Trip } from '@/api/types';
import { useTrackers } from '@/live/TrackersProvider';
import { duration, km, timeOnly } from '@/lib/format';
import { dmyToIso, isoToDmy } from '@/lib/drivers';
import { hhmm, pointAt, stopDots, validTime } from '@/lib/replay';
import { ReplayFields } from '@/components/ReplayFields';
import { AppMap, type LatLon, type MapMarker, type MapRoute } from '@/components/Map';
import { Card, Plate } from '@/components/kit';
import { ReplayTotals, Scrubber, SpeedChart, usePlayback, useReplaySpeed } from '@/components/tripParts';
import { EmptyState, Loading } from '@/components/ui';
import { fonts, radius, shadow, space, type, useColors } from '@/theme';
import { useHomeColors } from '@/theme/designHome';
import { plateTail } from '@/lib/drivers';
import { STATUS_RING, statusGroup } from '@/lib/vehicleStatus';
import { DIcon } from '@/components/DesignIcon';
import { useResponsive } from '@/lib/responsive';

const DAY = 86_400_000;
const MAP_SMALL = 230;
const MAP_BIG = 470;
// One colour per vehicle (by its place in the list): red, blue, green, amber, purple, teal.
const ROUTE_COLORS = ['#D93636', '#2F64A8', '#1F8A55', '#C27400', '#7A4FA8', '#2A8C82'];
const PAGE = '#F2F2F2'; // this page: grey, with white controls

type WithVehicle = Trip & { deviceId: string };

/** "TN 38 BX 4521" -> "BX 4521" */
export function shortPlate(d: Pick<Device, 'registrationNumber' | 'name' | 'imei'>) {
  const parts = (d.registrationNumber ?? '').split(' ');
  return parts.length >= 3 ? parts.slice(-2).join(' ') : plateOrName(d as Device);
}
const localIso = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function Trips() {
  const resp = useResponsive();
  const c = useColors();
  const hc = useHomeColors();
  const page = hc.dark ? c.bg : PAGE;
  const white = hc.dark ? c.surface : '#FFFFFF';
  const { devices, stateOf } = useTrackers();
  const sorted = useMemo(() => [...devices].sort((a, b) => plateOrName(a).localeCompare(plateOrName(b))), [devices]);
  const colorOf = (id: string) => ROUTE_COLORS[Math.max(0, sorted.findIndex((d) => d.id === id)) % ROUTE_COLORS.length];
  const today = localIso(Date.now());

  const [compare, setCompare] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [dateText, setDateText] = useState(isoToDmy(today));
  const [fromText, setFromText] = useState('00:00');
  const [toText, setToText] = useState(hhmm());
  const [big, setBig] = useState(false);
  const [playing, setPlaying] = useState(false);
  const span = useRef(0);
  const [speed, setSpeed] = useReplaySpeed();
  const [progress, setProgress] = usePlayback(playing, setPlaying, span, speed);

  // Start with the first vehicle.
  useEffect(() => {
    if (!selected.length && sorted.length) setSelected([sorted[0].id]);
  }, [sorted, selected.length]);

  const parsed = dmyToIso(dateText);
  const date = parsed && parsed !== 'invalid' && parsed <= today ? parsed : today;
  const from = validTime(fromText) ? fromText : '00:00';
  const to = validTime(toText) ? toText : date === today ? hhmm() : '23:59';
  const winStart = new Date(`${date}T${from}:00`).getTime();
  const winEnd = new Date(`${date}T${to}:59`).getTime();
  // Week bars: the 7 days ending today (or ending at the chosen day if it's older).
  const anchor = Date.parse(`${today}T12:00:00`) - Date.parse(`${date}T12:00:00`) < 7 * DAY ? today : date;
  const week = Array.from({ length: 7 }, (_, i) => localIso(Date.parse(`${anchor}T12:00:00`) - (6 - i) * DAY));
  const weekStart = new Date(`${week[0]}T00:00:00`).toISOString();
  const weekEnd = new Date(`${anchor}T23:59:59`).toISOString();

  const trips = useQueries({
    queries: selected.map((id) => ({
      queryKey: ['trips-week', id, anchor],
      queryFn: () => api<{ data: Trip[] }>(`/devices/${id}/trips?from=${encodeURIComponent(weekStart)}&to=${encodeURIComponent(weekEnd)}`),
    })),
  });
  const routes = useQueries({
    queries: selected.map((id) => ({
      queryKey: ['positions-window', id, winStart, winEnd],
      queryFn: () => api<{ data: { points: RoutePoint[] } }>(
        `/devices/${id}/positions?from=${encodeURIComponent(new Date(winStart).toISOString())}&to=${encodeURIComponent(new Date(Math.min(winEnd, Date.now())).toISOString())}&maxPoints=1500`,
      ),
      enabled: winEnd > winStart,
    })),
  });

  const loading = trips.some((q) => q.isLoading) || routes.some((q) => q.isLoading);
  const allTrips: WithVehicle[] = selected.flatMap((id, i) => (trips[i]?.data?.data ?? []).map((t) => ({ ...t, deviceId: id })));
  const perDay = week.map((d) => allTrips.filter((t) => localIso(Date.parse(t.startTime)) === d).reduce((a, t) => a + t.distanceKm, 0));
  const maxDay = Math.max(1, ...perDay);
  const windowTrips = allTrips
    .filter((t) => Date.parse(t.startTime) >= winStart && Date.parse(t.startTime) <= winEnd)
    .sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime));

  // Playback runs over the time covered by the routes.
  const pointsBy = selected.map((id, i) => ({ id, color: colorOf(id), points: routes[i]?.data?.data.points ?? [] }));
  const times = pointsBy.flatMap((r) => (r.points.length ? [Date.parse(r.points[0].t), Date.parse(r.points[r.points.length - 1].t)] : []));
  const t0 = times.length ? Math.min(...times) : winStart;
  const t1 = times.length ? Math.max(...times) : winEnd;
  span.current = t1 - t0;
  const tNow = t0 + progress * (t1 - t0);
  const hasRoute = pointsBy.some((r) => r.points.length > 1);

  useEffect(() => {
    setPlaying(false);
    setProgress(1);
  }, [date, from, to, selected.join(','), setProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  const byId = new Map(devices.map((d) => [d.id, d]));
  // Current position: a coloured dot (with the plate tag when comparing).
  const markers: MapMarker[] = pointsBy.flatMap((r) => {
    const p = pointAt(r.points, tNow);
    const d = byId.get(r.id);
    return p && d ? [{ id: r.id, lat: p.lat, lon: p.lon, dot: compare ? r.color : ROUTE_COLORS[0], variant: 'replay' as const, label: compare ? plateTail(d.registrationNumber, d.name) : undefined }] : [];
  });
  const fit: LatLon[] = pointsBy.flatMap((r) => r.points.map((p) => ({ lat: p.lat, lon: p.lon })));
  // Where each vehicle stood still along the way (tap one for the details); the one the replay is at stays open.
  const stopMarks = pointsBy.flatMap((r) => stopDots(r.points, r.id, progress > 0 && progress < 1 ? tNow : null, compare && byId.get(r.id) ? plateOrName(byId.get(r.id) as Device) : null));
  const mapRoutes: MapRoute[] = pointsBy.map((r) => ({ id: r.id, color: compare ? r.color : ROUTE_COLORS[0], points: r.points }));
  // White dots where each trip started and ended.
  const tripDots = windowTrips.slice(0, 40).flatMap((tr) => [
    { id: `${tr.id}-s`, lat: tr.start.lat, lon: tr.start.lon, color: '#FFFFFF', hollow: true },
    ...(tr.end ? [{ id: `${tr.id}-e`, lat: tr.end.lat, lon: tr.end.lon, color: '#FFFFFF', hollow: true }] : []),
  ]);

  const h = useSharedValue(MAP_SMALL);
  useEffect(() => {
    h.value = withTiming(big ? MAP_BIG : MAP_SMALL, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, [big, h]);
  const mapStyle = useAnimatedStyle(() => ({ height: h.value }));

  function toggle(id: string) {
    if (!compare) return setSelected([id]);
    setSelected(selected.includes(id) ? (selected.length > 1 ? selected.filter((x) => x !== id) : selected) : [...selected, id]);
  }
  function setCompareMode(on: boolean) {
    setCompare(on);
    if (!on) setSelected(selected.slice(0, 1));
  }
  function pickDay(d: string) {
    setDateText(isoToDmy(d));
    setFromText('00:00');
    setToText(d === today ? hhmm() : '23:59');
  }

  const stats = (list: WithVehicle[]) => {
    const dist = list.reduce((a, t) => a + t.distanceKm, 0);
    const driveS = list.reduce((a, t) => a + Math.max(0, t.durationS - t.idleS), 0);
    const top = list.reduce((a, t) => Math.max(a, t.maxSpeed), 0);
    return {
      km: Math.round(dist * 10) / 10,
      driveS,
      hours: Math.round((driveS / 3600) * 10) / 10,
      top,
      // GPS jitter can push distance/time above the real top speed; never show avg > top.
      avg: driveS > 60 ? Math.min(top, Math.round(dist / (driveS / 3600))) : 0,
    };
  };
  const total = stats(windowTrips);
  const dial = resp.tiny ? 108 : resp.small ? 122 : 140;
  const playing0 = progress > 0 && progress < 1;
  const playSpeed = !compare && playing0 && pointsBy[0] ? pointAt(pointsBy[0].points, tNow)?.speed ?? 0 : null;

  if (!devices.length) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg, justifyContent: 'center' }}>
        <EmptyState icon="git-branch-outline" title="No vehicles yet" text="Trips appear here once a vehicle is added and drives." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: page }}>
      <View style={styles.header}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.5, color: c.text }}>Replay</Text>
        <Pressable
          onPress={() => setCompareMode(!compare)}
          accessibilityRole="button"
          accessibilityState={{ selected: compare }}
          style={[styles.compareBtn, { backgroundColor: compare ? c.accent : white }]}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: compare ? '#FFFFFF' : c.text }}>Compare</Text>
        </Pressable>
      </View>
      <LockableScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, gap: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => { trips.forEach((q) => q.refetch()); routes.forEach((q) => q.refetch()); }} />}
        keyboardShouldPersistTaps="handled"
      >
        {/* Vehicles: the dot is the vehicle's status, or its route colour when comparing */}
        <View style={styles.chips}>
          {compare && (
            <VChip label="All" selected={selected.length === sorted.length} white={white} onPress={() => setSelected(selected.length === sorted.length ? [sorted[0].id] : sorted.map((d) => d.id))} />
          )}
          {sorted.map((d) => {
            const g = statusGroup(stateOf(d));
            return (
              <VChip
                key={d.id}
                plate={shortPlate(d)}
                dot={compare ? colorOf(d.id) : STATUS_RING[g]}
                selected={selected.includes(d.id)}
                white={white}
                onPress={() => toggle(d.id)}
              />
            );
          })}
        </View>

        {/* Day and time window: tap a field for the calendar / time picker */}
        <ReplayFields date={date} from={from} to={to} max={today} onDate={pickDay} onFrom={setFromText} onTo={setToText} />

        {/* Week bars */}
        <View style={styles.week} accessibilityLabel="Kilometres per day">
          {week.map((d, i) => {
            const on = d === date;
            const label = d === today ? 'Today' : new Date(`${d}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'narrow' });
            return (
              <Pressable key={d} onPress={() => pickDay(d)} style={styles.dayCol} accessibilityRole="button" accessibilityLabel={`${d}: ${km(perDay[i])} km`} accessibilityState={{ selected: on }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.text, opacity: on ? 1 : 0 }}>{Math.round(perDay[i])} km</Text>
                <View style={styles.barBox}>
                  <View style={[styles.bar, { height: perDay[i] > 0 ? 10 + (perDay[i] / maxDay) * 32 : 4, backgroundColor: on ? c.accent : hc.dark ? c.surface2 : '#E2E2E2' }]} />
                </View>
                <Text style={{ fontFamily: on ? fonts.bold : fonts.medium, fontSize: 13, color: on ? c.text : c.textMuted }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Map + playback */}
        <Animated.View style={[styles.map, { backgroundColor: c.surface2 }, mapStyle]}>
          <AppMap
            initialCenter={fit[0]}
            initialZoom={12}
            routes={mapRoutes}
            dots={[...tripDots, ...stopMarks]}
            markers={markers}
            showLabels={compare}
            fitTo={fit}
            fitKey={`${selected.join(',')}-${winStart}-${winEnd}-${fit.length > 0}`}
          />
          <View style={styles.mapBtn}>
            <Pressable onPress={() => setBig(!big)} accessibilityRole="button" accessibilityLabel={big ? 'Smaller map' : 'Bigger map'} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 3 }}>
              <DIcon name={big ? 'shrink' : 'expand'} size={16} strokeWidth={2.2} color="#202020" />
            </Pressable>
          </View>
          {!loading && !hasRoute && (
            <View style={[styles.noRoute, { backgroundColor: c.surface }, shadow.card]}>
              <Text style={[type.small, { color: c.text }]}>No driving in this time window</Text>
            </View>
          )}
        </Animated.View>
        <Scrubber
          value={progress}
          onChange={(v) => { setPlaying(false); setProgress(v); }}
          playing={playing}
          onPlay={() => setPlaying(!playing)}
          disabled={!hasRoute}
          label={hasRoute ? new Date(tNow).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : undefined}
          speed={speed}
          onSpeed={setSpeed}
        />

        {/* Totals, or the comparison table */}
        {loading ? (
          <Loading />
        ) : compare ? (
          <View>
            <View style={[styles.tr, { borderBottomWidth: 1, borderBottomColor: c.border, minHeight: 36 }]}>
              <Text style={[styles.thFirst, styles.thText, { color: c.text }]}>Vehicle</Text>
              {['km', 'Hrs', 'Top km/h', 'Avg km/h'].map((hd, j) => <Text key={hd} style={[styles.th, styles.thText, { color: c.text, flex: j < 2 ? 0.8 : 1.3 }]}>{hd}</Text>)}
            </View>
            {selected.map((id) => {
              const d = byId.get(id);
              const s = stats(windowTrips.filter((x) => x.deviceId === id));
              return d ? (
                <View key={id} style={[styles.tr, { minHeight: 48 }]}>
                  <View style={[styles.thFirst, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                    <View style={[styles.dot, { backgroundColor: colorOf(id) }]} />
                    <Text numberOfLines={1} style={{ fontFamily: fonts.mono, fontSize: 14, color: c.text }}>{shortPlate(d)}</Text>
                  </View>
                  {[km(s.km), String(s.hours), String(s.top), String(s.avg)].map((v, j) => (
                    <Text key={j} style={[styles.th, { flex: j < 2 ? 0.8 : 1.3, fontFamily: j === 0 ? fonts.bold : fonts.body, fontSize: 15, color: c.text }]}>{v}</Text>
                  ))}
                </View>
              ) : null;
            })}
          </View>
        ) : (
          <ReplayTotals
            distanceKm={km(total.km)}
            driveText={duration(total.driveS)}
            top={total.top}
            avg={total.avg}
            playSpeed={playSpeed}
            size={dial}
            caption={playSpeed != null ? `km/h · ${new Date(tNow).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` : undefined}
          />
        )}

        {/* Speed across the replay: one line, or one coloured line per vehicle when comparing */}
        {hasRoute && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>Speed (km/h)</Text>
            <SpeedChart
              series={pointsBy.filter((r) => r.points.length > 1).map((r) => ({ color: compare ? r.color : ROUTE_COLORS[0], points: r.points.map((p) => [Date.parse(p.t), p.speed ?? 0] as [number, number]) }))}
              cursor={progress > 0 && progress < 1 ? progress : null}
              height={130}
            />
          </View>
        )}

        {/* Trips in the window */}
        <Text style={[type.fieldLabel, { color: c.textMuted }]}>{windowTrips.length} {windowTrips.length === 1 ? 'TRIP' : 'TRIPS'}</Text>
        {windowTrips.map((t) => {
          const d = byId.get(t.deviceId);
          return (
            <Card key={t.id} onPress={() => router.push(`/trip/${t.id}?deviceId=${t.deviceId}`)} style={[styles.tripRow, { backgroundColor: white }]}>
              {compare && <View style={[styles.dot, { backgroundColor: colorOf(t.deviceId) }]} />}
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                {d && <Plate value={plateOrName(d)} size={15} />}
                <Text style={[type.small, { color: c.textMuted }]}>
                  {timeOnly(t.startTime)} – {t.endTime ? timeOnly(t.endTime) : 'now'} · {t.inProgress ? 'In progress' : duration(t.durationS)}
                </Text>
              </View>
              <Text>
                <Text style={[type.h3, { color: c.text }]}>{km(t.distanceKm)}</Text>
                <Text style={[type.caption, { color: c.textMuted }]}> km</Text>
              </Text>
              <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
            </Card>
          );
        })}
      </LockableScrollView>
    </SafeAreaView>
  );
}

/** Vehicle pill: white (dark when selected). All shows no dot; vehicles show a dot and the plate. */
function VChip({ label, plate, dot, selected, white, onPress }: { label?: string; plate?: string; dot?: string; selected: boolean; white: string; onPress: () => void }) {
  const c = useColors();
  const fg = selected ? '#FFFFFF' : c.text;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.vchip, { backgroundColor: selected ? '#202020' : white }]}>
      {dot ? <View style={[styles.dot8, { backgroundColor: dot }]} /> : null}
      <Text maxFontSizeMultiplier={1.2} style={plate ? { fontFamily: fonts.mono, fontSize: 14, color: fg } : { fontFamily: fonts.bold, fontSize: 14, color: fg }}>{plate ?? label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  compareBtn: { height: 40, paddingHorizontal: 22, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vchip: { height: 40, paddingHorizontal: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot8: { width: 8, height: 8, borderRadius: 4 },
  field: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14 },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 6, flex: 1 },
  barBox: { height: 42, justifyContent: 'flex-end' },
  bar: { width: 30, borderRadius: 9 },
  map: { borderRadius: 22, overflow: 'hidden' },
  mapBtn: { position: 'absolute', top: 12, right: 12 },
  noRoute: { position: 'absolute', alignSelf: 'center', top: '42%', paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill },
  totals: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2 },
  sideCol: { flex: 1, minWidth: 0, gap: 14, justifyContent: 'center' },
  tr: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  th: { textAlign: 'right' },
  thText: { fontFamily: fonts.medium, fontSize: 12 },
  thFirst: { flex: 1.5, textAlign: 'left' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
});
