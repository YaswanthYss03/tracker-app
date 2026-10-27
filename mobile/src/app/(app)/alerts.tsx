// Alerts from all my vehicles (last 7 days), opened from the bell on Home.
// Type chips filter the list; new alerts (since the last visit) have a dot.
// Leaving the screen, or ✓✓, marks everything as read.
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '@/components/BottomNav';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { errorText } from '@/api/client';
import { useAlertsFeed, useMarkAlertsSeen, type FeedItem } from '@/lib/alertsSeen';
import { ALERT_ICONS, alertText, timeAgo } from '@/lib/format';
import { Chip, Plate, RoundButton, TopBar } from '@/components/kit';
import { EmptyState, ErrorBox } from '@/components/ui';
import { SkeletonRows } from '@/components/effects';
import { radius, shadow, space, type, useColors, type Palette } from '@/theme';

type Kind = 'all' | 'offline' | 'long_stop' | 'gps_lost' | 'warning';
const KIND_OF: Record<string, Kind> = {
  offline: 'offline', online: 'offline', long_stop: 'long_stop', gps_lost: 'gps_lost',
  overspeed: 'warning', sos: 'warning', power_cut: 'warning', vibration: 'warning', low_battery: 'warning', power_off: 'warning',
};
const CHIPS: { kind: Kind; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { kind: 'all', icon: 'notifications-outline', label: 'All' },
  { kind: 'offline', icon: 'cloud-offline-outline', label: 'Offline' },
  { kind: 'long_stop', icon: 'hourglass-outline', label: 'Long stop' },
  { kind: 'gps_lost', icon: 'locate-outline', label: 'GPS lost' },
  { kind: 'warning', icon: 'warning-outline', label: 'Warnings' },
];

/** Icon tint per alert: good news green, warnings red, stops/GPS marigold, the rest grey. */
function tone(type: string, c: Palette) {
  if (type === 'online' || type === 'ignition_on') return { bg: c.successSoft, fg: c.success };
  if (KIND_OF[type] === 'warning') return { bg: c.dangerSoft, fg: c.danger };
  if (type === 'long_stop' || type === 'gps_lost') return { bg: '#FBEBD0', fg: '#7F4A00' };
  return { bg: c.surface2, fg: c.text };
}

export default function AlertsFeed() {
  const c = useColors();
  const { data, isLoading, error, refetch, isRefetching } = useAlertsFeed();
  const markSeen = useMarkAlertsSeen();
  const [kind, setKind] = useState<Kind>('all');
  // When the user last looked (fixed for this visit, so dots don't vanish while reading).
  const seenAt = useQuery({ queryKey: ['alerts-seen-visit'], queryFn: async () => Number((await SecureStore.getItemAsync('alertsSeenAt')) || 0), gcTime: 0 }).data ?? Date.now();
  const [readAll, setReadAll] = useState(false);
  const markRef = useRef(markSeen);
  markRef.current = markSeen;
  useEffect(() => () => markRef.current(), []);

  const events = useMemo(() => data?.data ?? [], [data]);
  const counts = useMemo(() => {
    const n: Record<Kind, number> = { all: events.length, offline: 0, long_stop: 0, gps_lost: 0, warning: 0 };
    for (const e of events) if (KIND_OF[e.type]) n[KIND_OF[e.type]] += 1;
    return n;
  }, [events]);
  const shown = kind === 'all' ? events : events.filter((e) => KIND_OF[e.type] === kind);
  const isNew = (e: FeedItem) => !readAll && Date.parse(e.time) > seenAt;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar
        title="Alerts"
        onBack={() => router.back()}
        right={
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <RoundButton icon="settings-outline" label="Alert settings" onPress={() => router.push('/account')} size={40} iconSize={18} />
            <RoundButton icon="checkmark-done" label="Mark all as read" onPress={() => { setReadAll(true); markSeen(); }} size={40} iconSize={20} />
          </View>
        }
      />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.xs }}>
          {CHIPS.filter((ch) => ch.kind === 'all' || counts[ch.kind] > 0).map((ch) => (
            <Chip key={ch.kind} icon={ch.icon} label={String(counts[ch.kind])} selected={kind === ch.kind} onPress={() => setKind(ch.kind)} />
          ))}
        </ScrollView>
      </View>
      <ErrorBox error={error ? errorText(error) : null} />
      {isLoading ? (
        <SkeletonRows count={5} style={{ padding: space.lg }} />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ padding: space.lg, paddingTop: space.sm, gap: space.sm, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} />}
          ListEmptyComponent={<EmptyState icon="notifications-off-outline" title="All quiet" text="No alerts in the last 7 days." />}
          renderItem={({ item }) => {
            const t = tone(item.type, c);
            return (
              <Pressable
                onPress={() => router.push(`/device/${item.deviceId}`)}
                accessibilityRole="button"
                accessibilityLabel={`${alertText(item)}, ${item.deviceName}, ${timeAgo(item.time)}${isNew(item) ? ', new' : ''}`}
                style={({ pressed }) => [styles.row, { backgroundColor: c.surface, opacity: pressed ? 0.9 : 1 }, shadow.card]}
              >
                <View style={[styles.icon, { backgroundColor: t.bg }]}>
                  <Ionicons name={(ALERT_ICONS[item.type] || 'notifications-outline') as keyof typeof Ionicons.glyphMap} size={20} color={t.fg} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Text numberOfLines={1} style={[type.name, { color: c.text, fontSize: 15 }]}>{alertText(item)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Plate value={item.deviceName} size={12} color={c.textMuted} />
                    <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>· {timeAgo(item.time)}</Text>
                  </View>
                </View>
                {isNew(item) && <View style={[styles.dot, { backgroundColor: c.danger }]} accessibilityElementsHidden />}
              </Pressable>
            );
          }}
        />
      )}
      <BottomNav active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.card },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
