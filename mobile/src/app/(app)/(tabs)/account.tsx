// Profile: name, appearance, help (contact / partner), password, sessions, legal, delete account.
import { useState } from 'react';
import { Linking, View } from 'react-native';
import { router } from 'expo-router';
import { api, clearSession, errorText } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { API_URL, APP_VERSION } from '@/config';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AppText, Button, Card, ErrorBox, Field, Screen, Segmented, Wordmark } from '@/components/ui';
import { setThemePref, useThemePref, type ThemePref } from '@/theme/preference';
import { space } from '@/theme';

export default function Account() {
  const { user, reloadUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<'logoutAll' | 'delete' | null>(null);
  const [password, setPassword] = useState('');
  const themePref = useThemePref();

  async function saveName() {
    setError(null);
    setMessage(null);
    try {
      await api('/me', { method: 'PATCH', body: { name: name.trim() } });
      await reloadUser();
      setMessage('Name saved');
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <Screen>
      <AppText variant="h1">Profile</AppText>
      <Card style={{ gap: space.md }}>
        <AppText variant="caption" color="textMuted">SIGNED IN AS</AppText>
        <AppText variant="h3">{user?.email}</AppText>
        {user?.googleLinked && <AppText variant="small" color="textMuted">Signs in with Google</AppText>}
        <Field label="Name" value={name} onChangeText={setName} />
        <ErrorBox error={error} />
        {message && <AppText variant="small" color="success">{message}</AppText>}
        <Button title="Save name" small variant="secondary" disabled={!name.trim()} onPress={saveName} />
      </Card>

      <Card style={{ gap: space.sm }}>
        <AppText variant="h3">My fleet</AppText>
        <Button title="Vehicles" icon="car-sport-outline" variant="ghost" onPress={() => router.push('/vehicles')} style={{ justifyContent: 'flex-start' }} />
        <Button title="Drivers" icon="people-outline" variant="ghost" onPress={() => router.push('/drivers')} style={{ justifyContent: 'flex-start' }} />
      </Card>

      <Card style={{ gap: space.sm }}>
        <AppText variant="h3">Appearance</AppText>
        <AppText variant="small" color="textMuted">System follows your phone's dark theme setting.</AppText>
        <View style={{ marginHorizontal: -space.lg }}>
          <Segmented<ThemePref>
            value={themePref}
            options={[['system', 'System'], ['light', 'Light'], ['dark', 'Dark']]}
            onChange={(p) => setThemePref(p)}
          />
        </View>
      </Card>

      <Card style={{ gap: space.sm }}>
        <AppText variant="h3">Help & business</AppText>
        <Button title="Contact us" icon="chatbubbles-outline" variant="ghost" onPress={() => router.push('/contact')} style={{ justifyContent: 'flex-start' }} />
        <Button title="Partner with us" icon="briefcase-outline" variant="ghost" onPress={() => router.push('/partner')} style={{ justifyContent: 'flex-start' }} />
      </Card>

      <Card style={{ gap: space.sm }}>
        <Button title={user?.hasPassword === false ? 'Set a password' : 'Change password'} icon="key-outline" variant="ghost" onPress={() => router.push('/change-password')} style={{ justifyContent: 'flex-start' }} />
        <Button title="Log out" icon="log-out-outline" variant="ghost" onPress={logout} style={{ justifyContent: 'flex-start' }} />
        <Button title="Log out on all devices" icon="phone-portrait-outline" variant="ghost" onPress={() => setConfirm('logoutAll')} style={{ justifyContent: 'flex-start' }} />
      </Card>

      <Card style={{ gap: space.sm }}>
        <Button title="Privacy policy" icon="shield-checkmark-outline" variant="ghost" onPress={() => Linking.openURL(`${API_URL}/privacy`)} style={{ justifyContent: 'flex-start' }} />
        <Button title="Terms of service" icon="document-text-outline" variant="ghost" onPress={() => Linking.openURL(`${API_URL}/terms`)} style={{ justifyContent: 'flex-start' }} />
        <Button title="Delete my account" icon="trash-outline" variant="danger" onPress={() => setConfirm('delete')} />
      </Card>

      <View style={{ alignItems: 'center', gap: 4, marginTop: space.lg }}>
        <Wordmark size={34} />
        <AppText variant="caption" color="textMuted">VERSION {APP_VERSION}</AppText>
      </View>

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
    </Screen>
  );
}
