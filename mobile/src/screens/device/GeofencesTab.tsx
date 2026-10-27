// Geofences: circles on the map; owners long-press to place a new one.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

/** Each area gets its own colour: on the map and next to its name. */
export const FENCE_COLORS = ['#D93636', '#2F6DB5', '#1F8A55', '#C27400', '#7A4FA8', '#2A8C82', '#C2437A', '#5B6770'];
const colorFor = (i: number) => FENCE_COLORS[i % FENCE_COLORS.length];

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
            ...fences.map((f, i) => ({ f, i })).filter(({ f }) => f.type === 'circle' && f.center).map(({ f, i }) => ({ id: f.id, lat: f.center!.lat, lon: f.center!.lon, radiusM: f.radiusM || 0, color: colorFor(i) })),
            ...(draft?.lat != null ? [{ id: 'draft', lat: draft.lat, lon: draft.lon!, radiusM: draft.radiusM, draft: true, color: colorFor(fences.length) }] : []),
          ]}
          polygons={fences.map((f, i) => ({ f, i })).filter(({ f }) => f.type === 'polygon' && f.points).map(({ f, i }) => ({ id: f.id, points: f.points!, color: colorFor(i) }))}
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colorFor(fences.length) }} /><AppText variant="h3">{draft.radiusM} m</AppText></View>
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
        fences.map((f, i) => (
          <View key={f.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colorFor(i) }} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <AppText variant="small" numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 }}>{f.name}</AppText>
              <AppText variant="caption" color="textMuted" style={{ letterSpacing: 0, fontSize: 12 }}>{f.type === 'circle' ? `${f.radiusM} m radius` : `${f.points?.length}-point area`}</AppText>
            </View>
            {isOwner ? (
              <>
                <Toggle label="Enter" on={f.alertOnEnter} color={colorFor(i)} onPress={() => toggle(f, 'alertOnEnter')} />
                <Toggle label="Leave" on={f.alertOnExit} color={colorFor(i)} onPress={() => toggle(f, 'alertOnExit')} />
                <Pressable onPress={() => setDeleting(f)} accessibilityRole="button" accessibilityLabel={`Delete ${f.name}`} hitSlop={8} style={{ width: 28, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="trash-outline" size={17} color={c.danger} />
                </Pressable>
              </>
            ) : null}
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

/** Small on/off pill (Enter / Leave): filled in the area's colour when on. */
function Toggle({ label, on, color, onPress }: { label: string; on: boolean; color: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={`Alert on ${label.toLowerCase()}`}
      style={{ height: 26, paddingHorizontal: 10, borderRadius: 13, borderWidth: 1.5, borderColor: on ? color : c.border, backgroundColor: on ? color : 'transparent', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: on ? '#FFFFFF' : c.textMuted }}>{label}</Text>
    </Pressable>
  );
}
