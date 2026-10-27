// Live: map following the vehicle, big speed, status, ask the tracker, navigate, share.
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { api, errorText } from '@/api/client';
import { dateTime, timeAgo } from '@/lib/format';
import { AppMap } from '@/components/Map';
import { ExpandableMap } from '@/components/ExpandableMap';
import { AppText, Button, Card, ErrorBox, Row, StatCard } from '@/components/ui';
import { radius, space, useColors } from '@/theme';
import type { TabProps } from './types';
import { GlowSweep } from '@/components/effects';
import { shareLiveLocation } from '@/lib/share';

export function LiveTab({ device, state, isOwner }: TabProps) {
  const c = useColors();
  const hasPos = state.lat != null && state.lon != null;

  const shareLive = () => shareLiveLocation(device);

  return (
    <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: 48 }}>
      <ExpandableMap height={250}>
        <AppMap
          initialCenter={hasPos ? { lat: state.lat!, lon: state.lon! } : undefined}
          initialZoom={16}
          markers={hasPos ? [{ id: device.id, lat: state.lat!, lon: state.lon!, heading: state.heading, online: state.online, vehicle: device.icon }] : []}
          follow={hasPos ? { lat: state.lat!, lon: state.lon! } : null}
        />
      </ExpandableMap>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg, overflow: 'hidden' }}>
        {state.online && <GlowSweep />}
        <View style={{ alignItems: 'center' }}>
          <AppText variant="displayXL">{state.speed ?? 0}</AppText>
          <AppText variant="label" color="textMuted">KM/H</AppText>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="bodyStrong">{state.online ? (state.speed ? 'Moving' : 'Stopped') : 'Offline'}</AppText>
          <AppText variant="small" color="textMuted">Last contact {timeAgo(state.lastSeenAt)}</AppText>
          <AppText variant="small" color="textMuted">Position {dateTime(state.gpsTime)}</AppText>
        </View>
      </Card>

      <Row gap={space.md}>
        <StatCard value={state.batteryPercent ?? '—'} unit={state.batteryPercent != null ? '%' : undefined} label={state.externalPower ? 'Battery · charging' : 'Battery'} />
        <StatCard value={state.gsmSignal != null ? `${state.gsmSignal}/4` : '—'} label="Signal" />
        <StatCard value={state.satellites ?? '—'} label="Satellites" />
        <StatCard value={state.heading != null ? `${state.heading}°` : '—'} label="Heading" />
      </Row>

      <Row gap={space.md}>
        <Button
          title="Navigate"
          icon="navigate-outline"
          variant="secondary"
          disabled={!hasPos}
          onPress={() => Linking.openURL(`google.navigation:q=${state.lat},${state.lon}`).catch(() => Linking.openURL(`https://www.google.com/maps?q=${state.lat},${state.lon}`))}
          style={{ flex: 1 }}
        />
        {isOwner && <Button title="Share live" icon="share-social-outline" variant="secondary" onPress={() => shareLive().catch(() => {})} style={{ flex: 1 }} />}
      </Row>

      {isOwner && <AskTracker deviceId={device.id} online={state.online} />}
    </ScrollView>
  );
}

function AskTracker({ deviceId, online }: { deviceId: string; online: boolean }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send(type: 'locate' | 'status') {
    setBusy(type);
    setReply(null);
    setError(null);
    try {
      const { data } = await api(`/devices/${deviceId}/commands`, { method: 'POST', body: { type } });
      setReply(data.response);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card style={{ gap: space.md }}>
      <AppText variant="h3">Ask the tracker</AppText>
      <Row gap={space.sm}>
        <Button title="Where are you?" small variant="secondary" loading={busy === 'locate'} disabled={!online || Boolean(busy)} onPress={() => send('locate')} />
        <Button title="Status" small variant="secondary" loading={busy === 'status'} disabled={!online || Boolean(busy)} onPress={() => send('status')} />
      </Row>
      {!online && <AppText variant="small" color="textMuted">Available while the tracker is online.</AppText>}
      {reply && <AppText variant="small" style={{ fontFamily: undefined }}>{reply}</AppText>}
      <ErrorBox error={error} />
    </Card>
  );
}

const styles = StyleSheet.create({
  mapBox: { height: 300, borderRadius: radius.md, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
});
