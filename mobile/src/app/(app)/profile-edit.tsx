// Edit profile: name, phone, company (email is shown, not editable here).
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { api, errorText } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { Input, PillButton, TopBar } from '@/components/kit';
import { ErrorBox } from '@/components/ui';
import { space, type, useColors } from '@/theme';
import { initials } from '@/lib/format';

export default function ProfileEdit() {
  const c = useColors();
  const { user, reloadUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [company, setCompany] = useState(user?.company ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | undefined>();

  async function save() {
    if (phone.trim() && !/^\+?[0-9 ()-]{6,20}$/.test(phone.trim())) {
      setPhoneError('Enter a valid phone number');
      return;
    }
    setPhoneError(undefined);
    setBusy(true);
    setError(null);
    try {
      await api('/me', { method: 'PATCH', body: { ...(name.trim() && { name: name.trim() }), phone: phone.trim(), company: company.trim() } });
      await reloadUser();
      router.back();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar title="Edit profile" close onBack={() => router.back()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg }} keyboardShouldPersistTaps="handled">
          <View style={{ alignSelf: 'center', width: 96, height: 96, borderRadius: 48, backgroundColor: c.text, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[type.title, { color: c.bg, fontSize: 32, lineHeight: 40 }]}>{initials(name, user?.email)}</Text>
          </View>
          <Input label="Name" value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" maxLength={80} />
          <Input label="Email" value={user?.email ?? ''} editable={false} style={{ color: c.textMuted }} />
          <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+91 90000 00000" keyboardType="phone-pad" maxLength={20} error={phoneError} />
          <Input label="Company" value={company} onChangeText={setCompany} placeholder="Optional" maxLength={80} />
          <ErrorBox error={error} />
        </ScrollView>
        <View style={{ paddingHorizontal: space.lg, paddingBottom: space.md }}>
          <PillButton title="Save profile" onPress={save} loading={busy} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
