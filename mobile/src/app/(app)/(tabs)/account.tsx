// Profile: who I am (edit), counts (vehicles, drivers, new alerts), alert
// settings and map options, then appearance, help, account and legal.
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, clearSession, errorText } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { API_URL, APP_VERSION } from '@/config';
import { useTrackers } from '@/live/TrackersProvider';
import { useDrivers } from '@/lib/drivers';
import { useUnreadAlerts } from '@/lib/alertsSeen';
import { initials } from '@/lib/format';
import { setPref, usePref } from '@/lib/prefs';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Card, RoundButton, Toggle, accentTint } from '@/components/kit';
import { ErrorBox, Field, Segmented, Wordmark } from '@/components/ui';
import { setThemePref, useThemePref, type ThemePref } from '@/theme/preference';
import { radius, shadow, space, type, useColors } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;
type AlertKey = 'offline' | 'longStop' | 'gpsLost' | 'quietHours';

export default function Account() {
  const c = useColors();
  const { user, reloadUser, logout } = useAuth();
  const { devices } = useTrackers();
  const { data: drivers = [] } = useDrivers();
  const unread = useUnreadAlerts();
  const platesOnMap = usePref('platesOnMap');
  const themePref = useThemePref();
  const [alerts, setAlerts] = useState(user?.alerts ?? { offline: true, longStop: true, gpsLost: true, quietHours: false });
  const [error, setError] = useState<string | null>(null);
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<'logoutAll' | 'delete' | null>(null);
  const [password, setPassword] = useState('');

  async function setAlert(key: AlertKey, value: boolean) {
    setAlerts((a) => ({ ...a, [key]: value }));
    setError(null);
    try {
      await api('/me', { method: 'PATCH', body: { alerts: { [key]: value } } });
      reloadUser();
    } catch (e) {
      setAlerts((a) => ({ ...a, [key]: !value }));
      setError(errorText(e));
    }
  }

  async function testPush() {
    setTestMsg('Sending…');
    try {
      const { data } = await api<{ data: { sent: number; phones: number } }>('/me/push-test', { method: 'POST' });
      setTestMsg(data.sent ? 'Sent. It should arrive in a few seconds.' : 'No phone is registered for notifications yet. Allow notifications for Pavakie and try again.');
    } catch (e) {
      setTestMsg(errorText(e));
    }
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: 48 }}>
        {/* Who */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: c.text }]}>
            <Text style={[type.title, { color: c.bg, fontSize: 22 }]}>{initials(user?.name, user?.email)}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={[type.title, { color: c.text }]}>{user?.name || 'Add your name'}</Text>
            <Text numberOfLines={1} style={[type.small, { color: c.textMuted }]}>{user?.email}</Text>
          </View>
          <RoundButton icon="create-outline" label="Edit profile" onPress={() => router.push('/profile-edit')} size={44} iconSize={20} />
        </View>

        {/* Counts */}
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <CountTile icon="car-sport-outline" value={devices.length} label="Vehicles" onPress={() => router.push('/vehicles')} />
          <CountTile icon="people-outline" value={drivers.length} label="Drivers" onPress={() => router.push('/drivers')} />
          <CountTile icon="warning-outline" value={unread} label="New alerts" onPress={() => router.push('/alerts')} />
        </View>

        <Card padded={false}>
          <Row icon="phone-portrait-outline" label="Send a test notification" onPress={testPush} last />
        </Card>
        {testMsg && <Text style={[type.small, { color: c.textMuted, marginTop: -space.sm }]}>{testMsg}</Text>}

        {/* Alerts and map */}
        <Card padded={false}>
          <ToggleRow icon="cloud-offline-outline" label="Offline alerts" value={alerts.offline} onChange={(v) => setAlert('offline', v)} />
          <ToggleRow icon="hourglass-outline" label="Long-stop alerts" sub="Parked for 4 hours or more" value={alerts.longStop} onChange={(v) => setAlert('longStop', v)} />
          <ToggleRow icon="locate-outline" label="GPS-lost alerts" sub="Ignition on but no location for 15 min" value={alerts.gpsLost} onChange={(v) => setAlert('gpsLost', v)} />
          <ToggleRow icon="moon-outline" label="Quiet hours (10 PM–7 AM)" sub="SOS and power cut still come through" value={alerts.quietHours} onChange={(v) => setAlert('quietHours', v)} />
          <ToggleRow icon="pricetag-outline" label="Plates on map" value={platesOnMap} onChange={(v) => setPref('platesOnMap', v)} last />
        </Card>
        <ErrorBox error={error} />

        <Card style={{ gap: space.sm }}>
          <Text style={[type.fieldLabel, { color: c.text }]}>Appearance</Text>
          <View style={{ marginHorizontal: -space.lg }}>
            <Segmented<ThemePref> value={themePref} options={[['system', 'System'], ['light', 'Light'], ['dark', 'Dark']]} onChange={(p) => setThemePref(p)} />
          </View>
        </Card>

        <Card padded={false}>
          <Row icon="car-sport-outline" label="Vehicles" onPress={() => router.push('/vehicles')} />
          <Row icon="people-outline" label="Drivers" onPress={() => router.push('/drivers')} />
          <Row icon="chatbubbles-outline" label="Contact us" onPress={() => router.push('/contact')} />
          <Row icon="briefcase-outline" label="Partner with us" onPress={() => router.push('/partner')} last />
        </Card>

        <Card padded={false}>
          <Row icon="key-outline" label={user?.hasPassword === false ? 'Set a password' : 'Change password'} onPress={() => router.push('/change-password')} />
          <Row icon="log-out-outline" label="Log out" onPress={logout} />
          <Row icon="phone-portrait-outline" label="Log out on all devices" onPress={() => setConfirm('logoutAll')} last />
        </Card>

        <Card padded={false}>
          <Row icon="shield-checkmark-outline" label="Privacy policy" onPress={() => Linking.openURL(`${API_URL}/privacy`)} />
          <Row icon="document-text-outline" label="Terms of service" onPress={() => Linking.openURL(`${API_URL}/terms`)} />
          <Row icon="trash-outline" label="Delete my account" danger onPress={() => setConfirm('delete')} last />
        </Card>

        <View style={{ alignItems: 'center', gap: 4, marginTop: space.sm }}>
          <Wordmark size={34} />
          <Text style={[type.caption, { color: c.textMuted }]}>VERSION {APP_VERSION}</Text>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirm === 'logoutAll'}
        title="Log out everywhere"
        message="You'll be logged out on every phone and browser, including this one."
        confirmLabel="Log out all"
        onConfirm={async () => {
          await api('/me/logout-all', { method: 'POST' });
          await clearSession();
        }}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        visible={confirm === 'delete'}
        title="Delete account"
        message="This can't be undone. Trackers you own are released and their history is deleted."
        confirmLabel="Delete account"
        danger
        onConfirm={async () => {
          await api('/me', { method: 'DELETE', body: user?.hasPassword === false ? { confirmEmail: password } : { password } });
          await clearSession();
        }}
        onClose={() => {
          setConfirm(null);
          setPassword('');
        }}
      >
        {user?.hasPassword === false ? (
          <Field label="Type your email to confirm" value={password} onChangeText={setPassword} autoCapitalize="none" keyboardType="email-address" />
        ) : (
          <Field label="Your password" value={password} onChangeText={setPassword} secureTextEntry />
        )}
      </ConfirmDialog>
    </SafeAreaView>
  );
}

