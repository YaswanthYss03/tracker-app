// Public live view for a share link (works without logging in).
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { io } from 'socket.io-client';
import { api, errorText } from '@/api/client';
import type { Live } from '@/api/types';
import { API_URL } from '@/config';
import { dateTime, timeAgo } from '@/lib/format';
import { AppMap } from '@/components/Map';
import { AppText, Card, ErrorBox, IconButton, Loading, Pill, Row } from '@/components/ui';
import { radius, space, useColors } from '@/theme';

export default function ShareView() {
  const c = useColors();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [info, setInfo] = useState<{ name: string | null; expiresAt: string; live: Partial<Live> } | null>(null);
  const [live, setLive] = useState<Partial<Live> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api(`/public/share/${token}`, { auth: false }).then((r) => setInfo(r.data)).catch((e) => setError(errorText(e)));
    const socket = io(API_URL, { auth: { shareToken: token }, transports: ['websocket'] });
    socket.on('live', setLive);
    socket.on('connect_error', (err: any) => {
      if (err?.data?.code === 'SHARE_LINK_INVALID') setError('This link has expired or was revoked.');
    });
    socket.on('session_expired', () => setError('This link has expired.'));
    return () => {
      socket.close();
    };
  }, [token]);

  const state = live || info?.live;
  const pos = state?.lat != null && state?.lon != null ? { lat: state.lat, lon: state.lon } : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <Row style={{ padding: space.lg, flexWrap: 'nowrap' }}>
        <IconButton icon="close" label="Close" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
        <AppText variant="h2" numberOfLines={1} style={{ flex: 1 }}>{info?.name || 'Shared location'}</AppText>
      </Row>
      {error ? (
        <View style={{ padding: space.lg }}><ErrorBox error={error} /></View>
      ) : !info ? (
        <Loading />
      ) : (
        <View style={{ flex: 1, padding: space.lg, gap: space.md }}>
          <Card style={{ gap: 6 }}>
            <Row>
              <Pill label={state?.online ? 'Online' : 'Offline'} tone={state?.online ? 'ok' : 'offline'} />
              <AppText variant="bodyStrong">{state?.speed ?? 0} km/h</AppText>
            </Row>
            <AppText variant="small" color="textMuted">Updated {timeAgo(state?.gpsTime)} · link expires {dateTime(info.expiresAt)}</AppText>
          </Card>
          <View style={[styles.mapBox, { borderColor: c.border }]}>
            <AppMap
              initialCenter={pos || undefined}
              initialZoom={16}
              markers={pos ? [{ id: 'shared', ...pos, heading: state?.heading, online: state?.online }] : []}
              follow={pos}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapBox: { flex: 1, borderRadius: radius.md, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
});
