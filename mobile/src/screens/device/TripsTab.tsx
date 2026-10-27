// Trips (minimal). "Logged" = trips you start by hand with +: everything the
// vehicle records after you start one goes into it, until you start the next.
// "Auto" = trips the tracker detected on its own (ignition on, moving).
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import type { Trip, TripLog } from '@/api/types';
import { dateTime, duration, km, timeOnly } from '@/lib/format';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DIcon } from '@/components/DesignIcon';
import { MiniTabs } from '@/components/MiniTabs';
import { Dialog, Input } from '@/components/kit';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';
import type { TabProps } from './types';

type Mode = 'logged' | 'auto';
type Period = '1' | '7' | '30';

export function TripsTab({ device, isOwner }: TabProps) {
  const c = useColors();
  const qc = useQueryClient();
  const [mode, setMode] = useState<Mode>('logged');
  const [period, setPeriod] = useState<Period>('7');
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
  const from = useMemo(() => new Date(Date.now() - Number(period) * 86_400_000).toISOString(), [period]);
  const auto = useQuery({
    queryKey: ['trips', device.id, period],
    enabled: mode === 'auto',
    queryFn: () => api<{ data: Trip[] }>(`/devices/${device.id}/trips?from=${encodeURIComponent(from)}`),
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
        <MiniTabs<Mode> value={mode} options={[['logged', 'My trips'], ['auto', 'Auto']]} onChange={setMode} />
        {isOwner && mode === 'logged' && (
          <Pressable onPress={() => { setError(null); setStarting(true); }} accessibilityRole="button" accessibilityLabel="Start a new trip" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
            <DIcon name="plus" size={20} strokeWidth={2.4} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 4 }}
        refreshControl={<RefreshControl refreshing={logs.isRefetching} onRefresh={() => { logs.refetch(); auto.refetch(); }} colors={[c.text]} />}
      >
        {mode === 'logged' ? (
          list.length === 0 ? (
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
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 12, marginHorizontal: -12, borderRadius: 16, backgroundColor: pressed || t.current ? c.surface : 'transparent' })}
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
          )
        ) : (
          <>
            <View style={{ paddingBottom: 6 }}>
              <MiniTabs<Period> value={period} options={[['1', '24 h'], ['7', '7 days'], ['30', '30 days']]} onChange={setPeriod} />
            </View>
            {(auto.data?.data ?? []).length === 0 ? (
              <Text style={[muted, { textAlign: 'center', paddingVertical: 32 }]}>{auto.isLoading ? 'Loading…' : 'No automatic trips in this period.'}</Text>
            ) : (
              (auto.data?.data ?? []).map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => router.push(`/trip/${t.id}?deviceId=${device.id}`)}
                  accessibilityRole="button"
                  style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 12, marginHorizontal: -12, borderRadius: 16, backgroundColor: pressed ? c.surface : 'transparent' })}
                >
                  <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: c.text }}>{dateTime(t.startTime)}{t.endTime ? ` – ${timeOnly(t.endTime)}` : ''}</Text>
                    <Text numberOfLines={1} style={muted}>{duration(t.durationS)} · max {t.maxSpeed} km/h{t.inProgress ? ' · driving now' : ''}</Text>
                  </View>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: c.text }}>{km(t.distanceKm)} km</Text>
                </Pressable>
              ))
            )}
          </>
        )}
        {mode === 'logged' && list.length > 0 && isOwner && <Text style={[muted, { textAlign: 'center', paddingTop: 12 }]}>Touch and hold a trip to delete it.</Text>}
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
        <Input label="Name (optional)" value={name} onChangeText={setName} placeholder={`Trip ${list.length + 1}`} maxLength={60} error={error ?? undefined} />
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
