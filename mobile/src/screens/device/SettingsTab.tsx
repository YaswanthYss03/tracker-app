// Settings: name, speed limit, timezone (owner); notifications (everyone); release / leave.
import { useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AppText, Button, Card, ErrorBox, Field, Row, Segmented } from '@/components/ui';
import { VehiclePicker } from '@/components/VehiclePicker';
import { vehicleOf, type VehicleType } from '@/lib/vehicles';
import { space, useColors } from '@/theme';
import type { TabProps } from './types';

const TIMEZONES: [string, string][] = [['Asia/Kolkata', 'India'], ['Asia/Dubai', 'Dubai'], ['Asia/Singapore', 'Singapore'], ['UTC', 'UTC']];

export function SettingsTab({ device, isOwner, reload }: TabProps) {
  const c = useColors();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(device.name || '');
  const [plate, setPlate] = useState(device.registrationNumber || '');
  const [driver, setDriver] = useState(device.driverName || '');
  const [limit, setLimit] = useState(device.speedLimitKmh ? String(device.speedLimitKmh) : '');
  const [timezone, setTimezone] = useState(device.timezone);
  const [vehicle, setVehicle] = useState<VehicleType | null>(vehicleOf(device.icon)?.type ?? null);
  const [notify, setNotify] = useState(device.notify);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState<'release' | 'leave' | null>(null);

  async function save() {
    setError(null);
    setSaved(false);
    try {
      await api(`/devices/${device.id}`, {
        method: 'PATCH',
        body: {
          name: name.trim() || null, speedLimitKmh: limit ? Number(limit) : null, timezone, icon: vehicle,
          registrationNumber: plate.trim() || null, driverName: driver.trim() || null,
        },
      });
      setSaved(true);
      reload();
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    } catch (err) {
      setError(errorText(err));
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

  return (
    <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: 48 }}>
      {isOwner && (
        <Card style={{ gap: space.md }}>
          <AppText variant="h3">Tracker</AppText>
          <Field label="Vehicle number" value={plate} onChangeText={(v) => setPlate(v.toUpperCase())} autoCapitalize="characters" autoCorrect={false} placeholder="TN 38 AB 1234" />
          <Field label="Driver name" value={driver} onChangeText={setDriver} placeholder="e.g. Ravi" />
          <Field label="Name" value={name} onChangeText={setName} placeholder="e.g. Family car" />
          <VehiclePicker value={vehicle} onChange={setVehicle} />
          <Field
            label="Speed limit for alerts (km/h)"
            value={limit}
            onChangeText={(v) => setLimit(v.replace(/\D/g, '').slice(0, 3))}
            keyboardType="number-pad"
            hint="Leave empty to turn overspeed alerts off"
          />
          <AppText variant="caption" color="textMuted">TIMEZONE (FOR DAILY REPORTS)</AppText>
          <View style={{ marginHorizontal: -space.lg }}>
            <Segmented value={timezone} options={TIMEZONES.some(([t]) => t === timezone) ? TIMEZONES : [[timezone, timezone], ...TIMEZONES]} onChange={setTimezone} />
          </View>
          <ErrorBox error={error} />
          {saved && <AppText variant="small" color="success">Saved</AppText>}
          <Button title="Save" onPress={save} />
        </Card>
      )}

      <Card style={{ gap: space.sm }}>
        <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Notifications</AppText>
            <AppText variant="small" color="textMuted">Send this tracker's alerts to my phone</AppText>
          </View>
          <Switch value={notify} onValueChange={toggleNotify} trackColor={{ true: c.accent }} />
        </Row>
      </Card>

      <Card style={{ gap: space.md }}>
        <AppText variant="h3">{isOwner ? 'Release tracker' : 'Leave tracker'}</AppText>
        <AppText variant="small" color="textMuted">
          {isOwner
            ? 'Selling the vehicle or tracker? Releasing deletes all history, removes everyone, and lets the next owner add it with the code on the box.'
            : 'Stop seeing this tracker. The owner can share it with you again.'}
        </AppText>
        <Button title={isOwner ? 'Release tracker' : 'Leave'} variant="danger" onPress={() => setConfirm(isOwner ? 'release' : 'leave')} />
      </Card>

      <AppText variant="caption" color="textMuted" center>IMEI {device.imei} · {device.model}</AppText>

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
