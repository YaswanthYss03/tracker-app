// Alerts from all my vehicles (last 7 days), opened from the bell on Home.
import { useEffect } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { errorText } from '@/api/client';
import { useAlertsFeed, useMarkAlertsSeen } from '@/lib/alertsSeen';
import { AlertRow } from '@/components/AlertRow';
import { AppText, EmptyState, ErrorBox, IconButton, Row } from '@/components/ui';
import { space, useColors } from '@/theme';
import { SkeletonRows } from '@/components/effects';

export default function AlertsFeed() {
  const c = useColors();
  const { data, isLoading, error, refetch, isRefetching } = useAlertsFeed();
  const markSeen = useMarkAlertsSeen();
  useEffect(markSeen, []); // eslint-disable-line react-hooks/exhaustive-deps
  const events = data?.data || [];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <Row style={{ padding: space.lg, paddingBottom: space.sm, flexWrap: 'nowrap' }} gap={space.md}>
        <IconButton icon="arrow-back" label="Back" onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <AppText variant="h1">Alerts</AppText>
          <AppText color="textMuted">All your vehicles · last 7 days</AppText>
        </View>
      </Row>
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
