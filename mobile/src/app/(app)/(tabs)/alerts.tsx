// Alerts from all my trackers (last 7 days).
import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import type { AlertEvent } from '@/api/types';
import { AlertRow } from '@/components/AlertRow';
import { AppText, EmptyState, ErrorBox } from '@/components/ui';
import { space, useColors } from '@/theme';
import { SkeletonRows } from '@/components/effects';

type FeedItem = AlertEvent & { deviceName: string };

export default function AlertsFeed() {
  const c = useColors();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['my-events'],
    queryFn: () => api<{ data: FeedItem[] }>('/me/events?limit=200'),
  });
  const events = data?.data || [];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ padding: space.lg, paddingBottom: space.sm }}>
        <AppText variant="h1">Alerts</AppText>
        <AppText color="textMuted">All your trackers · last 7 days</AppText>
      </View>
      <ErrorBox error={error ? errorText(error) : null} />
      {isLoading ? (
        <SkeletonRows count={5} style={{ padding: space.lg }} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ padding: space.lg, gap: space.sm, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} />}
          ListEmptyComponent={<EmptyState icon="notifications-off-outline" title="All quiet" text="No alerts in the last 7 days." />}
          renderItem={({ item }) => (
            <AlertRow
              alert={item}
              subtitle={item.deviceName}
              onPress={() => router.push({ pathname: '/device/[id]', params: { id: item.deviceId, tab: 'alerts' } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