function CountTile({ icon, value, label, onPress }: { icon: IconName; value: number; label: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${value} ${label}`} style={({ pressed }) => [styles.tile, { backgroundColor: c.surface, opacity: pressed ? 0.9 : 1 }, shadow.card]}>
      <Ionicons name={icon} size={22} color={c.text} />
      <Text style={[type.number, { color: c.text, fontSize: 26, lineHeight: 32 }]}>{value}</Text>
      <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{label}</Text>
    </Pressable>
  );
}

function Row({ icon, label, onPress, danger, last }: { icon: IconName; label: string; onPress: () => void; danger?: boolean; last?: boolean }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: danger ? c.dangerSoft : accentTint }]}>
        <Ionicons name={icon} size={18} color={danger ? c.danger : c.text} />
      </View>
      <Text style={[type.body, { color: danger ? c.danger : c.text, flex: 1 }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
    </Pressable>
  );
}

function ToggleRow({ icon, label, sub, value, onChange, last }: { icon: IconName; label: string; sub?: string; value: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  const c = useColors();
  return (
    <View style={[styles.row, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: accentTint }]}>
        <Ionicons name={icon} size={18} color={c.text} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[type.body, { color: c.text }]}>{label}</Text>
        {sub ? <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{sub}</Text> : null}
      </View>
      <Toggle value={value} onChange={onChange} label={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  tile: { flex: 1, padding: space.md, borderRadius: radius.card, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, minHeight: 56, paddingVertical: space.sm },
  rowIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
