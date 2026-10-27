// One trip: route with playback, from → to (addresses and times), distance,
// duration, average and top speed, a speed chart and the driver.
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { plateOrName, type Device, type RoutePoint, type Trip } from '@/api/types';
import { shortAddress, useAddress } from '@/lib/address';
import { duration, km, timeOnly } from '@/lib/format';
import { AppMap } from '@/components/Map';
import { ExpandableMap } from '@/components/ExpandableMap';
import { DriverAvatar } from '@/components/DriverAvatar';
import { Card, Plate, RoundButton, Stat, TopBar } from '@/components/kit';
import { ReplayTotals, Scrubber, SpeedChart, usePlayback } from '@/components/tripParts';
import { ROUTE_RED, endDots } from '@/lib/replay';
import { fonts } from '@/theme';
import { useResponsive } from '@/lib/responsive';
import { ErrorBox, Loading } from '@/components/ui';
import { brand } from '@/theme/colors';
import { radius, space, type, useColors } from '@/theme';

function dayName(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date(Date.now() - 86_400_000);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function TripScreen() {
  const c = useColors();
  const resp = useResponsive();
  const { id, deviceId, log } = useLocalSearchParams<{ id: string; deviceId: string; log?: string }>();
  const route = log ? 'trip-logs' : 'trips'; // hand-started trips have their own route
  const device = useQuery({ queryKey: ['device', deviceId], queryFn: () => api<{ data: Device }>(`/devices/${deviceId}`) }).data?.data;
  const q = useQuery({
    queryKey: ['trip-route', route, deviceId, id],
    queryFn: () => api<{ data: { trip: Trip; points: RoutePoint[] } }>(`/devices/${deviceId}/${route}/${id}/route?maxPoints=1500`),
  });
  const trip = q.data?.data.trip;
  const points = q.data?.data.points ?? [];
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = usePlayback(playing, setPlaying, 10_000);

  const first = points[0];
  const last = points[points.length - 1];
  const t0 = first ? Date.parse(first.t) : 0;
  const t1 = last ? Date.parse(last.t) : 1;
  const tNow = t0 + progress * (t1 - t0);
  const idx = points.length ? Math.max(0, points.findIndex((p) => Date.parse(p.t) > tNow) - 1) : 0;
  const at = progress >= 1 ? last : points[idx === -1 ? points.length - 1 : idx];
  const hasData = points.length > 0;
  const startAddr = useAddress(hasData ? trip?.start.lat : null, hasData ? trip?.start.lon : null).address;
  const endAddr = useAddress(hasData ? trip?.end?.lat ?? last?.lat : null, hasData ? trip?.end?.lon ?? last?.lon : null).address;
  const driver = device?.mainDriver ?? null;

  if (q.isLoading) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}><Loading /></SafeAreaView>;
  if (!trip) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
        <TopBar title="Trip" onBack={() => router.back()} />
        <ErrorBox error={q.error ? errorText(q.error) : 'Trip not found'} />
      </SafeAreaView>
    );
  }

  const coords = points.map((p) => ({ lat: p.lat, lon: p.lon }));
  const driveH = Math.max(0, trip.durationS - trip.idleS) / 3600;
  const top = Math.max(trip.maxSpeed, ...points.map((p) => p.speed ?? 0));
  // GPS jitter can push distance/time above the real top speed; never show avg > top.
  const avg = Math.min(top, trip.avgSpeed || (driveH > 0.01 ? Math.round(trip.distanceKm / driveH) : 0));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar
        onBack={() => router.back()}
        title={
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            {device && <Plate value={plateOrName(device)} size={18} />}
            <Text style={[type.small, { color: c.textMuted }]}>· {dayName(trip.startTime)}</Text>
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: space.xs, gap: space.lg, paddingBottom: 48 }}>
        <ExpandableMap height={230}>
          <AppMap
            initialCenter={coords[0]}
            initialZoom={13}
            routes={coords.length > 1 ? [{ id: 'trip', color: ROUTE_RED, points: coords }] : []}
            dots={endDots(coords, 'trip')}
            markers={at ? [{ id: 'now', lat: at.lat, lon: at.lon, dot: ROUTE_RED, variant: 'replay' }] : []}
            fitTo={coords}
            fitKey={`${id}-${coords.length}`}
          />
        </ExpandableMap>
        <Scrubber
          value={progress}
          onChange={(v) => { setPlaying(false); setProgress(v); }}
          playing={playing}
          onPlay={() => setPlaying(!playing)}
          disabled={points.length < 2}
          label={progress > 0 && progress < 1 && at ? timeOnly(at.t) : undefined}
        />

        {!hasData && (
          <Text style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: c.textMuted, textAlign: 'center' }}>
            {trip.inProgress
              ? 'Nothing recorded in this trip yet. Everything the vehicle records from now on is saved here until the next trip is started.'
              : 'Nothing was recorded in this trip.'}
          </Text>
        )}

        <ReplayTotals
          distanceKm={km(trip.distanceKm)}
          driveText={duration(Math.max(0, trip.durationS - trip.idleS))}
          top={top}
          avg={avg}
          playSpeed={progress > 0 && progress < 1 && at ? at.speed ?? 0 : null}
          size={resp.tiny ? 108 : resp.small ? 122 : 140}
          caption={progress > 0 && progress < 1 && at ? `km/h · ${timeOnly(at.t)}` : undefined}
        />

        {hasData && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>Speed (km/h)</Text>
            <SpeedChart points={points.map((p) => [Date.parse(p.t), p.speed ?? 0] as [number, number])} cursor={progress > 0 && progress < 1 ? progress : null} height={130} />
          </View>
        )}

        {/* From → to */}
        <View style={{ gap: space.md }}>
          <Stop color={ROUTE_RED} place={!hasData ? 'Waiting for the first position' : startAddr ? shortAddress(startAddr, 28) : `${trip.start.lat.toFixed(4)}, ${trip.start.lon.toFixed(4)}`} time={timeOnly(trip.startTime)} />
          <View style={[styles.connector, { borderColor: c.border }]} />
          <Stop
            color="#202020"
            place={trip.inProgress ? (hasData ? 'Still going' : '—') : endAddr ? shortAddress(endAddr, 28) : (trip.end ? `${trip.end.lat.toFixed(4)}, ${trip.end.lon.toFixed(4)}` : '—')}
            time={trip.endTime ? timeOnly(trip.endTime) : 'now'}
          />
        </View>

        {driver && (
          <Card style={styles.driver} onPress={() => router.push(`/drivers/edit?id=${driver.id}`)}>
            <DriverAvatar driver={driver} size={48} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={[type.name, { color: c.text }]}>{driver.name}</Text>
              <Text style={[type.small, { color: c.textMuted }]}>Main driver</Text>
            </View>
            {driver.phone && (
              <RoundButton icon="call-outline" label={`Call ${driver.name}`} onPress={() => Linking.openURL(`tel:${driver.phone!.replace(/[^+\d]/g, '')}`)} size={44} iconSize={20} />
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stop({ color, place, time }: { color: string; place: string; time: string }) {
  const c = useColors();
  return (
    <View style={styles.stop}>
      <View style={[styles.stopDot, { backgroundColor: color, borderColor: c.surface }]} />
      <Text numberOfLines={1} ellipsizeMode="tail" style={[type.bodyStrong, { color: c.text, flex: 1, minWidth: 0 }]}>{place}</Text>
      <Text style={[type.small, { color: c.textMuted }]}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 260, borderRadius: radius.card, overflow: 'hidden' },
  stop: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  stopDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
  connector: { marginLeft: 6, height: 14, marginVertical: -space.sm, borderLeftWidth: 2, borderStyle: 'dashed' },
  driver: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
