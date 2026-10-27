// Settings (minimal, flat rows): speed limit and time zone (owner), notifications,
// a small "Edit vehicle" link, and release / leave. Plate, name, type, colour and
// drivers are edited in the vehicle editor.
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DIcon } from '@/components/DesignIcon';
import { DesignSheet } from '@/components/DesignSheet';
import { ZONES, clockIn, offsetMinutes, utcLabel, zoneName, type Zone } from '@/lib/timezones';
import { MiniTabs } from '@/components/MiniTabs';
import { showToast } from '@/lib/toast';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';
import type { TabProps } from './types';

export function SettingsTab({ device, isOwner, reload }: TabProps) {
  const c = useColors();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState<number | null>(device.speedLimitKmh || null);
  const [query, setQuery] = useState('');
  const saved = useRef<number | null>(device.speedLimitKmh || null);
  const changed = useRef(false); // something was saved: tell the user when they leave this page
  const limitNow = useRef(limit);
  limitNow.current = limit;
  const [timezone, setTimezone] = useState(device.timezone);
  const [notify, setNotify] = useState(device.notify);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<'release' | 'leave' | null>(null);

  async function save(body: Record<string, unknown>) {
    setNote(null);
    try {
      await api(`/devices/${device.id}`, { method: 'PATCH', body });
      changed.current = true;
      reload();
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    } catch (err) {
      setNote(errorText(err));
    }
  }

  // Speed limit saves by itself a moment after the last change.
  useEffect(() => {
    if (limit === saved.current) return undefined;
    const timer = setTimeout(() => { saved.current = limit; save({ speedLimitKmh: limit }); }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);
  // Leaving the page: save a pending speed-limit change right away, then show "Settings saved" once.
  useEffect(() => () => {
    if (limitNow.current !== saved.current) {
      saved.current = limitNow.current;
      api(`/devices/${device.id}`, { method: 'PATCH', body: { speedLimitKmh: limitNow.current } }).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      changed.current = true;
    }
    if (changed.current) showToast('Settings saved');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const step = (by: number) => setLimit((l) => Math.max(10, Math.min(250, (l ?? (by > 0 ? 40 : 45)) + by)));

  async function toggleNotify(value: boolean) {
    setNotify(value);
    try {
      await api(`/devices/${device.id}/notifications`, { method: 'PATCH', body: { enabled: value } });
      changed.current = true;
    } catch {
      setNotify(!value);
    }
  }

  async function leaveOrRelease() {
    if (confirm === 'release') {
      await api(`/devices/${device.id}/release`, { method: 'POST', body: { confirmImei: device.imei } });
    } else {
      await api(`/devices/${device.id}/members/${user!.id}`, { method: 'DELETE' });
    }
    await queryClient.invalidateQueries({ queryKey: ['devices'] });
    router.replace('/');
  }

  // Search over country, city, zone id and UTC offset.
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^utc/, '');
    const list = !q ? ZONES : ZONES.filter((z) => `${z.country} ${z.city} ${z.zone}`.toLowerCase().includes(q) || utcLabel(offsetMinutes(z.zone)).toLowerCase().replace('utc', '').includes(q));
    const cur = list.find((z) => z.zone === timezone);
    return cur && !q ? [cur, ...list.filter((z) => z !== cur)] : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, timezone, zoneOpen]);
  const current = { utc: utcLabel(offsetMinutes(timezone)), name: zoneName(timezone) };

  const label = { fontFamily: fonts.medium, fontSize: 15, color: c.text } as const;
  const muted = { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: c.textMuted } as const;
  const row = { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.border } as const;

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
      {isOwner && (
        <Pressable
          onPress={() => router.push(`/vehicles/edit?id=${device.id}`)}
          accessibilityRole="button"
          style={({ pressed }) => ({ height: 46, borderRadius: 23, backgroundColor: c.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6, opacity: pressed ? 0.7 : 1 })}
        >
          <DIcon name="edit" size={17} strokeWidth={2} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: c.text }}>Edit vehicle</Text>
        </Pressable>
      )}

      {isOwner && (
        <View style={[row, { flexDirection: 'column', alignItems: 'stretch', paddingVertical: 14, gap: 12 }]}>
          <View>
            <Text style={label}>Speed limit</Text>
            <Text style={muted}>Get an alert when the vehicle goes faster than this.</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
            <Pressable onPress={() => step(-5)} accessibilityRole="button" accessibilityLabel="Lower the limit" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}>
              <DIcon name="minus" size={20} strokeWidth={2.4} />
            </Pressable>
            <View style={{ minWidth: 120, alignItems: 'center' }}>
              <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.6, color: limit ? c.text : c.textMuted }}>{limit ?? 'Off'}</Text>
              <Text style={muted}>{limit ? 'km/h' : 'no speed alerts'}</Text>
            </View>
            <Pressable onPress={() => step(5)} accessibilityRole="button" accessibilityLabel="Raise the limit" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}>
              <DIcon name="plus" size={20} strokeWidth={2.4} />
            </Pressable>
          </View>
          <View style={{ alignItems: 'center' }}>
            <MiniTabs<string>
              value={limit ? String(limit) : 'off'}
              options={[['off', 'Off'], ['40', '40'], ['60', '60'], ['80', '80'], ['100', '100'], ['120', '120']]}
              onChange={(v) => setLimit(v === 'off' ? null : Number(v))}
            />
          </View>
        </View>
      )}

      {isOwner && (
        <Pressable onPress={() => setZoneOpen(true)} accessibilityRole="button" style={row}>
          <View style={{ flex: 1 }}>
            <Text style={label}>Time zone</Text>
            <Text style={muted}>Used for daily reports</Text>
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{current.utc}</Text>
          <Text numberOfLines={1} style={[muted, { maxWidth: 90 }]}>{current.name}</Text>
          <DIcon name="chevR" size={16} strokeWidth={2.2} color={c.textMuted} />
        </Pressable>
      )}

      <View style={row}>
        <View style={{ flex: 1 }}>
          <Text style={label}>Notifications</Text>
          <Text style={muted}>Send this vehicle’s alerts to my phone</Text>
        </View>
        <Switch value={notify} onValueChange={toggleNotify} trackColor={{ true: c.accent }} />
      </View>

      {note ? <Text style={[muted, { paddingTop: 10, color: c.danger }]}>{note}</Text> : null}

      <Pressable onPress={() => setConfirm(isOwner ? 'release' : 'leave')} accessibilityRole="button" style={{ marginTop: 28, gap: 4 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.danger }}>{isOwner ? 'Release tracker' : 'Leave tracker'}</Text>
        <Text style={muted}>
          {isOwner
            ? 'Selling the vehicle or tracker? Releasing deletes all history, removes everyone, and lets the next owner add it with the code on the box.'
            : 'Stop seeing this tracker. The owner can share it with you again.'}
        </Text>
      </Pressable>

      <Text style={[muted, { textAlign: 'center', paddingTop: 28 }]}>IMEI {device.imei} · {device.model}</Text>

      {/* Time zone picker: UTC offset + the time there now */}
      <DesignSheet visible={zoneOpen} onClose={() => { setZoneOpen(false); setQuery(''); }} title="Time zone">
        <View style={{ height: 42, borderRadius: 21, backgroundColor: c.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 }}>
          <DIcon name="search" size={16} strokeWidth={2} color={c.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search country, city or UTC+5:30"
            placeholderTextColor={c.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ flex: 1, fontFamily: fonts.body, fontSize: 15, color: c.text, paddingVertical: 0 }}
          />
          {query ? <Pressable onPress={() => setQuery('')} hitSlop={8}><DIcon name="x" size={14} strokeWidth={2.2} color={c.textMuted} /></Pressable> : null}
        </View>
        <FlatList
          data={shown}
          keyExtractor={(z) => z.zone}
          style={{ height: 380 }}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={14}
          windowSize={7}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={[muted, { textAlign: 'center', paddingVertical: 28 }]}>No time zone matches “{query}”.</Text>}
          renderItem={({ item }) => <ZoneRow zone={item} on={item.zone === timezone} onPick={() => { setZoneOpen(false); setQuery(''); if (item.zone !== timezone) { setTimezone(item.zone); save({ timezone: item.zone }); } }} />}
        />
      </DesignSheet>

      <ConfirmDialog
        visible={confirm !== null}
        title={confirm === 'release' ? 'Release tracker' : 'Leave tracker'}
        message={confirm === 'release'
          ? 'This permanently deletes history, trips, alerts, geofences and share links, and removes all viewers.'
          : 'You will no longer see this tracker.'}
        confirmLabel={confirm === 'release' ? 'Release' : 'Leave'}
        danger
        requireText={confirm === 'release' ? device.imei : undefined}
        onConfirm={leaveOrRelease}
        onClose={() => setConfirm(null)}
      />
    </ScrollView>
  );
}

/** One zone: UTC offset, country (and city), and the time there now. */
function ZoneRow({ zone, on, onPick }: { zone: Zone; on: boolean; onPick: () => void }) {
  const c = useColors();
  return (
    <Pressable onPress={onPick} accessibilityRole="radio" accessibilityState={{ selected: on }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, borderBottomWidth: 1, borderBottomColor: c.border }}>
      <Text style={{ width: 84, fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{utcLabel(offsetMinutes(zone.zone))}</Text>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.medium, fontSize: 15, color: c.text }}>{zone.country}</Text>
        <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: 12, color: c.textMuted }}>{zone.city}</Text>
      </View>
      <Text style={{ fontFamily: fonts.body, fontSize: 13, color: c.textMuted }}>{clockIn(zone.zone)}</Text>
      <View style={{ width: 20 }}>{on && <DIcon name="check" size={18} strokeWidth={2.6} color={c.accent} />}</View>
    </Pressable>
  );
}
