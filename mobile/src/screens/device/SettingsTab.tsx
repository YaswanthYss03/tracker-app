// Settings (minimal, flat rows): speed limit and time zone (owner), notifications,
// a small "Edit vehicle" link, and release / leave. Plate, name, type, colour and
// drivers are edited in the vehicle editor.
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DIcon } from '@/components/DesignIcon';
import { DesignSheet } from '@/components/DesignSheet';
import { TIMEZONES, clockIn, offsetMinutes, utcLabel, zoneName } from '@/lib/timezones';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';
import type { TabProps } from './types';

export function SettingsTab({ device, isOwner, reload }: TabProps) {
  const c = useColors();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState(device.speedLimitKmh ? String(device.speedLimitKmh) : '');
  const [timezone, setTimezone] = useState(device.timezone);
  const [notify, setNotify] = useState(device.notify);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<'release' | 'leave' | null>(null);

  async function save(body: Record<string, unknown>, ok = 'Saved') {
    setNote(null);
    try {
      await api(`/devices/${device.id}`, { method: 'PATCH', body });
      setNote(ok);
      reload();
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    } catch (err) {
      setNote(errorText(err));
    }
  }

  async function toggleNotify(value: boolean) {
    setNotify(value);
    try {
      await api(`/devices/${device.id}/notifications`, { method: 'PATCH', body: { enabled: value } });
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

  // Time zones with their UTC offset and the time there right now.
  const zones = useMemo(() => {
    const now = new Date();
    const list: [string, string][] = TIMEZONES.some(([z]) => z === timezone) ? TIMEZONES : [[timezone, zoneName(timezone)], ...TIMEZONES];
    return list.map(([z, name]) => ({ z, name, utc: utcLabel(offsetMinutes(z, now)), clock: clockIn(z, now) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneOpen, timezone]);
  const current = { utc: utcLabel(offsetMinutes(timezone)), name: zoneName(timezone) };

  const label = { fontFamily: fonts.medium, fontSize: 15, color: c.text } as const;
  const muted = { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: c.textMuted } as const;
  const row = { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.border } as const;

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
      {isOwner && (
        <Pressable onPress={() => router.push(`/vehicles/edit?id=${device.id}`)} accessibilityRole="button" style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 6, height: 36 }}>
          <DIcon name="edit" size={14} strokeWidth={2} color={c.textMuted} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.textMuted }}>Edit vehicle</Text>
        </Pressable>
      )}

      {isOwner && (
        <View style={row}>
          <View style={{ flex: 1 }}>
            <Text style={label}>Speed limit</Text>
            <Text style={muted}>Alert when the vehicle goes faster. Empty = off.</Text>
          </View>
          <TextInput
            value={limit}
            onChangeText={(v) => setLimit(v.replace(/\D/g, '').slice(0, 3))}
            onEndEditing={() => { if (limit !== (device.speedLimitKmh ? String(device.speedLimitKmh) : '')) save({ speedLimitKmh: limit ? Number(limit) : null }); }}
            keyboardType="number-pad"
            placeholder="Off"
            placeholderTextColor={c.textMuted}
            accessibilityLabel="Speed limit in kilometres per hour"
            style={{ width: 56, fontFamily: fonts.bold, fontSize: 16, color: c.text, textAlign: 'right', paddingVertical: 4, borderBottomWidth: 1.5, borderBottomColor: c.text }}
          />
          <Text style={muted}>km/h</Text>
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

      {note ? <Text style={[muted, { paddingTop: 10, color: note === 'Saved' ? c.success : c.danger }]}>{note}</Text> : null}

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
      <DesignSheet visible={zoneOpen} onClose={() => setZoneOpen(false)} title="Time zone">
        <ScrollView style={{ maxHeight: 440 }} showsVerticalScrollIndicator={false}>
          {zones.map((z) => {
            const on = z.z === timezone;
            return (
              <Pressable
                key={z.z}
                onPress={() => { setZoneOpen(false); if (!on) { setTimezone(z.z); save({ timezone: z.z }); } }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, borderBottomWidth: 1, borderBottomColor: c.border }}
              >
                <Text style={{ width: 84, fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{z.utc}</Text>
                <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.body, fontSize: 15, color: c.text }}>{z.name}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 13, color: c.textMuted }}>{z.clock}</Text>
                <View style={{ width: 20 }}>{on && <DIcon name="check" size={18} strokeWidth={2.6} color={c.accent} />}</View>
              </Pressable>
            );
          })}
        </ScrollView>
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
