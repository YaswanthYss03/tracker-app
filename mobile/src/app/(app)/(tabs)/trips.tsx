// Trips: pick a vehicle (or several with Compare), a day and a time window.
// Week bars show km per day; the map replays the route(s) for the window;
// totals (or a comparison table) and the trips list sit underneath.
import { useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueries } from '@tanstack/react-query';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { api } from '@/api/client';
import { plateOrName, type Device, type RoutePoint, type Trip } from '@/api/types';
import { useTrackers } from '@/live/TrackersProvider';
import { duration, km, timeOnly } from '@/lib/format';
import { dmyToIso, isoToDmy, maskDate } from '@/lib/drivers';
import { AppMap, type LatLon, type MapMarker, type MapRoute } from '@/components/Map';
import { Card, Chip, Input, Plate, RoundButton } from '@/components/kit';
import { Scrubber, SpeedGauge, usePlayback } from '@/components/tripParts';
import { EmptyState, Loading } from '@/components/ui';
import { brand } from '@/theme/colors';
import { radius, shadow, space, type, useColors } from '@/theme';
import { DIcon } from '@/components/DesignIcon';
import { useResponsive } from '@/lib/responsive';

const DAY = 86_400_000;
const MAP_SMALL = 230;
const MAP_BIG = 470;
// Route colours when comparing (marigold first: it stays visible on the dark selected chip).
const ROUTE_COLORS = [brand.marigold, '#2E7D4F', '#2F6DB5', '#C8302E', '#7A4FA8', '#2A8C82'];

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
const hhmm = (d = new Date()) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
function maskTime(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}
const validTime = (t: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
/** Last point at or before time t (binary search). */
function pointAt(points: RoutePoint[], t: number) {
  let lo = 0;
  let hi = points.length - 1;
  if (hi < 0 || Date.parse(points[0].t) > t) return null;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (Date.parse(points[mid].t) <= t) lo = mid;
    else hi = mid - 1;
  }
  return points[lo];
}

