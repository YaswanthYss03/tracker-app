// Sign-up step 2: enter the 6-digit code we emailed.
import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View, type TextInputInstance } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/auth/AuthProvider';
import { api, errorText } from '@/api/client';
import { AppText, Button, ErrorBox, Screen } from '@/components/ui';
import { fonts } from '@/theme/typography';
import { radius, space, useColors } from '@/theme';

const LENGTH = 6;
const RESEND_AFTER_S = 30;

export default function VerifyEmail() {
  const { email = '' } = useLocalSearchParams<{ email: string }>();
  const { verifyEmail } = useAuth();
  const c = useColors();
  const input = useRef<TextInputInstance>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(RESEND_AFTER_S);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function submit(value = code) {
    if (value.length !== LENGTH || busy) return;
    setBusy(true);
    setError(null);
    try {
      await verifyEmail(email, value);
      // Logged in: the root navigator switches to the app.
    } catch (err) {
      setError(errorText(err));
      setCode('');
      setBusy(false);
      input.current?.focus();
    }
  }

  async function resend() {
    setError(null);
    setInfo(null);
    try {
      await api('/auth/resend-verification', { method: 'POST', body: { email }, auth: false });
      setInfo('A new code is on its way.');
      setWait(RESEND_AFTER_S);
    } catch (err) {
      setError(errorText(err));
    }
  }

  function onChange(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, LENGTH);
    setCode(digits);
    if (digits.length === LENGTH) submit(digits);
  }

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: space.xl, gap: space.md }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="mail-open-outline" size={40} color={c.onAccent} />
        </View>
        <AppText variant="h1" center>Check your email</AppText>
        <AppText color="textMuted" center>
          We sent a 6-digit code to{'\n'}
          <AppText variant="bodyStrong">{email}</AppText>
        </AppText>
      </View>

      {/* One hidden input; the boxes just show its digits. */}
      <Pressable onPress={() => input.current?.focus()} accessibilityLabel="Verification code">
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: space.lg }}>
          {Array.from({ length: LENGTH }, (_, i) => {
            const active = i === code.length && !busy;
            return (
              <View
                key={i}
                style={{
                  width: 46,
                  height: 58,
                  borderRadius: radius.md,
                  borderWidth: active ? 2 : 1,
                  borderColor: active ? c.accent : c.border,
                  backgroundColor: c.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppText style={{ fontFamily: fonts.bold, fontSize: 26 }}>{code[i] ?? ''}</AppText>
              </View>
            );
          })}
        </View>
        <TextInput
          ref={input}
          value={code}
          onChangeText={onChange}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          maxLength={LENGTH}
          autoFocus
          style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        />
      </Pressable>

      <ErrorBox error={error} />
      {info && <AppText color="textMuted" center>{info}</AppText>}
      <Button title="Verify and continue" onPress={() => submit()} loading={busy} disabled={code.length !== LENGTH} />
      <Button
        title={wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'}
        variant="ghost"
        disabled={wait > 0}
        onPress={resend}
      />
      <Button title="Use a different email" variant="ghost" onPress={() => router.back()} />
      <AppText variant="small" color="textMuted" center>Can't find it? Check your spam folder. The code expires in 15 minutes.</AppText>
    </Screen>
  );
}
