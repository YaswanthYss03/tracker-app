// One vehicle. Without ?tab: the details overview (design v2).
// With ?tab=trips|history|report|alerts|geofences|sharing|settings: that section.
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '@/components/BottomNav';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { plateOrName, type Device } from "@/api/types";
import { useLive } from '@/live/useLive';
import { alertText, SEVERE_ALERTS } from '@/lib/format';
import { AlertBanner, type BannerAlert } from '@/components/AlertBanner';
import { VehicleBadge } from '@/components/VehicleArt';
import { AppText, ErrorBox, IconButton, Loading, Pill, Row, Segmented } from '@/components/ui';
import { space, useColors } from '@/theme';
import { LiveTab } from '@/screens/device/LiveTab';
import { HistoryTab } from '@/screens/device/HistoryTab';
import { TripsTab } from '@/screens/device/TripsTab';
import { ReportTab } from '@/screens/device/ReportTab';
import { AlertsTab } from '@/screens/device/AlertsTab';
import { GeofencesTab } from '@/screens/device/GeofencesTab';
import { SharingTab } from '@/screens/device/SharingTab';
import { SettingsTab } from '@/screens/device/SettingsTab';
import { Overview } from '@/screens/device/Overview';

type Tab = 'live' | 'history' | 'trips' | 'report' | 'alerts' | 'geofences' | 'sharing' | 'settings';

export default function DeviceScreen() {
  const c = useColors();
  const params = useLocalSearchParams<{ id: string; tab?: Tab }>();
  const [tab, setTab] = useState<Tab>(params.tab || 'live');
  const overview = !params.tab;
  const [banner, setBanner] = useState<BannerAlert | null>(null);
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['device', params.id],
    queryFn: () => api<{ data: Device }>(`/devices/${params.id}`),
  });
  const device = data?.data;

  const { live } = useLive(device ? [device.id] : [], {
    onAlert: (a) => setBanner({ title: alertText(a), text: 'Just now', severe: SEVERE_ALERTS.has(a.type) }),
    onRevoked: () => router.replace('/'),
  });

  if (isLoading) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}><Loading /></SafeAreaView>;
  if (!device) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, padding: space.lg, gap: space.md }}>
        <IconButton icon="arrow-back" label="Back" onPress={() => router.back()} />
        <ErrorBox error={error ? errorText(error) : 'Tracker not found'} />
      </SafeAreaView>
    );
  }

  const state = live[device.id] || device.live;
  const isOwner = device.role === 'owner';
  const tabs: [Tab, string][] = [
    ['live', 'Live'],
    ['history', 'History'],
    ['trips', 'Trips'],
    ['report', 'Report'],
    ['alerts', 'Alerts'],
    ['geofences', 'Geofences'],
    ...(isOwner ? ([['sharing', 'Sharing']] as [Tab, string][]) : []),
    ['settings', 'Settings'],
  ];
  const props = { device, state, isOwner, reload: refetch };

  if (overview) {
    return (
      <>
        <Overview {...props} />
        {banner && <AlertBanner alert={banner} onClose={() => setBanner(null)} />}
      </>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingHorizontal: space.lg, paddingTop: space.sm, gap: space.sm }}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <IconButton icon="arrow-back" label="Back" onPress={() => router.back()} />
          <VehicleBadge type={device.icon} online={state.online} size={44} />
          <View style={{ flex: 1 }}>
            <AppText variant="h2" numberOfLines={1}>{plateOrName(device)}</AppText>
          </View>
        </Row>
        <Row gap={6}>
          <Pill label={state.online ? 'Online' : state.lastSeenAt ? 'Offline' : 'Never connected'} tone={state.online ? 'ok' : 'offline'} />
          {state.ignition != null ? <Pill label={`Ignition ${state.ignition ? 'on' : 'off'}`} tone={state.ignition ? 'accent' : 'neutral'} /> : null}
          {!isOwner ? <Pill label="Shared with you" /> : null}
        </Row>
      </View>
      <View style={{ marginTop: space.sm }}>
        <Segmented value={tab} options={tabs} onChange={setTab} />
      </View>
      <View style={{ flex: 1 }}>
        {tab === 'live' && <LiveTab {...props} />}
        {tab === 'history' && <HistoryTab {...props} />}
        {tab === 'trips' && <TripsTab {...props} />}
        {tab === 'report' && <ReportTab {...props} />}
        {tab === 'alerts' && <AlertsTab {...props} />}
        {tab === 'geofences' && <GeofencesTab {...props} />}
        {tab === 'sharing' && isOwner && <SharingTab {...props} />}
        {tab === 'settings' && <SettingsTab {...props} />}
      </View>
      {banner && <AlertBanner alert={banner} onClose={() => setBanner(null)} />}
      <BottomNav active="home" />
    </SafeAreaView>
  );
}
