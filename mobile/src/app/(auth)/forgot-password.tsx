// Forgot password: email -> 6-digit code -> new password.
import { useState } from 'react';
import { router } from 'expo-router';
import { api, errorText } from '@/api/client';
import { AppText, Button, ErrorBox, Field, Screen } from '@/components/ui';

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'code' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  if (step === 'done') {
    return (
      <Screen>
        <AppText variant="h1">Password changed</AppText>
        <AppText color="textMuted">You can now log in with your new password.</AppText>
        <Button title="Log in" onPress={() => router.replace('/login')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="h1">Reset password</AppText>
      {step === 'email' ? (
        <>
          <AppText color="textMuted">Enter your account email. We'll send you a 6-digit code.</AppText>
          <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
          <ErrorBox error={error} />
          <Button
            title="Send code"
            loading={busy}
            disabled={!email}
            onPress={() => run(async () => {
              await api('/auth/forgot-password', { method: 'POST', body: { email: email.trim() }, auth: false });
              setStep('code');
            })}
          />
        </>
      ) : (
        <>
          <AppText color="textMuted">If an account exists for {email}, a code is on its way. It expires in 15 minutes.</AppText>
          <Field label="6-digit code" value={code} onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" autoComplete="one-time-code" />
          <Field label="New password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" hint="At least 8 characters" />
          <ErrorBox error={error} />
          <Button
            title="Set new password"
            loading={busy}
            disabled={code.length !== 6 || password.length < 8}
            onPress={() => run(async () => {
              await api('/auth/reset-password', { method: 'POST', body: { email: email.trim(), code, newPassword: password }, auth: false });
              setStep('done');
            })}
          />
          <Button title="Send a new code" variant="ghost" onPress={() => setStep('email')} />
        </>
      )}
    </Screen>
  );
}
