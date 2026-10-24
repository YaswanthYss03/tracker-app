import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/auth/AuthProvider';
import { errorText } from '@/api/client';
import { API_URL } from '@/config';
import { AppText, Button, ErrorBox, Field, Row, Screen } from '@/components/ui';
import { GoogleButton } from '@/components/GoogleButton';
import { useColors } from '@/theme';

export default function Register() {
  const { register } = useAuth();
  const c = useColors();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const result = await register({ email: form.email.trim(), password: form.password, name: form.name.trim() || undefined, acceptTerms: accepted });
      if ('verificationRequired' in result) {
        setBusy(false);
        router.push({ pathname: '/verify-email', params: { email: result.email } });
      }
      // Otherwise the root navigator switches to the app automatically.
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  }

  return (
    <Screen>
      <AppText variant="h1">Create account</AppText>
      <AppText color="textMuted">Add your tracker right after signing up.</AppText>
      <GoogleButton signUp />
      <Field label="Name" value={form.name} onChangeText={set('name')} autoComplete="name" />
      <Field label="Email" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Field label="Password" value={form.password} onChangeText={set('password')} secureTextEntry autoComplete="new-password" hint="At least 8 characters" />
      <Pressable onPress={() => setAccepted(!accepted)} accessibilityRole="checkbox" accessibilityState={{ checked: accepted }}>
        <Row style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <Ionicons name={accepted ? 'checkbox' : 'square-outline'} size={26} color={accepted ? c.text : c.textMuted} />
          <View style={{ flex: 1 }}>
            <AppText variant="small">
              I agree to the Terms of Service and Privacy Policy, including storing my vehicle's location history.
            </AppText>
            <Row gap={16} style={{ marginTop: 6 }}>
              <Pressable onPress={() => Linking.openURL(`${API_URL}/terms`)} hitSlop={8}>
                <AppText variant="caption" style={{ textDecorationLine: 'underline' }}>TERMS</AppText>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(`${API_URL}/privacy`)} hitSlop={8}>
                <AppText variant="caption" style={{ textDecorationLine: 'underline' }}>PRIVACY POLICY</AppText>
              </Pressable>
            </Row>
          </View>
        </Row>
      </Pressable>
      <ErrorBox error={error} />
      <Button title="Create account" onPress={submit} loading={busy} disabled={!form.email || form.password.length < 8 || !accepted} />
      <AppText color="textMuted" center>
        Already have an account? <Link href="/login"><AppText variant="bodyStrong">Log in</AppText></Link>
      </AppText>
    </Screen>
  );
}
