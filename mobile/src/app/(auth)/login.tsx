import { useState } from 'react';
import { View } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { api, ApiError, errorText } from '@/api/client';
import { AppText, Button, ErrorBox, Field } from '@/components/ui';
import { AuthScreen } from '@/components/AuthBackdrop';
import { BrandMark } from '@/components/Brand';
import { GoogleButton } from '@/components/GoogleButton';
import { space } from '@/theme';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
      // The root navigator switches to the app automatically.
    } catch (err) {
      setBusy(false);
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') {
        // Email never confirmed: send a fresh code and ask for it.
        await api('/auth/resend-verification', { method: 'POST', body: { email: email.trim() }, auth: false }).catch(() => {});
        router.push({ pathname: '/verify-email', params: { email: email.trim().toLowerCase() } });
        return;
      }
      setError(errorText(err));
    }
  }

  return (
    <AuthScreen>
        <View style={{ alignItems: 'center', marginVertical: space.xl }}>
          <BrandMark size={28} center />
        </View>
        <AppText variant="h1">Welcome back</AppText>
        <GoogleButton />
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" textContentType="password" onSubmitEditing={submit} />
        <ErrorBox error={error} />
        <Button title="Log in" onPress={submit} loading={busy} disabled={!email || !password} />
        <Button title="Forgot password?" variant="ghost" onPress={() => router.push('/forgot-password')} />
        <AppText color="textMuted" center>
          New here? <Link href="/register"><AppText variant="bodyStrong">Create an account</AppText></Link>
        </AppText>
    </AuthScreen>
  );
}
