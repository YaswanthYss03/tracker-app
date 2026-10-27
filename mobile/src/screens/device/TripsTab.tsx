// Trips (minimal): trips you start by hand with +. Everything the vehicle
// records after you start one goes into it, until you start the next.
// Not named? They are called Trip 1, Trip 2, ...
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import type { TripLog } from '@/api/types';
import { dateTime, duration, km, timeOnly } from '@/lib/format';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DIcon } from '@/components/DesignIcon';
import { Dialog } from '@/components/kit';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';
import type { TabProps } from './types';

export function TripsTab({ device, isOwner }: TabProps) {
  const c = useColors();
  const qc = useQueryClient();
  const [starting, setStarting] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<TripLog | null>(null);

  const logs = useQuery({
    queryKey: ['trip-logs', device.id],
    queryFn: () => api<{ data: TripLog[] }>(`/devices/${device.id}/trip-logs`),
    refetchInterval: 30_000,
  });
  async function startTrip() {
    setBusy(true);
    setError(null);
    try {
      await api(`/devices/${device.id}/trip-logs`, { method: 'POST', body: name.trim() ? { name: name.trim() } : {} });
      await qc.invalidateQueries({ queryKey: ['trip-logs', device.id] });
      setStarting(false);
      setName('');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  const list = logs.data?.data ?? [];
  const current = list[0]?.current ? list[0] : null;
  const muted = { fontFamily: fonts.body, fontSize: 12, lineHeight: 16, color: c.textMuted } as const;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: c.textMuted }}>{list.length ? `${list.length} ${list.length === 1 ? 'trip' : 'trips'}` : ' '}</Text>
        {isOwner && (
          <Pressable onPress={() => { setError(null); setStarting(true); }} accessibilityRole="button" accessibilityLabel="Start a new trip" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
            <DIcon name="plus" size={20} strokeWidth={2.4} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 4 }}
        refreshControl={<RefreshControl refreshing={logs.isRefetching} onRefresh={() => { logs.refetch(); }} colors={[c.text]} />}
      >
        {list.length === 0 ? (
            <Text style={[muted, { textAlign: 'center', paddingVertical: 32 }]}>
              {logs.isLoading ? 'Loading…' : isOwner ? 'No trips yet. Tap + to start one; the vehicle’s data is saved into it until you start the next.' : 'No trips yet.'}
            </Text>
          ) : (
            list.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => router.push(`/trip/${t.id}?deviceId=${device.id}&log=1`)}
                onLongPress={isOwner ? () => setDeleting(t) : undefined}
                accessibilityRole="button"
                accessibilityLabel={`${t.name || `Trip ${t.number}`}, ${km(t.distanceKm)} kilometres`}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 12, marginHorizontal: -12, borderRadius: 16, backgroundColor: pressed ? c.surface : 'transparent' })}
              >
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: c.text, flexShrink: 1 }}>{t.name || `Trip ${t.number}`}</Text>
                    {t.current && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent }} /><Text style={{ fontFamily: fonts.bold, fontSize: 11, color: c.accent }}>Current</Text></View>}
                  </View>
                  <Text numberOfLines={1} style={muted}>{dateTime(t.startedAt)}{t.endedAt ? ` – ${timeOnly(t.endedAt)}` : ' – now'}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 2 }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: c.text }}>{km(t.distanceKm)} km</Text>
                  <Text style={muted}>{duration(t.durationS)}</Text>
                </View>
              </Pressable>
            ))
          )}
        {list.length > 0 && isOwner && <Text style={[muted, { textAlign: 'center', paddingTop: 12 }]}>Touch and hold a trip to delete it.</Text>}
      </ScrollView>

      <Dialog
        visible={starting}
        title="Start a new trip"
        message={current ? `${current.name || `Trip ${current.number}`} ends now. From now on the vehicle’s data is saved to the new trip.` : 'From now on the vehicle’s data is saved to this trip until you start another.'}
        confirm="Start trip"
        onCancel={() => setStarting(false)}
        onConfirm={startTrip}
        busy={busy}
      >
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: c.textMuted }}>Name (optional)</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={`Trip ${list.length + 1}`}
            placeholderTextColor={c.textMuted}
            maxLength={60}
            autoFocus
            style={{ fontFamily: fonts.medium, fontSize: 16, color: c.text, paddingVertical: 8, paddingHorizontal: 0, borderBottomWidth: 1.5, borderBottomColor: c.text }}
          />
          {error ? <Text style={{ fontFamily: fonts.body, fontSize: 12, color: c.danger }}>{error}</Text> : null}
        </View>
      </Dialog>

      <ConfirmDialog
        visible={Boolean(deleting)}
        title="Delete trip"
        message={`Delete ${deleting?.name || `Trip ${deleting?.number}`}? Its data joins the trip before it.`}
        confirmLabel="Delete"
        danger
        onConfirm={async () => {
          await api(`/devices/${device.id}/trip-logs/${deleting!.id}`, { method: 'DELETE' });
          await qc.invalidateQueries({ queryKey: ['trip-logs', device.id] });
        }}
        onClose={() => setDeleting(null)}
      />
    </View>
  );
}
