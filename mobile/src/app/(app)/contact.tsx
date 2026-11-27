// Contact us: call / WhatsApp / email buttons (from the server's settings) + a message form.
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, errorText } from '@/api/client';
import { API_URL } from '@/config';
import { useAuth } from '@/auth/AuthProvider';
import { useAppConfig } from '@/lib/appConfig';
import { AppText, Button, Card, ErrorBox, Field, IconButton, Screen } from '@/components/ui';
import { radius, space, useColors } from '@/theme';

export default function Contact() {
  const c = useColors();
  const { user } = useAuth();
  const support = useAppConfig()?.support || {};
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const digits = (s: string) => s.replace(/[^\d+]/g, '');
  const channels = [
    support.phone && { icon: 'call-outline' as const, label: 'Call us', value: support.phone, url: `tel:${digits(support.phone)}` },
    support.whatsapp && { icon: 'logo-whatsapp' as const, label: 'WhatsApp', value: support.whatsapp, url: `https://wa.me/${digits(support.whatsapp).replace('+', '')}` },
    support.email && { icon: 'mail-outline' as const, label: 'Email', value: support.email, url: `mailto:${support.email}` },
  ].filter(Boolean) as { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; url: string }[];

  async function send() {
    setBusy(true);
    setError(null);
    try {
      await api('/inquiries', { method: 'POST', body: { kind: 'contact', name: name.trim(), email: email.trim(), message: message.trim() } });
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
      <AppText variant="h1">Contact us</AppText>
      <AppText color="textMuted">Questions about your tracker, billing or the app? We're happy to help.</AppText>

      {channels.length > 0 && (
        <View style={{ gap: space.sm }}>
          {channels.map((ch) => (
            <Pressable
              key={ch.label}
              onPress={() => Linking.openURL(ch.url).catch(() => {})}
              style={({ pressed }) => [styles.channel, { backgroundColor: c.surface, borderColor: c.border, opacity: pressed ? 0.8 : 1 }]}
            >
              <View style={[styles.channelIcon, { backgroundColor: c.accent }]}>
                <Ionicons name={ch.icon} size={22} color={c.onAccent} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{ch.label}</AppText>
                <AppText variant="small" color="textMuted">{ch.value}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
            </Pressable>
          ))}
        </View>
      )}
      {support.address ? (
        <Card style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
          <Ionicons name="location-outline" size={22} color={c.text} />
          <AppText variant="small" style={{ flex: 1 }}>{support.address}</AppText>
        </Card>
      ) : null}

      <Card style={{ gap: space.md }}>
        <AppText variant="h3">Send us a message</AppText>
        {sent ? (
          <View style={{ alignItems: 'center', gap: space.sm, paddingVertical: space.md }}>
            <Ionicons name="checkmark-circle" size={48} color={c.success} />
            <AppText variant="bodyStrong" center>Message sent</AppText>
            <AppText variant="small" color="textMuted" center>We'll reply to {email} soon.</AppText>
          </View>
        ) : (
          <>
            <Field label="Name" value={name} onChangeText={setName} autoComplete="name" />
            <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
            <Field label="Message" value={message} onChangeText={setMessage} multiline numberOfLines={5} style={{ minHeight: 110, textAlignVertical: 'top' }} />
            <ErrorBox error={error} />
            <AppText variant="caption" color="textMuted">We use your name and email only to reply to this message. See our <Text onPress={() => Linking.openURL(`${API_URL}/privacy`)} accessibilityRole="link" style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>.</AppText>
            <Button title="Send message" icon="send-outline" loading={busy} disabled={!name.trim() || !email.trim() || message.trim().length < 5} onPress={send} />
          </>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  channel: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  channelIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
