// Home: one card per tracker with live status and one-tap actions
// (Live, History, Trips, Share), so most things are a single tap away.
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { VehicleBadge } from '@/components/VehicleArt';
import { errorText } from '@/api/client';
import { deviceName, type Device, type Live } from '@/api/types';
import { useTrackers } from '@/live/TrackersProvider';
import { timeAgo } from '@/lib/format';
import { shareLiveLocation } from '@/lib/share';
import { AppText, Button, EmptyState, ErrorBox, Pill, Row } from '@/components/ui';
import { GlowSweep, SkeletonRows } from '@/components/effects';
import { radius, space, type, useColors } from '@/theme';

export default function Home() {
  const c = useColors();
  const { devices, stateOf, isLoading, isRefetching, error, refetch } = useTrackers();
  const online = devices.filter((d) => stateOf(d).online).length;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={styles.header}>
        <Text maxFontSizeMultiplier={1} style={[type.wordmark, { fontSize: 34, lineHeight: 48, color: c.text }]}>Pavakie</Text>
        {devices.length > 0 && (
          <AppText variant="small" color="textMuted">{online} of {devices.length} online</AppText>
        )}
      </View>
      <ErrorBox error={error ? errorText(error) : null} />
      {isLoading ? (
        <SkeletonRows count={3} style={{ padding: space.lg }} />
      ) : devices.length === 0 ? (
        <EmptyState
          icon="car-sport-outline"
          title="No trackers yet"
          text="Add your tracker with the IMEI and activation code printed on the box."
          action={<Button title="Add tracker" icon="add" onPress={() => router.push('/add-tracker')} />}
        />
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: space.lg, paddingTop: space.sm, gap: space.md }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          renderItem={({ item }) => <TrackerCard device={item} state={stateOf(item)} />}
        />
      )}
    </SafeAreaView>
  );
}

function TrackerCard({ device, state }: { device: Device; state: Live }) {
  const c = useColors();
  const [sharing, setSharing] = useState(false);
  const open = (tab?: string) => router.push(tab ? `/device/${device.id}?tab=${tab}` : `/device/${device.id}`);

  async function share() {
    setSharing(true);
    await shareLiveLocation(device).catch(() => {});
    setSharing(false);
  }

  const actions: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }[] = [
    { label: 'Live', icon: 'locate-outline', onPress: () => open('live') },
    { label: 'History', icon: 'time-outline', onPress: () => open('history') },
    { label: 'Trips', icon: 'git-commit-outline', onPress: () => open('trips') },
    device.role === 'owner'
      ? { label: sharing ? 'Sharing…' : 'Share', icon: 'share-social-outline', onPress: share }
      : { label: 'Alerts', icon: 'notifications-outline', onPress: () => open('alerts') },
  ];

  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      {state.online && <GlowSweep />}
      <Pressable onPress={() => open()} style={({ pressed }) => [styles.top, { opacity: pressed ? 0.8 : 1 }]}>
        <VehicleBadge type={device.icon} online={state.online} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="h2" numberOfLines={1}>{deviceName(device)}</AppText>
          <AppText variant="small" color="textMuted">Updated {timeAgo(state.lastSeenAt)}</AppText>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <AppText variant="display">{state.speed ?? 0}</AppText>
          <AppText variant="label" color="textMuted">KM/H</AppText>
        </View>
      </Pressable>
      <Row gap={6}>
        <Pill label={state.online ? 'Online' : state.lastSeenAt ? 'Offline' : 'Never connected'} tone={state.online ? 'ok' : 'offline'} />
        {state.ignition ? <Pill label="Ignition on" tone="accent" /> : null}
        {device.role === 'viewer' ? <Pill label="Shared with you" /> : null}
      </Row>
      <View style={[styles.actions, { borderTopColor: c.border }]}>
        {actions.map((a) => (
          <Pressable
            key={a.label}
            onPress={a.onPress}
            accessibilityRole="button"
            accessibilityLabel={`${a.label} — ${deviceName(device)}`}
            style={({ pressed }) => [styles.action, { backgroundColor: pressed ? c.surface2 : 'transparent' }]}
          >
            <Ionicons name={a.icon} size={22} color={c.text} />
            <AppText variant="caption">{a.label}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingTop: space.xs },
  card: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, padding: space.lg, paddingBottom: space.xs, gap: space.md, overflow: 'hidden' },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  actions: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, marginHorizontal: -space.sm, paddingTop: space.xs },
  action: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: space.sm, borderRadius: radius.sm },
});
