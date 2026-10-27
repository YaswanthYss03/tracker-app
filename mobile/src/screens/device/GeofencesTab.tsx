// Geofences: circles on the map; owners long-press to place a new one.
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import type { Geofence } from '@/api/types';
import { brand } from '@/theme/colors';
import { AppMap } from '@/components/Map';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AppText, Button, Card, ErrorBox, Field, IconButton, Row } from '@/components/ui';
import { fonts } from '@/theme';
import { radius, space, useColors } from '@/theme';
import type { TabProps } from './types';

type Draft = { lat: number | null; lon: number | null; radiusM: number; name: string };

export function GeofencesTab({ device, state, isOwner }: TabProps) {
  const c = useColors();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['geofences', device.id],
    queryFn: () => api<{ data: Geofence[] }>(`/devices/${device.id}/geofences`),
  });
  const fences = data?.data || [];
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Geofence | null>(null);
  const hasPos = state.lat != null;

  async function save() {
    if (!draft || draft.lat == null) return;
    setError(null);
    try {
      await api(`/devices/${device.id}/geofences`, {
        method: 'POST',
        body: { name: draft.name.trim(), type: 'circle', center: { lat: draft.lat, lon: draft.lon }, radiusM: draft.radiusM },
      });
      setDraft(null);
      refetch();
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function toggle(f: Geofence, key: 'alertOnEnter' | 'alertOnExit') {
    await api(`/devices/${device.id}/geofences/${f.id}`, { method: 'PATCH', body: { [key]: !f[key] } });
    refetch();
  }

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, gap: 14, paddingBottom: 24 }}>
      <View style={[styles.mapBox, { borderColor: draft ? c.accent : c.border, borderWidth: draft ? 2 : StyleSheet.hairlineWidth }]}>
        <AppMap
          initialCenter={hasPos ? { lat: state.lat!, lon: state.lon! } : undefined}
          initialZoom={14}
          markers={hasPos ? [{ id: device.id, lat: state.lat!, lon: state.lon!, heading: state.heading, online: state.online, vehicle: device.icon }] : []}
          circles={[
            ...fences.filter((f) => f.type === 'circle' && f.center).map((f) => ({ id: f.id, lat: f.center!.lat, lon: f.center!.lon, radiusM: f.radiusM || 0 })),
            ...(draft?.lat != null ? [{ id: 'draft', lat: draft.lat, lon: draft.lon!, radiusM: draft.radiusM, draft: true }] : []),
          ]}
          polygons={fences.filter((f) => f.type === 'polygon' && f.points).map((f) => ({ id: f.id, points: f.points! }))}
          fitTo={[
            ...(hasPos ? [{ lat: state.lat!, lon: state.lon! }] : []),
            ...fences.filter((f) => f.center).map((f) => ({ lat: f.center!.lat, lon: f.center!.lon })),
          ]}
          fitKey={fences.length}
          onLongPress={draft ? ({ lat, lon }) => setDraft({ ...draft, lat, lon }) : undefined}
        />
      </View>

      {isOwner && !draft && (
        <Button title="Add area" icon="add" small onPress={() => setDraft({ lat: state.lat, lon: state.lon, radiusM: 200, name: '' })} />
      )}

      {draft && (
        <Card style={{ gap: space.md }}>
          <AppText variant="small" style={{ fontFamily: fonts.bold, fontSize: 14 }}>New area</AppText>
          <AppText variant="caption" color="textMuted" style={{ letterSpacing: 0, fontSize: 12 }}>Long-press the map to place the centre.</AppText>
          <Field label="Name" value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} placeholder="Home, Office, School…" />
          <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <IconButton icon="remove" label="Smaller" onPress={() => setDraft({ ...draft, radiusM: Math.max(50, draft.radiusM - 50) })} />
            <View style={{ alignItems: 'center' }}>
              <AppText variant="h3">{draft.radiusM} m</AppText>
              <AppText variant="caption" color="textMuted" style={{ letterSpacing: 0, fontSize: 11 }}>radius</AppText>
            </View>
            <IconButton icon="add" label="Bigger" onPress={() => setDraft({ ...draft, radiusM: Math.min(50_000, draft.radiusM + 50) })} />
          </Row>
          <ErrorBox error={error} />
          <Row gap={space.sm} style={{ justifyContent: 'flex-end' }}>
            <Button title="Cancel" variant="ghost" small onPress={() => setDraft(null)} />
            <Button title="Save area" small disabled={draft.lat == null || !draft.name.trim()} onPress={save} />
          </Row>
        </Card>
      )}

      {isLoading ? (
        <AppText variant="caption" color="textMuted" center style={{ letterSpacing: 0 }}>Loading…</AppText>
      ) : fences.length === 0 ? (
        <AppText variant="caption" color="textMuted" center style={{ letterSpacing: 0, fontSize: 12, paddingVertical: 16 }}>No areas yet. Add one to get an alert when the vehicle enters or leaves.</AppText>
      ) : (
        fences.map((f) => (
          <View key={f.id} style={{ gap: 6, paddingVertical: 6 }}>
            <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              <View style={{ flex: 1 }}>
                <AppText variant="small" style={{ fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 }}>{f.name}</AppText>
                <AppText variant="caption" color="textMuted" style={{ letterSpacing: 0, fontSize: 12 }}>{f.type === 'circle' ? `${f.radiusM} m radius` : `${f.points?.length}-point area`}</AppText>
              </View>
              {isOwner && <Button title="Delete" variant="danger" small onPress={() => setDeleting(f)} />}
            </Row>
            {isOwner && (
              <Row gap={space.lg}>
                <Row gap={4}><Switch style={{ transform: [{ scale: 0.8 }] }} value={f.alertOnEnter} onValueChange={() => toggle(f, 'alertOnEnter')} trackColor={{ true: c.accent }} /><AppText variant="caption" style={{ letterSpacing: 0, fontSize: 12 }}>Enter</AppText></Row>
                <Row gap={4}><Switch style={{ transform: [{ scale: 0.8 }] }} value={f.alertOnExit} onValueChange={() => toggle(f, 'alertOnExit')} trackColor={{ true: c.accent }} /><AppText variant="caption" style={{ letterSpacing: 0, fontSize: 12 }}>Leave</AppText></Row>
              </Row>
            )}
          </View>
        ))
      )}

      <ConfirmDialog
        visible={Boolean(deleting)}
        title="Delete geofence"
        message={`Delete "${deleting?.name}"? You'll stop getting alerts for it.`}
        confirmLabel="Delete"
        danger
        onConfirm={async () => {
          await api(`/devices/${device.id}/geofences/${deleting!.id}`, { method: 'DELETE' });
          refetch();
        }}
        onClose={() => setDeleting(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mapBox: { height: 190, borderRadius: radius.card, overflow: 'hidden' },
});
