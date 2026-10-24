// Daily report: totals + distance-per-day bars.
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { duration, isoDay, km } from '@/lib/format';
import { AppText, Card, Loading, Row, Segmented, StatCard } from '@/components/ui';
import { space, useColors } from '@/theme';
import type { TabProps } from './types';

type Report = {
  from: string;
  to: string;
  timezone: string;
  days: { day: string; distanceKm: number; maxSpeed: number; drivingS: number; idleS: number; trips: number }[];
  total: { distanceKm: number; drivingS: number; idleS: number; trips: number; maxSpeed: number };
  note: string;
};

export function ReportTab({ device }: TabProps) {
  const c = useColors();
  const [days, setDays] = useState<'7' | '30'>('7');
  const n = Number(days);
  const to = isoDay();
  const from = isoDay(Date.now() - (n - 1) * 86_400_000);
  const { data, isLoading } = useQuery({
    queryKey: ['report', device.id, days],
    queryFn: () => api<{ data: Report }>(`/devices/${device.id}/reports/daily?from=${from}&to=${to}`),
  });
  const report = data?.data;
  const byDay = Object.fromEntries((report?.days || []).map((d) => [d.day, d]));
  const all = Array.from({ length: n }, (_, i) => isoDay(new Date(`${from}T12:00:00`).getTime() + i * 86_400_000));
  const max = Math.max(1, ...all.map((d) => byDay[d]?.distanceKm || 0));

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: space.md, gap: space.md, paddingBottom: 48 }}>
      <Segmented value={days} options={[['7', 'Last 7 days'], ['30', 'Last 30 days']]} onChange={setDays} />
      {isLoading || !report ? (
        <Loading />
      ) : (
        <View style={{ paddingHorizontal: space.lg, gap: space.md }}>
          <Row gap={space.md}>
            <StatCard value={km(report.total.distanceKm)} unit="km" label="Distance" />
            <StatCard value={report.total.trips} label={`Trips · max ${report.total.maxSpeed} km/h`} />
          </Row>
          <Row gap={space.md}>
            <StatCard value={duration(report.total.drivingS)} label="Driving" style={{ minWidth: 150 }} />
            <StatCard value={duration(report.total.idleS)} label="Idle (engine on)" style={{ minWidth: 150 }} />
          </Row>
          <Card style={{ gap: space.md }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <AppText variant="h3">Distance per day</AppText>
              <AppText variant="caption" color="textMuted">{report.timezone}</AppText>
            </Row>
            <View style={styles.bars}>
              {all.map((d, i) => {
                const v = byDay[d]?.distanceKm || 0;
                const showLabel = n <= 7 || i % 5 === 0 || i === n - 1;
                return (
                  <View key={d} style={styles.bar} accessibilityLabel={`${d}: ${v} km`}>
                    {n <= 7 && <AppText variant="caption">{v ? Math.round(v) : ''}</AppText>}
                    <View style={{ width: '70%', maxWidth: 34, height: Math.max(3, (v / max) * 130), backgroundColor: v ? c.accent : c.border, borderRadius: 4 }} />
                    <AppText variant="caption" color="textMuted" numberOfLines={1}>
                      {showLabel ? new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', ...(n <= 7 ? { weekday: 'narrow' as const } : {}) }) : ' '}
                    </AppText>
                  </View>
                );
              })}
            </View>
            <AppText variant="small" color="textMuted">{report.note}.</AppText>
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 180, gap: 2 },
  bar: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
});
