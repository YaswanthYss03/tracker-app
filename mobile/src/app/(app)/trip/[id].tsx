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
import { DriverAvatar } from '@/components/DriverAvatar';
import { Card, Plate, RoundButton, Stat, TopBar } from '@/components/kit';
import { Scrubber, SpeedChart, usePlayback } from '@/components/tripParts';
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
  const startAddr = useAddress(trip?.start.lat, trip?.start.lon).address;
  const endAddr = useAddress(trip?.end?.lat ?? last?.lat, trip?.end?.lon ?? last?.lon).address;
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
        <View style={[styles.map, { backgroundColor: c.surface2 }]}>
          <AppMap
            initialCenter={coords[0]}
            initialZoom={13}
            route={coords}
            dots={coords.length > 1 ? [
              { id: 'start', ...coords[0], color: brand.marigold },
              { id: 'end', ...coords[coords.length - 1], color: brand.aubergine },
            ] : []}
            markers={at && progress < 1 ? [{ id: 'now', lat: at.lat, lon: at.lon, heading: at.heading, online: true, vehicle: device?.icon }] : []}
            fitTo={coords}
            fitKey={`${id}-${coords.length}`}
          />
        </View>
        <Scrubber
          value={progress}
          onChange={(v) => { setPlaying(false); setProgress(v); }}
          playing={playing}
          onPlay={() => setPlaying(!playing)}
          disabled={points.length < 2}
          label={progress > 0 && progress < 1 && at ? `${timeOnly(at.t)} · ${at.speed ?? 0} km/h` : `${km(trip.distanceKm)} km`}
        />

        {/* From → to */}
        <Card style={{ gap: space.md }}>
          <Stop color={brand.marigold} place={startAddr ? shortAddress(startAddr, 28) : `${trip.start.lat.toFixed(4)}, ${trip.start.lon.toFixed(4)}`} time={timeOnly(trip.startTime)} />
          <View style={[styles.connector, { borderColor: c.border }]} />
          <Stop
            color={brand.aubergine}
            place={trip.inProgress ? 'Still driving' : endAddr ? shortAddress(endAddr, 28) : (trip.end ? `${trip.end.lat.toFixed(4)}, ${trip.end.lon.toFixed(4)}` : '—')}
            time={trip.endTime ? timeOnly(trip.endTime) : 'now'}
          />
        </Card>

        <View style={{ flexDirection: 'row' }}>
          <Stat value={km(trip.distanceKm)} unit="km" label="Distance" />
          <Stat value={duration(trip.durationS)} label="Duration" />
          <Stat value={String(avg)} unit="km/h" label="Average" />
          <Stat value={String(top)} unit="km/h" label="Top" />
        </View>

        <Card style={{ gap: space.sm }}>
          <Text style={[type.fieldLabel, { color: c.text }]}>Speed</Text>
          <SpeedChart points={points.map((p) => [Date.parse(p.t), p.speed ?? 0])} cursor={progress > 0 && progress < 1 ? progress : null} />
        </Card>

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
