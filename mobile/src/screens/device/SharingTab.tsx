// Sharing (owner): family/viewers by email + temporary live links via the share sheet.
import { useState } from 'react';
import { ScrollView, Share, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import type { Member } from '@/api/types';
import { API_URL } from '@/config';
import { dateTime } from '@/lib/format';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AppText, Button, Card, Divider, ErrorBox, Field, Loading, Pill, Row, Segmented } from '@/components/ui';
import { space } from '@/theme';
import type { TabProps } from './types';

const DURATIONS: [string, string][] = [['60', '1 hour'], ['240', '4 hours'], ['1440', '1 day'], ['10080', '7 days']];

export function SharingTab({ device }: TabProps) {
  const members = useQuery({ queryKey: ['members', device.id], queryFn: () => api<{ data: Member[] }>(`/devices/${device.id}/members`) });
  const links = useQuery({
    queryKey: ['share-links', device.id],
    queryFn: () => api<{ data: { token: string; expiresAt: string }[] }>(`/devices/${device.id}/share-links`),
  });
  const [email, setEmail] = useState('');
  const [minutes, setMinutes] = useState('60');
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Member | null>(null);
  const linkUrl = (token: string) => `${API_URL}/share/${token}`;

  async function addViewer() {
    setError(null);
    try {
      await api(`/devices/${device.id}/viewers`, { method: 'POST', body: { email: email.trim() } });
      setEmail('');
      members.refetch();
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function createLink() {
    setError(null);
    try {
      const { data } = await api(`/devices/${device.id}/share-links`, { method: 'POST', body: { expiresInMinutes: Number(minutes) } });
      links.refetch();
      await Share.share({ message: `Live location of ${device.name || 'my vehicle'}: ${linkUrl(data.token)}` });
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: 48 }}>
      <Card style={{ gap: space.md }}>
        <AppText variant="h3">Family & friends</AppText>
        <AppText variant="small" color="textMuted">They need an account. Viewers see location, history and alerts but can't change settings.</AppText>
        <Field label="Their account email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Button title="Share" icon="person-add-outline" small disabled={!email.includes('@')} onPress={addViewer} />
        <Divider />
        {members.isLoading ? <Loading /> : (members.data?.data || []).map((m) => (
          <Row key={m.userId} style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong" numberOfLines={1}>{m.name || m.email}</AppText>
              <AppText variant="small" color="textMuted" numberOfLines={1}>{m.email}</AppText>
            </View>
            {m.role === 'owner' ? <Pill label="Owner" tone="accent" /> : <Button title="Remove" variant="danger" small onPress={() => setRemoving(m)} />}
          </Row>
        ))}
      </Card>

      <Card style={{ gap: space.md }}>
        <AppText variant="h3">Live location link</AppText>
        <AppText variant="small" color="textMuted">Anyone with the link sees the live position only, until it expires.</AppText>
        <View style={{ marginHorizontal: -space.lg }}>
          <Segmented value={minutes} options={DURATIONS} onChange={setMinutes} />
        </View>
        <Button title="Create & share link" icon="share-social-outline" small onPress={createLink} />
        {(links.data?.data || []).map((l) => (
          <Row key={l.token} style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <View style={{ flex: 1 }}>
              <AppText variant="small" numberOfLines={1}>{linkUrl(l.token)}</AppText>
              <AppText variant="caption" color="textMuted">EXPIRES {dateTime(l.expiresAt).toUpperCase()}</AppText>
            </View>
            <Button
              title="Revoke"
              variant="danger"
              small
              onPress={async () => {
                await api(`/devices/${device.id}/share-links/${l.token}`, { method: 'DELETE' });
                links.refetch();
              }}
            />
          </Row>
        ))}
      </Card>
      <ErrorBox error={error} />

      <ConfirmDialog
        visible={Boolean(removing)}
        title="Remove access"
        message={`${removing?.email} will no longer see this tracker.`}
        confirmLabel="Remove"
        danger
        onConfirm={async () => {
          await api(`/devices/${device.id}/members/${removing!.userId}`, { method: 'DELETE' });
          members.refetch();
        }}
        onClose={() => setRemoving(null)}
      />
    </ScrollView>
  );
}
