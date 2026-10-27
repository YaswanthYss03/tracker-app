// One vehicle. Without ?tab: the details overview (design v2).
// With ?tab=trips|history|report|alerts|geofences|sharing|settings: that section.
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { plateOrName, type Device } from "@/api/types";
import { useLive } from '@/live/useLive';
import { alertText, SEVERE_ALERTS } from '@/lib/format';
import { AlertBanner, type BannerAlert } from '@/components/AlertBanner';
import { VehicleBadge } from '@/components/VehicleArt';
import { AppText, ErrorBox, IconButton, Loading, Pill, Row, Segmented } from '@/components/ui';
import { TopBar } from '@/components/kit';
import { fonts, space, useColors } from '@/theme';
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
const SECTION_TITLE: Record<Tab, string> = {
  live: 'Live', history: 'Replay a day', trips: 'Trips', report: 'Report', alerts: 'Alerts', geofences: 'Geofences', sharing: 'Share with family', settings: 'Settings',
};

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
  const props = { device, state, isOwner, reload: refetch };

  if (overview) {
    return (
      <>
        <Overview {...props} />
        {banner && <AlertBanner alert={banner} onClose={() => setBanner(null)} />}
      </>
    );
  }

  // One section on its own page: back + title, then only that section's content.
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar
        onBack={() => router.back()}
        title={
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: c.text }}>{SECTION_TITLE[tab]}</Text>
            <Text numberOfLines={1} style={{ fontFamily: fonts.mono, fontSize: 12, color: c.textMuted, flexShrink: 1 }}>{plateOrName(device)}</Text>
          </View>
        }
      />
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
    </SafeAreaView>
  );
}
