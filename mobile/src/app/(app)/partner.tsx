// Partner with us: dealers, installers, fleet owners and resellers send their details.
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, errorText } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { AppText, Button, Card, ErrorBox, Field, IconButton, Screen } from '@/components/ui';
import { GradientSweep } from '@/components/effects';
import { radius, space, useColors } from '@/theme';
import { brand } from '@/theme/colors';

type PartnerType = 'dealer' | 'installer' | 'fleet' | 'reseller' | 'other';
const TYPES: [PartnerType, string, keyof typeof Ionicons.glyphMap][] = [
  ['dealer', 'Dealer', 'storefront-outline'],
  ['installer', 'Installer', 'construct-outline'],
  ['fleet', 'Fleet owner', 'bus-outline'],
  ['reseller', 'Reseller', 'pricetags-outline'],
  ['other', 'Other', 'ellipsis-horizontal'],
];
const BENEFITS: [keyof typeof Ionicons.glyphMap, string][] = [
  ['cash-outline', 'Dealer pricing and margins on every tracker'],
  ['people-outline', 'Leads from customers in your city'],
  ['speedometer-outline', 'Fleet dashboard and bulk activation'],
  ['headset-outline', 'Priority support and installation training'],
];

export default function Partner() {
  const c = useColors();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', company: '', city: '', message: '' });
  const [type, setType] = useState<PartnerType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const trimmed = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() || undefined]));
      await api('/inquiries', { method: 'POST', body: { kind: 'partner', ...trimmed, partnerType: type } });
      setSent(true);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <IconButton icon="arrow-back" label="Back" onPress={() => router.back()} />
      <GradientSweep colors={[brand.aubergine, '#3A3A3A']} duration={5000} style={styles.hero}>
        <AppText variant="h1" color="#FFFFFF">Partner with us</AppText>
        <AppText color="#F2E6F0">Grow your business with Pavakie GPS trackers.</AppText>
        <View style={{ gap: space.sm, marginTop: space.sm }}>
          {BENEFITS.map(([icon, text]) => (
            <View key={text} style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
              <Ionicons name={icon} size={20} color={brand.marigold} />
              <AppText variant="small" color="#FFFFFF" style={{ flex: 1 }}>{text}</AppText>
            </View>
          ))}
        </View>
      </GradientSweep>

      {sent ? (
        <Card style={{ alignItems: 'center', gap: space.sm, paddingVertical: space.xl }}>
          <Ionicons name="checkmark-circle" size={56} color={c.success} />
          <AppText variant="h2" center>Thank you!</AppText>
          <AppText color="textMuted" center>Our partnerships team will call you on {form.phone} within 2 working days.</AppText>
          <Button title="Done" onPress={() => router.back()} />
        </Card>
      ) : (
        <Card style={{ gap: space.md }}>
          <AppText variant="h3">I am a…</AppText>
          <View style={styles.types}>
            {TYPES.map(([value, label, icon]) => {
              const on = type === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setType(value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  style={[styles.type, { backgroundColor: on ? c.accent : c.bg, borderColor: on ? c.accent : c.border }]}
                >
                  <Ionicons name={icon} size={18} color={on ? c.onAccent : c.text} />
                  <AppText variant="small" color={on ? c.onAccent : undefined}>{label}</AppText>
                </Pressable>
              );
            })}
          </View>
          <Field label="Your name" value={form.name} onChangeText={set('name')} autoComplete="name" />
          <Field label="Phone" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" autoComplete="tel" placeholder="+91 98765 43210" />
          <Field label="Email" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
          <Field label="Business name (optional)" value={form.company} onChangeText={set('company')} />
          <Field label="City" value={form.city} onChangeText={set('city')} />
          <Field label="Anything else? (optional)" value={form.message} onChangeText={set('message')} multiline numberOfLines={4} style={{ minHeight: 90, textAlignVertical: 'top' }} hint="e.g. how many vehicles or trackers per month" />
          <ErrorBox error={error} />
          <Button
            title="Send request"
            loading={busy}
            disabled={!type || !form.name.trim() || form.phone.replace(/\D/g, '').length < 7 || !form.email.trim() || !form.city.trim()}
            onPress={submit}
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.lg, padding: space.xl, gap: space.xs },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  type: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill, borderWidth: 1 },
});