export default function Trips() {
  const resp = useResponsive();
  const c = useColors();
  const { devices } = useTrackers();
  const sorted = useMemo(() => [...devices].sort((a, b) => plateOrName(a).localeCompare(plateOrName(b))), [devices]);
  const today = localIso(Date.now());

  const [compare, setCompare] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [dateText, setDateText] = useState(isoToDmy(today));
  const [fromText, setFromText] = useState('00:00');
  const [toText, setToText] = useState(hhmm());
  const [big, setBig] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = usePlayback(playing, setPlaying);

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
  const pointsBy = selected.map((id, i) => ({ id, color: ROUTE_COLORS[i % ROUTE_COLORS.length], points: routes[i]?.data?.data.points ?? [] }));
  const times = pointsBy.flatMap((r) => (r.points.length ? [Date.parse(r.points[0].t), Date.parse(r.points[r.points.length - 1].t)] : []));
  const t0 = times.length ? Math.min(...times) : winStart;
  const t1 = times.length ? Math.max(...times) : winEnd;
  const tNow = t0 + progress * (t1 - t0);
  const hasRoute = pointsBy.some((r) => r.points.length > 1);

  useEffect(() => {
    setPlaying(false);
    setProgress(1);
  }, [date, from, to, selected.join(','), setProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  const byId = new Map(devices.map((d) => [d.id, d]));
  const markers: MapMarker[] = pointsBy.flatMap((r) => {
    const p = pointAt(r.points, tNow);
    const d = byId.get(r.id);
    return p && d ? [{ id: r.id, lat: p.lat, lon: p.lon, heading: p.heading, online: true, vehicle: d.icon, label: compare ? shortPlate(d) : undefined }] : [];
  });
  const fit: LatLon[] = pointsBy.flatMap((r) => r.points.map((p) => ({ lat: p.lat, lon: p.lon })));
  const single = !compare && pointsBy[0];
  const mapRoutes: MapRoute[] = compare ? pointsBy.map((r) => ({ id: r.id, color: r.color, points: r.points })) : [];

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
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={styles.header}>
        <Text style={[type.h1, { color: c.text }]}>Replay</Text>
        <Chip label="Compare" icon="git-compare-outline" selected={compare} onPress={() => setCompareMode(!compare)} />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: space.lg, paddingTop: space.xs, gap: space.lg, paddingBottom: 48 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => { trips.forEach((q) => q.refetch()); routes.forEach((q) => q.refetch()); }} />}
        keyboardShouldPersistTaps="handled"
      >
        {/* Vehicles */}
        <View style={styles.chips}>
          {compare && (
            <Chip
              label="All"
              outline
              selected={selected.length === sorted.length}
              onPress={() => setSelected(selected.length === sorted.length ? [sorted[0].id] : sorted.map((d) => d.id))}
            />
          )}
          {sorted.map((d) => {
            const i = selected.indexOf(d.id);
            const on = i >= 0;
            return (
              <Chip
                key={d.id}
                mono
                outline
                label={shortPlate(d)}
                selected={on}
                dot={compare && on ? ROUTE_COLORS[i % ROUTE_COLORS.length] : undefined}
                onPress={() => toggle(d.id)}
              />
            );
          })}
        </View>

        {/* Day and time window */}
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <View style={{ flex: 1.3 }}>
            <Input label="Date" value={dateText} onChangeText={(t) => setDateText(maskDate(t))} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="From" value={fromText} onChangeText={(t) => setFromText(maskTime(t))} placeholder="00:00" keyboardType="number-pad" maxLength={5} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="To" value={toText} onChangeText={(t) => setToText(maskTime(t))} placeholder="23:59" keyboardType="number-pad" maxLength={5} />
          </View>
        </View>

        {/* Week bars */}
        <View style={styles.week} accessibilityLabel="Kilometres per day">
          {week.map((d, i) => {
            const on = d === date;
            const label = d === today ? 'Today' : new Date(`${d}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'narrow' });
            return (
              <Pressable key={d} onPress={() => pickDay(d)} style={styles.dayCol} accessibilityRole="button" accessibilityLabel={`${d}: ${km(perDay[i])} km`} accessibilityState={{ selected: on }}>
                <Text style={[type.caption, { color: c.text, letterSpacing: 0, fontFamily: type.fieldLabel.fontFamily, opacity: on ? 1 : 0 }]}>{Math.round(perDay[i])} km</Text>
                <View style={styles.barBox}>
                  <View style={[styles.bar, { height: 6 + (perDay[i] / maxDay) * 34, backgroundColor: on ? c.accent : c.surface2 }]} />
                </View>
                <Text style={[type.caption, { color: on ? c.text : c.textMuted, letterSpacing: 0, fontFamily: on ? type.fieldLabel.fontFamily : undefined }]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Map + playback */}
        <Animated.View style={[styles.map, { backgroundColor: c.surface2 }, mapStyle]}>
          <AppMap
            initialCenter={fit[0]}
            initialZoom={12}
            route={single ? single.points : []}
            routes={mapRoutes}
            dots={single && single.points.length > 1 ? [
              { id: 'start', ...single.points[0], color: brand.marigold },
              { id: 'end', ...single.points[single.points.length - 1], color: brand.aubergine },
            ] : []}
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
        />

        {/* Totals, or the comparison table */}
        {loading ? (
          <Loading />
        ) : compare ? (
          <Card padded={false}>
            <View style={[styles.tr, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}>
              <Text style={[styles.th, styles.thFirst, type.caption, { color: c.textMuted }]}>Vehicle</Text>
              {['km', 'Hrs', 'Top', 'Avg'].map((hd) => <Text key={hd} style={[styles.th, type.caption, { color: c.textMuted }]}>{hd}</Text>)}
            </View>
            {selected.map((id, i) => {
              const d = byId.get(id);
              const s = stats(windowTrips.filter((t) => t.deviceId === id));
              return d ? (
                <View key={id} style={styles.tr}>
                  <View style={[styles.thFirst, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                    <View style={[styles.dot, { backgroundColor: ROUTE_COLORS[i % ROUTE_COLORS.length] }]} />
                    <Plate value={shortPlate(d)} size={13} />
                  </View>
                  {[km(s.km), String(s.hours), String(s.top), String(s.avg)].map((v, j) => (
                    <Text key={j} style={[styles.th, type.bodyStrong, { color: c.text }]}>{v}</Text>
                  ))}
                </View>
              ) : null;
            })}
          </Card>
        ) : (
          <View style={styles.totals}>
            <View style={styles.statCol}>
              <TotalStat value={`${km(total.km)} km`} label="Distance" />
              <TotalStat value={duration(total.driveS)} label="Driving" />
            </View>
            {/* Needle = speed at the playback position (like a replayed speedometer). */}
            <SpeedGauge size={resp.tiny ? 108 : resp.small ? 122 : 140} value={playSpeed} caption={playSpeed != null ? `km/h · ${new Date(tNow).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` : undefined} />
            <View style={[styles.statCol, { alignItems: 'flex-end' }]}>
              <TotalStat value={`${total.top} km/h`} label="Top speed" right />
              <TotalStat value={total.avg ? `${total.avg} km/h` : '—'} label="Avg speed" right />
            </View>
          </View>
        )}

        {/* Trips in the window */}
        <Text style={[type.fieldLabel, { color: c.textMuted }]}>{windowTrips.length} {windowTrips.length === 1 ? 'TRIP' : 'TRIPS'}</Text>
        {windowTrips.map((t) => {
          const d = byId.get(t.deviceId);
          const i = selected.indexOf(t.deviceId);
          return (
            <Card key={t.id} onPress={() => router.push(`/trip/${t.id}?deviceId=${t.deviceId}`)} style={styles.tripRow}>
              {compare && <View style={[styles.dot, { backgroundColor: ROUTE_COLORS[i % ROUTE_COLORS.length] }]} />}
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
      </ScrollView>
    </SafeAreaView>
  );
}

function TotalStat({ value, label, right }: { value: string; label: string; right?: boolean }) {
  const c = useColors();
  return (
    <View style={{ gap: 1, alignItems: right ? 'flex-end' : 'flex-start' }}>
      <Text numberOfLines={1} style={[type.name, { color: c.text, fontSize: 18, lineHeight: 24 }]}>{value}</Text>
      <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0, fontSize: 12 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 4, flex: 1 },
  barBox: { height: 42, justifyContent: 'flex-end' },
  bar: { width: 26, borderRadius: 8 },
  map: { borderRadius: radius.card, overflow: 'hidden' },
  mapBtn: { position: 'absolute', top: 12, right: 12 },
  noRoute: { position: 'absolute', alignSelf: 'center', top: '42%', paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill },
  totals: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 4 },
  statCol: { flex: 1, minWidth: 0, gap: 16 },
  tr: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, minHeight: 44 },
  th: { flex: 1, textAlign: 'right', letterSpacing: 0 },
  thFirst: { flex: 2, textAlign: 'left' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
});
