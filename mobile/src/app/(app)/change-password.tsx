// Change password — or, for Google accounts without one, set a password with an emailed code.
import { useState } from 'react';
import { router } from 'expo-router';
import { api, clearSession, errorText } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { AppText, Button, ErrorBox, Field, IconButton, Screen } from '@/components/ui';

export default function ChangePassword() {
  const { user } = useAuth();
  const setMode = user?.hasPassword === false;
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
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

  if (setMode) {
    return (
      <Screen>
        <IconButton icon="arrow-back" label="Back" onPress={() => router.back()} />
        <AppText variant="h1">Set a password</AppText>
        <AppText color="textMuted">
          You sign in with Google. A password lets you log in with your email too. We'll email a 6-digit code to {user?.email}.
        </AppText>
        {!codeSent ? (
          <Button
            title="Email me a code"
            loading={busy}
            onPress={() => run(async () => {
              await api('/auth/forgot-password', { method: 'POST', body: { email: user!.email }, auth: false });
              setCodeSent(true);
            })}
          />
        ) : (
          <>
            <Field label="6-digit code" value={code} onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" autoComplete="one-time-code" />
            <Field label="New password" value={next} onChangeText={setNext} secureTextEntry autoComplete="new-password" hint="At least 8 characters" />
            <ErrorBox error={error} />
            <Button
              title="Set password"
              loading={busy}
              disabled={code.length !== 6 || next.length < 8}
              onPress={() => run(async () => {
                await api('/auth/reset-password', { method: 'POST', body: { email: user!.email, code, newPassword: next }, auth: false });
                await clearSession(); // sessions are revoked: log in again
              })}
            />
          </>
        )}
        {!codeSent && <ErrorBox error={error} />}
      </Screen>
    );
  }

  return (
    <Screen>
      <IconButton icon="arrow-back" label="Back" onPress={() => router.back()} />
      <AppText variant="h1">Change password</AppText>
      <AppText color="textMuted">You'll be logged out everywhere and log in again with the new password.</AppText>
      <Field label="Current password" value={current} onChangeText={setCurrent} secureTextEntry autoComplete="password" />
      <Field label="New password" value={next} onChangeText={setNext} secureTextEntry autoComplete="new-password" hint="At least 8 characters" />
      <ErrorBox error={error} />
      <Button
        title="Change password"
        loading={busy}
        disabled={!current || next.length < 8}
        onPress={() => run(async () => {
          await api('/me/password', { method: 'POST', body: { currentPassword: current, newPassword: next } });
          await clearSession(); // all sessions are revoked: log in again with the new password
        })}
      />
    </Screen>
  );
}
