// Add / edit a service record: type, date, odometer, garage, cost and when the
// next service is due (quick picks: 3 / 6 / 12 months).
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useNavigation, usePreventRemove } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { plateOrName, type Device, type ServiceRecord } from '@/api/types';
import { SERVICE_TYPES, addMonths, isoToday, useService } from '@/lib/service';
import { dmyToIso, isoToDmy, maskDate } from '@/lib/drivers';
import { Chip, Dialog, Input, PillButton, Plate, TopBar } from '@/components/kit';
import { ErrorBox, Loading } from '@/components/ui';
import { space, type, useColors } from '@/theme';

const NEXT_PICKS: [number, string][] = [[3, '3 months'], [6, '6 months'], [12, '1 year']];

export default function ServiceEditor() {
  const c = useColors();
  const qc = useQueryClient();
  const navigation = useNavigation();
  const { deviceId, id } = useLocalSearchParams<{ deviceId: string; id?: string }>();
  const device = useQuery({ queryKey: ['device', deviceId], queryFn: () => api<{ data: Device }>(`/devices/${deviceId}`) }).data?.data;
  const service = useService(deviceId);
  const existing = id ? service.data?.data.find((r) => r.id === id) : undefined;

  const [kind, setKind] = useState<ServiceRecord['type']>('general');
  const [date, setDate] = useState(isoToDmy(isoToday()));
  const [odometer, setOdometer] = useState('');
  const [garage, setGarage] = useState('');
  const [cost, setCost] = useState('');
  const [next, setNext] = useState(isoToDmy(isoToday(6)));
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fill in: the record being edited, or sensible defaults for a new one.
  useEffect(() => {
    if (loaded || !service.data) return;
    if (id && existing) {
      setKind(existing.type);
      setDate(isoToDmy(existing.date));
      setOdometer(existing.odometerKm != null ? String(existing.odometerKm) : '');
      setGarage(existing.garage ?? '');
      setCost(existing.cost != null ? String(existing.cost) : '');
      setNext(isoToDmy(existing.nextDueDate));
    } else if (!id) {
      const est = service.data.estimatedOdometerKm;
      if (est != null) setOdometer(String(est));
      const lastGarage = service.data.data.find((r) => r.garage)?.garage;
      if (lastGarage) setGarage(lastGarage);
    }
    setLoaded(true);
  }, [service.data, existing, id, loaded]);

  const snapshot = JSON.stringify([kind, date, odometer, garage, cost, next]);
  const [initial, setInitial] = useState<string | null>(null);
  useEffect(() => {
    if (loaded && initial == null) setInitial(snapshot);
  }, [loaded, initial, snapshot]);
  const dirty = loaded && !saved && initial != null && snapshot !== initial;
  const [leaveAction, setLeaveAction] = useState<any>(null);
  const [discarding, setDiscarding] = useState<any>(null);
  usePreventRemove(dirty && !discarding, ({ data }) => setLeaveAction(data.action));
  useEffect(() => {
    if (discarding) navigation.dispatch(discarding);
  }, [discarding, navigation]);

  const dateIso = dmyToIso(date);
  const picks = useMemo(() => (dateIso && dateIso !== 'invalid' ? NEXT_PICKS.map(([m, label]) => [addMonths(dateIso, m), label] as const) : []), [dateIso]);

  async function save() {
    const errs: Record<string, string> = {};
    const nextIso = dmyToIso(next);
    if (!dateIso || dateIso === 'invalid') errs.date = 'Use DD/MM/YYYY';
    else if (dateIso > isoToday()) errs.date = 'Can\'t be in the future';
    if (nextIso === 'invalid') errs.next = 'Use DD/MM/YYYY';
    else if (nextIso && dateIso && dateIso !== 'invalid' && nextIso <= dateIso) errs.next = 'Must be after the service date';
    if (odometer && !/^\d{1,7}$/.test(odometer)) errs.odometer = 'Whole km only';
    if (cost && !/^\d{1,8}$/.test(cost)) errs.cost = 'Whole rupees only';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setError(null);
    try {
      const body = {
        type: kind, date: dateIso, nextDueDate: nextIso || null,
        odometerKm: odometer ? Number(odometer) : null, garage: garage.trim() || null, cost: cost ? Number(cost) : null,
      };
      if (id) await api(`/devices/${deviceId}/service/${id}`, { method: 'PATCH', body });
      else await api(`/devices/${deviceId}/service`, { method: 'POST', body });
      await Promise.all([qc.invalidateQueries({ queryKey: ['service', deviceId] }), qc.invalidateQueries({ queryKey: ['devices'] })]);
      setSaved(true);
      setTimeout(() => router.back(), 0);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api(`/devices/${deviceId}/service/${id}`, { method: 'DELETE' });
      await Promise.all([qc.invalidateQueries({ queryKey: ['service', deviceId] }), qc.invalidateQueries({ queryKey: ['devices'] })]);
      setSaved(true);
      setConfirmDelete(false);
      setTimeout(() => router.back(), 0);
    } catch (e) {
      setError(errorText(e));
      setConfirmDelete(false);
    } finally {
      setBusy(false);
    }
  }

  const title = (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
      <Text style={[type.title, { color: c.text }]}>Service</Text>
      {device && <Plate value={`· ${plateOrName(device)}`} size={15} color={c.textMuted} />}
    </View>
  );

  if (!loaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
        <TopBar title={title} close onBack={() => router.back()} />
        {service.error ? <ErrorBox error={errorText(service.error)} /> : <Loading />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar title={title} close onBack={() => router.back()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: space.xs, gap: space.lg, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          <View style={styles.chips}>
            {SERVICE_TYPES.map((t) => (
              <Chip key={t.type} label={t.label} selected={kind === t.type} onPress={() => setKind(t.type)} />
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: space.md }}>
            <View style={{ flex: 1 }}>
              <Input label="Date" value={date} onChangeText={(t) => setDate(maskDate(t))} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} error={errors.date} />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Odometer (km)" value={odometer} onChangeText={(t) => setOdometer(t.replace(/\D/g, '').slice(0, 7))} placeholder="e.g. 97120" keyboardType="number-pad" error={errors.odometer} />
            </View>
          </View>
          <Input label="Garage" value={garage} onChangeText={setGarage} placeholder="e.g. KG Auto Care, Gandhipuram" maxLength={80} />
          <Input label="Cost (₹)" value={cost} onChangeText={(t) => setCost(t.replace(/\D/g, '').slice(0, 8))} placeholder="e.g. 7200" keyboardType="number-pad" error={errors.cost} />

          <View style={{ gap: space.sm }}>
            <Input label="Next service" value={next} onChangeText={(t) => setNext(maskDate(t))} placeholder="DD/MM/YYYY (optional)" keyboardType="number-pad" maxLength={10} error={errors.next} />
            <View style={styles.chips}>
              {picks.map(([iso, label]) => (
                <Chip key={label} label={`In ${label}`} outline selected={dmyToIso(next) === iso} onPress={() => setNext(isoToDmy(iso))} />
              ))}
              {next ? <Chip label="No reminder" outline onPress={() => setNext('')} /> : null}
            </View>
            <Text style={[type.small, { color: c.textMuted }]}>We'll show how long until the next service and flag it on Home when it's close.</Text>
          </View>

          <ErrorBox error={error} />

          {id && device?.role === 'owner' && (
            <Pressable onPress={() => setConfirmDelete(true)} accessibilityRole="button" style={styles.remove}>
              <Ionicons name="trash-outline" size={18} color={c.danger} />
              <Text style={[type.bodyStrong, { color: c.danger }]}>Delete record</Text>
            </Pressable>
          )}
        </ScrollView>
        <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
          <PillButton title="Save record" onPress={save} loading={busy} />
        </View>
      </KeyboardAvoidingView>

      <Dialog
        visible={confirmDelete}
        title="Delete this record?"
        message="It will be removed from the vehicle's service history."
        cancel="Keep"
        confirm="Delete"
        danger
        busy={busy}
        onCancel={() => setConfirmDelete(false)}
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

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  remove: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: space.sm },
});
