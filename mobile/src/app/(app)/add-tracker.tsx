// Add a tracker: scan the IMEI barcode on the box (or type it) + activation code.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { formatActivationCode } from '@/lib/format';
import { AppText, Button, ErrorBox, Field, Row, Screen } from '@/components/ui';
import { VehiclePicker } from '@/components/VehiclePicker';
import type { VehicleType } from '@/lib/vehicles';
import { radius, space, useColors } from '@/theme';

/** Pulls a 15-digit IMEI out of whatever the barcode contains. */
function extractImei(raw: string) {
  const match = raw.match(/\d{15}/);
  return match ? match[0] : null;
}

export default function AddTracker() {
  const c = useColors();
  const queryClient = useQueryClient();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [imei, setImei] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const { data } = await api('/devices/claim', {
        method: 'POST',
        body: { imei: imei.trim(), activationCode: code, name: name.trim() || undefined, vehicleType: vehicle },
      });
      await queryClient.invalidateQueries({ queryKey: ['devices'] });
      router.replace(`/device/${data.id}`);
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <AppText variant="h1">Add tracker</AppText>
        <Button title="Close" variant="ghost" small onPress={() => router.back()} />
      </Row>
      <AppText color="textMuted">Both numbers are printed on the tracker's box.</AppText>

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
            <AppText variant="bodyStrong" color="#FFFFFF" center>Point at the IMEI barcode</AppText>
          </View>
        </View>
      ) : (
        <Button title="Scan IMEI barcode" icon="barcode-outline" variant="secondary" onPress={startScan} />
      )}
      {scanning && <Button title="Type it instead" variant="ghost" onPress={() => setScanning(false)} />}

      <Field
        label="IMEI (15 digits)"
        value={imei}
        onChangeText={(v) => setImei(v.replace(/\D/g, '').slice(0, 15))}
        keyboardType="number-pad"
        style={{ fontFamily: undefined, letterSpacing: 1.5 }}
      />
      <Field
        label="Activation code"
        value={code}
        onChangeText={(v) => setCode(formatActivationCode(v))}
        autoCapitalize="characters"
        autoCorrect={false}
        placeholder="ABCDE-12345"
        style={{ letterSpacing: 2 }}
      />
      <VehiclePicker value={vehicle} onChange={setVehicle} />
      <Field label="Name (optional)" value={name} onChangeText={setName} placeholder="e.g. Family car" />
      <ErrorBox error={error} />
      <Button title="Add tracker" onPress={submit} loading={busy} disabled={imei.length !== 15 || code.replace('-', '').length !== 10} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  camera: { height: 260, borderRadius: radius.md, overflow: 'hidden', borderWidth: 3 },
  scanHint: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space.md },
});
