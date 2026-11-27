// Add / edit a vehicle: big picture in its colour, type, colour, main driver,
// number plate, name, and (when adding) the tracker IMEI + activation code.
// Editing also offers "Remove vehicle" (type the plate to confirm).
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useNavigation, usePreventRemove } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { plateOrName, type Device } from '@/api/types';
import { formatActivationCode } from '@/lib/format';
import { VEHICLES, type VehicleType } from '@/lib/vehicles';
import { VEHICLE_COLORS, colorOf } from '@/lib/vehicleColors';
import { useDrivers } from '@/lib/drivers';
import { DriverAvatar } from '@/components/DriverAvatar';
import { Chip, Dialog, Input, PillButton, TopBar, VehicleTile } from '@/components/kit';
import { ErrorBox, Loading } from '@/components/ui';
import { radius, space, type, useColors } from '@/theme';

/** Pulls a 15-digit IMEI out of whatever the barcode contains. */
function extractImei(raw: string) {
  const match = raw.match(/\d{15}/);
  return match ? match[0] : null;
}
const normPlate = (v: string) => v.toUpperCase().replace(/\s+/g, ' ').trim();

export default function VehicleEditor() {
  const c = useColors();
  const qc = useQueryClient();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editing = !!id;
  const device = useQuery({
    queryKey: ['device', id],
    queryFn: () => api<{ data: Device }>(`/devices/${id}`),
    enabled: editing,
  });
  const existing = device.data?.data;
  const { data: drivers = [] } = useDrivers();
  const [permission, requestPermission] = useCameraPermissions();

  const [kind, setKind] = useState<VehicleType>('car');
  const [color, setColor] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [plate, setPlate] = useState('');
  const [name, setName] = useState('');
  const [imei, setImei] = useState('');
  const [code, setCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loaded, setLoaded] = useState(!editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeText, setRemoveText] = useState('');

  useEffect(() => {
    if (!existing || loaded) return;
    setKind((existing.icon as VehicleType) || 'car');
    setColor(existing.color ?? null);
    setDriverId(existing.mainDriver?.id ?? null);
    setPlate(existing.registrationNumber ?? '');
    setName(existing.name ?? '');
    setImei(existing.imei);
    setLoaded(true);
  }, [existing, loaded]);

  const initial = useMemo(() => JSON.stringify(existing
    ? [existing.icon || 'car', existing.color ?? null, existing.mainDriver?.id ?? null, existing.registrationNumber ?? '', existing.name ?? '', existing.imei, '']
    : ['car', null, null, '', '', '', '']), [existing]);
  const dirty = loaded && !saved && JSON.stringify([kind, color, driverId, plate, name, imei, code]) !== initial;
  const [leaveAction, setLeaveAction] = useState<any>(null);
  const [discarding, setDiscarding] = useState<any>(null);
  usePreventRemove(dirty && !discarding, ({ data }) => setLeaveAction(data.action));
  // Leave only after the guard above is off, or it would stop us again.
  useEffect(() => {
    if (discarding) navigation.dispatch(discarding);
  }, [discarding, navigation]);

  const plateOk = !plate.trim() || /^[A-Z0-9][A-Z0-9 -]{2,14}$/.test(normPlate(plate));
  const canSave = loaded && plateOk && (editing || (imei.length === 15 && code.replace('-', '').length === 10));
  const confirmWord = existing ? existing.registrationNumber || existing.imei : '';

  async function startScan() {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setError('Camera permission is needed to scan. You can type the IMEI instead.');
        return;
      }
    }
    setError(null);
    setScanning(true);
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      let deviceId = id;
      if (editing) {
        await api(`/devices/${id}`, {
          method: 'PATCH',
          body: { icon: kind, color, mainDriverId: driverId, registrationNumber: plate.trim() ? normPlate(plate) : null, name: name.trim() || null },
        });
      } else {
        const { data } = await api<{ data: Device }>('/devices/claim', {
          method: 'POST',
          body: {
            imei, activationCode: code, vehicleType: kind, name: name.trim() || undefined,
            registrationNumber: plate.trim() ? normPlate(plate) : undefined,
            color: color ?? undefined, mainDriverId: driverId ?? undefined,
          },
        });
        deviceId = data.id;
      }
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['devices'] }),
        qc.invalidateQueries({ queryKey: ['device'] }),
        qc.invalidateQueries({ queryKey: ['drivers'] }),
      ]);
      setSaved(true);
      setTimeout(() => (editing ? router.back() : router.replace(`/device/${deviceId}`)), 0);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!existing) return;
    setBusy(true);
    try {
      await api(`/devices/${existing.id}/release`, { method: 'POST', body: { confirmImei: existing.imei } });
      await qc.invalidateQueries({ queryKey: ['devices'] });
      qc.removeQueries({ queryKey: ['device', existing.id] });
      setSaved(true);
      setRemoveOpen(false);
      setTimeout(() => router.dismissTo('/'), 0);
    } catch (e) {
      setError(errorText(e));
      setRemoveOpen(false);
    } finally {
      setBusy(false);
    }
  }

  if (editing && !loaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
        <TopBar title="Edit vehicle" close onBack={() => router.back()} />
        {device.error ? <ErrorBox error={errorText(device.error)} /> : <Loading />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar title={editing ? 'Edit vehicle' : 'Add vehicle'} close onBack={() => router.back()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: space.xs, gap: space.lg, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {scanning ? (
            <View style={[styles.camera, { borderColor: c.accent }]}>
              <CameraView
                style={{ flex: 1 }}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['code128', 'code39', 'ean13', 'qr', 'datamatrix'] }}
                onBarcodeScanned={({ data }) => {
                  const found = extractImei(data);
                  if (found) {
                    setImei(found);
                    setScanning(false);
                  }
                }}
              />
              <View style={[styles.scanHint, { backgroundColor: c.overlay }]}>
                <Text style={[type.bodyStrong, { color: '#fff', textAlign: 'center' }]}>Point at the IMEI barcode</Text>
              </View>
              <Pressable onPress={() => setScanning(false)} accessibilityLabel="Stop scanning" style={styles.scanClose}>
                <Ionicons name="close" size={22} color="#fff" />
              </Pressable>
            </View>
          ) : (
            <VehicleTile type={kind} color={color} width="100%" height={150} style={{ borderRadius: radius.card }} />
          )}

          {/* Type */}
          <View style={{ gap: space.sm }}>
            <Text style={[type.fieldLabel, { color: c.text }]}>Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingVertical: 2 }}>
              {VEHICLES.map((v) => (
                <Chip key={v.type} label={v.label} selected={kind === v.type} onPress={() => setKind(v.type)} />
              ))}
            </ScrollView>
          </View>

          {/* Colour */}
          <View style={{ gap: space.sm }}>
            <View style={styles.labelRow}>
              <Text style={[type.fieldLabel, { color: c.text }]}>Colour</Text>
              <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{colorOf(color)?.label ?? 'Not set'}</Text>
            </View>
            <View style={styles.swatches}>
              {VEHICLE_COLORS.map((col) => {
                const on = color === col.key;
                return (
                  <Pressable
                    key={col.key}
                    onPress={() => setColor(on ? null : col.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={col.label}
                    style={[styles.swatchRing, { borderColor: on ? c.text : 'transparent' }]}
                  >
                    <View style={[styles.swatch, { backgroundColor: col.hex, borderColor: c.border }]} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Main driver */}
          <View style={{ gap: space.sm }}>
            <View style={styles.labelRow}>
              <Text style={[type.fieldLabel, { color: c.text }]}>Main driver</Text>
              <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{driverId ? 'Tap again to clear' : 'Optional'}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.md, paddingVertical: 2 }}>
              {drivers.map((d) => {
                const on = driverId === d.id;
                return (
                  <Pressable
                    key={d.id}
                    onPress={() => setDriverId(on ? null : d.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={d.name}
                    style={{ alignItems: 'center', gap: 4, width: 64 }}
                  >
                    <View style={[styles.avatarRing, { borderColor: on ? c.text : 'transparent' }]}>
                      <DriverAvatar driver={d} size={52} />
                    </View>
                    <Text numberOfLines={1} style={[on ? type.fieldLabel : type.caption, { color: on ? c.text : c.textMuted, letterSpacing: 0 }]}>{d.name.split(' ')[0]}</Text>
                  </Pressable>
                );
              })}
              <Pressable onPress={() => router.push('/drivers/edit')} accessibilityRole="button" accessibilityLabel="Add driver" style={{ alignItems: 'center', gap: 4, width: 64 }}>
                <View style={[styles.addDriver, { borderColor: c.border }]}>
                  <Ionicons name="add" size={24} color={c.text} />
                </View>
                <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>Add</Text>
              </Pressable>
            </ScrollView>
          </View>

          <Input
            label="Number plate"
            value={plate}
            onChangeText={(v) => setPlate(v.toUpperCase())}
            placeholder="TN 38 AB 1234"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={15}
            error={plateOk ? undefined : 'Use letters, numbers and spaces (3–15)'}
            style={type.plate}
          />
          <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. Delivery Truck 1" maxLength={80} />

          {editing ? (
            <Input label="Tracker ID (IMEI)" counter="15/15" value={imei} editable={false} style={[type.plate, { color: c.textMuted }]} />
          ) : (
            <>
              <Input
                label="Tracker ID (IMEI)"
                counter={`${imei.length}/15`}
                value={imei}
                onChangeText={(v) => setImei(v.replace(/\D/g, '').slice(0, 15))}
                placeholder="15 digits"
                keyboardType="number-pad"
                style={type.plate}
                right={
                  <Pressable onPress={startScan} hitSlop={10} accessibilityRole="button" accessibilityLabel="Scan IMEI barcode">
                    <Ionicons name="barcode-outline" size={24} color={c.text} />
                  </Pressable>
                }
              />
              <Input
                label="Activation code"
                value={code}
                onChangeText={(v) => setCode(formatActivationCode(v))}
                placeholder="ABCDE-12345"
                autoCapitalize="characters"
                autoCorrect={false}
                style={[type.plate, { letterSpacing: 2 }]}
              />
              <Text style={[type.small, { color: c.textMuted, marginTop: -space.sm }]}>Both numbers are printed on the tracker's box.</Text>
            </>
          )}

          <ErrorBox error={error} />

          {editing && existing?.role === 'owner' && (
            <Pressable onPress={() => { setRemoveText(''); setRemoveOpen(true); }} accessibilityRole="button" style={styles.remove}>
              <Ionicons name="trash-outline" size={18} color={c.danger} />
              <Text style={[type.bodyStrong, { color: c.danger }]}>Remove vehicle</Text>
            </Pressable>
          )}
        </ScrollView>
        <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
          <PillButton title={editing ? 'Save' : 'Add vehicle'} onPress={save} loading={busy} disabled={!canSave} />
        </View>
      </KeyboardAvoidingView>

      <Dialog
        visible={removeOpen}
        title={`Remove ${existing ? plateOrName(existing) : 'vehicle'}?`}
        message={`This deletes its trips and history and stops sharing. Type ${existing?.registrationNumber ? 'the number plate' : 'the IMEI'} to confirm.`}
        cancel="Keep"
        confirm="Remove"
        danger
        busy={busy}
        confirmDisabled={normPlate(removeText) !== normPlate(confirmWord)}
        onCancel={() => setRemoveOpen(false)}
        onConfirm={remove}
      >
        <Input label={existing?.registrationNumber ? 'Number plate' : 'IMEI'} value={removeText} onChangeText={(v) => setRemoveText(v.toUpperCase())} placeholder={confirmWord} autoCapitalize="characters" autoCorrect={false} style={type.plate} />
      </Dialog>
      <Dialog
        visible={!!leaveAction}
        title="Discard changes?"
        message="What you typed here hasn't been saved."
        cancel="Keep editing"
        confirm="Discard"
        danger
        onCancel={() => setLeaveAction(null)}
        onConfirm={() => { setDiscarding(leaveAction); setLeaveAction(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' },
  swatchRing: { borderWidth: 2, borderRadius: 22, padding: 2 },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth },
  avatarRing: { borderWidth: 2, borderRadius: 30, padding: 2 },
  addDriver: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  camera: { height: 220, borderRadius: radius.card, overflow: 'hidden', borderWidth: 3 },
  scanHint: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space.md },
  scanClose: { position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)' },
  remove: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: space.sm },
});
