// Add / edit a driver: photo (camera, files or an illustration), name, phone,
// licence + expiry, and the vehicles they mainly drive.
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useNavigation, usePreventRemove } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { plateOrName, type Device, type DriverFull } from '@/api/types';
import { useDrivers, useRefreshDrivers, isoToDmy, dmyToIso, maskDate, plateTail } from '@/lib/drivers';
import { pickPhoto, type PickedPhoto } from '@/lib/photo';
import { AVATAR_KEYS, AVATARS, DriverAvatar, Illustration, avatarForName } from '@/components/DriverAvatar';
import { Dialog, Input, PillButton, Sheet, TopBar, VehicleTile, accentTint } from '@/components/kit';
import { ErrorBox } from '@/components/ui';
import { radius, space, type, useColors } from '@/theme';

export default function DriverEditor() {
  const c = useColors();
  const navigation = useNavigation();
  const refresh = useRefreshDrivers();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: drivers } = useDrivers();
  const existing: DriverFull | undefined = drivers?.find((d) => d.id === id);
  const vehicles = useQuery({ queryKey: ['devices'], queryFn: () => api<{ data: Device[] }>('/devices') }).data?.data.filter((d) => d.role === 'owner') ?? [];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licence, setLicence] = useState('');
  const [expiry, setExpiry] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [mainOf, setMainOf] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(!id);
  const [sheet, setSheet] = useState<'photo' | 'illustration' | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Fill the form once the driver arrives.
  useEffect(() => {
    if (!existing || loaded) return;
    setName(existing.name);
    setPhone(existing.phone ?? '');
    setLicence(existing.licenceNo ?? '');
    setExpiry(isoToDmy(existing.licenceExpiry));
    setAvatar(existing.avatar);
    setMainOf(existing.mainOf.map((v) => v.id));
    setLoaded(true);
  }, [existing, loaded]);

  const initial = useMemo(() => JSON.stringify(existing
    ? [existing.name, existing.phone ?? '', existing.licenceNo ?? '', isoToDmy(existing.licenceExpiry), existing.avatar, existing.mainOf.map((v) => v.id).sort()]
    : ['', '', '', '', null, []]), [existing]);
  const current = JSON.stringify([name, phone, licence, expiry, avatar, [...mainOf].sort()]);
  const dirty = loaded && !saved && (current !== initial || !!photo || removePhoto);

  // Ask before throwing away changes (back button, swipe, ✕).
  const [leaveAction, setLeaveAction] = useState<any>(null);
  const [discarding, setDiscarding] = useState<any>(null);
  usePreventRemove(dirty && !discarding, ({ data }) => setLeaveAction(data.action));
  // Leave only after the guard above is off, or it would stop us again.
  useEffect(() => {
    if (discarding) navigation.dispatch(discarding);
  }, [discarding, navigation]);

  const preview = { name: name || 'Driver', avatar: avatar ?? avatarForName(name || 'Driver'), photoUrl: removePhoto ? null : existing?.photoUrl ?? null };

  async function choose(from: 'camera' | 'library') {
    setSheet(null);
    try {
      const p = await pickPhoto(from);
      if (p === 'denied') setError(from === 'camera' ? 'Camera permission is needed to take a photo.' : 'Photo permission is needed to choose a photo.');
      else if (p) {
        setPhoto(p);
        setRemovePhoto(false);
      }
    } catch (e) {
      setError(errorText(e));
    }
  }

  async function save() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Enter the driver\'s name';
    if (phone.trim() && !/^\+?[0-9 ()-]{6,20}$/.test(phone.trim())) errs.phone = 'Enter a valid phone number';
    const iso = dmyToIso(expiry);
    if (iso === 'invalid') errs.expiry = 'Use DD/MM/YYYY';
    if (licence.trim() && licence.trim().length < 4) errs.licence = 'Too short';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setError(null);
    try {
      const body = {
        name: name.trim(),
        phone: phone.trim() || null,
        licenceNo: licence.trim() || null,
        licenceExpiry: iso,
        avatar: avatar ?? avatarForName(name.trim()),
        mainVehicleIds: mainOf,
      };
      const res = existing
        ? await api<{ data: DriverFull }>(`/drivers/${existing.id}`, { method: 'PATCH', body })
        : await api<{ data: DriverFull }>('/drivers', { method: 'POST', body });
      const driverId = res.data.id;
      if (photo) await api(`/drivers/${driverId}/photo`, { method: 'PUT', body: { image: photo.base64 } });
      else if (removePhoto && existing?.photoUrl) await api(`/drivers/${driverId}/photo`, { method: 'DELETE' });
      await refresh();
      setSaved(true);
      setTimeout(() => router.back(), 0);
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
      await api(`/drivers/${existing.id}`, { method: 'DELETE' });
      await refresh();
      setSaved(true);
      setConfirmRemove(false);
      setTimeout(() => router.back(), 0);
    } catch (e) {
      setError(errorText(e));
      setConfirmRemove(false);
    } finally {
      setBusy(false);
    }
  }

  const hasPhoto = !!photo || (!!existing?.photoUrl && !removePhoto);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar title={existing ? 'Edit driver' : 'Add driver'} close onBack={() => router.back()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {/* Photo */}
          <Pressable onPress={() => setSheet('photo')} accessibilityRole="button" accessibilityLabel="Change photo" style={{ alignSelf: 'center', alignItems: 'center', gap: space.sm }}>
            <View>
              <DriverAvatar driver={preview} size={112} localUri={photo?.uri} />
              <View style={[styles.camera, { backgroundColor: c.text, borderColor: c.bg }]}>
                <Ionicons name="camera" size={16} color={c.bg} />
              </View>
            </View>
            <Text style={[type.small, { color: c.text, fontFamily: type.fieldLabel.fontFamily }]}>{hasPhoto ? 'Change photo' : 'Add photo · camera or files'}</Text>
          </Pressable>

          <Input label="Full name" value={name} onChangeText={setName} placeholder="e.g. Arun Kumar" autoCapitalize="words" maxLength={60} error={errors.name} />
          <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+91 90000 00000" keyboardType="phone-pad" maxLength={20} error={errors.phone} />
          <View style={{ flexDirection: 'row', gap: space.md }}>
            <View style={{ flex: 1.4 }}>
              <Input label="Licence no." value={licence} onChangeText={setLicence} placeholder="TN99 2011 0009931" autoCapitalize="characters" maxLength={30} error={errors.licence} />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Expires" value={expiry} onChangeText={(t) => setExpiry(maskDate(t))} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} error={errors.expiry} />
            </View>
          </View>

          {/* Vehicles */}
          <View style={{ gap: space.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[type.fieldLabel, { color: c.text }]}>Main driver of</Text>
              <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{mainOf.length} selected</Text>
            </View>
            {vehicles.length === 0 ? (
              <Text style={[type.small, { color: c.textMuted }]}>Add a vehicle first to assign this driver.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
                {vehicles.map((v) => {
                  const on = mainOf.includes(v.id);
                  return (
                    <Pressable
                      key={v.id}
                      onPress={() => setMainOf(on ? mainOf.filter((x) => x !== v.id) : [...mainOf, v.id])}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: on }}
                      accessibilityLabel={plateOrName(v)}
                      style={{ alignItems: 'center', gap: 4 }}
                    >
                      <View style={[styles.vehicle, { borderColor: on ? c.text : 'transparent' }]}>
                        <VehicleTile type={v.icon} color={v.color} width={72} height={52} />
                      </View>
                      <Text style={[type.plate, { fontSize: 12, lineHeight: 16, color: on ? c.text : c.textMuted }]}>{plateTail(v.registrationNumber, v.name)}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>

          <ErrorBox error={error} />

          {existing && (
            <Pressable onPress={() => setConfirmRemove(true)} accessibilityRole="button" style={styles.remove}>
              <Ionicons name="trash-outline" size={18} color={c.danger} />
              <Text style={[type.bodyStrong, { color: c.danger }]}>Remove driver</Text>
            </Pressable>
          )}
        </ScrollView>
        <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
          <PillButton title="Save driver" onPress={save} loading={busy} disabled={!loaded} />
        </View>
      </KeyboardAvoidingView>

      {/* Photo source */}
      <Sheet visible={sheet === 'photo'} onClose={() => setSheet(null)} title="Driver photo">
        <SheetRow icon="camera-outline" title="Take photo" onPress={() => choose('camera')} />
        <SheetRow icon="folder-outline" title="Choose from files" sub="JPG or PNG" onPress={() => choose('library')} />
        <SheetRow icon="person-outline" title="Use an illustration" onPress={() => setSheet('illustration')} />
        {hasPhoto && <SheetRow icon="trash-outline" title="Remove photo" danger onPress={() => { setPhoto(null); setRemovePhoto(true); setSheet(null); }} />}
      </Sheet>

      {/* Illustrations */}
      <Sheet visible={sheet === 'illustration'} onClose={() => setSheet(null)} title="Choose an illustration">
        <View style={styles.illus}>
          {AVATAR_KEYS.map((k) => {
            const on = (avatar ?? avatarForName(name || 'Driver')) === k && !hasPhoto;
            return (
              <Pressable
                key={k}
                onPress={() => { setAvatar(k); setPhoto(null); if (existing?.photoUrl) setRemovePhoto(true); setSheet(null); }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`Illustration ${k.slice(1)}`}
                style={[styles.illusItem, { borderColor: on ? c.text : 'transparent' }]}
              >
                <Illustration look={AVATARS[k]} size={64} />
              </Pressable>
            );
          })}
        </View>
      </Sheet>

      <Dialog
        visible={confirmRemove}
        title={`Remove ${existing?.name ?? 'driver'}?`}
        message="Their vehicles will have no driver until you choose another one."
        cancel="Keep"
        confirm="Remove"
        danger
        busy={busy}
        onCancel={() => setConfirmRemove(false)}
        onConfirm={remove}
      />
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

function SheetRow({ icon, title, sub, onPress, danger }: { icon: keyof typeof Ionicons.glyphMap; title: string; sub?: string; onPress: () => void; danger?: boolean }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.sheetRow, { opacity: pressed ? 0.7 : 1 }]}>
      <View style={[styles.sheetIcon, { backgroundColor: danger ? c.dangerSoft : accentTint }]}>
        <Ionicons name={icon} size={20} color={danger ? c.danger : c.text} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[type.bodyStrong, { color: danger ? c.danger : c.text }]}>{title}</Text>
        {sub ? <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{sub}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  camera: { position: 'absolute', right: 2, bottom: 2, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  vehicle: { borderWidth: 2, borderRadius: radius.md + 3, padding: 1 },
  remove: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: space.sm },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 56 },
  sheetIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  illus: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, justifyContent: 'space-between' },
  illusItem: { borderWidth: 3, borderRadius: 40, padding: 2 },
});
