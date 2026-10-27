// Report (minimal): four totals and distance per day.
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { duration, isoDay, km } from '@/lib/format';
import { MiniTabs } from '@/components/MiniTabs';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';
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
  const muted = { fontFamily: fonts.body, fontSize: 11, lineHeight: 15, color: c.textMuted } as const;

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, paddingBottom: 24, gap: 16 }}>
      <MiniTabs value={days} options={[['7', '7 days'], ['30', '30 days']]} onChange={setDays} />
      {isLoading || !report ? (
        <Text style={[muted, { textAlign: 'center', paddingVertical: 32 }]}>Loading…</Text>
      ) : (
        <>
          <View style={{ flexDirection: 'row' }}>
            {[
              [km(report.total.distanceKm), 'km'],
              [String(report.total.trips), 'trips'],
              [duration(report.total.drivingS), 'driving'],
              [duration(report.total.idleS), 'idle'],
            ].map(([v, k]) => (
              <View key={k} style={{ flex: 1, gap: 2 }}>
                <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: c.text }}>{v}</Text>
                <Text style={muted}>{k}</Text>
              </View>
            ))}
          </View>

          <View style={{ gap: 10 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>Distance per day (km)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 3 }}>
              {all.map((d, i) => {
                const v = byDay[d]?.distanceKm || 0;
                const showLabel = n <= 7 || i % 5 === 0 || i === n - 1;
                return (
                  <View key={d} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 }} accessibilityLabel={`${d}: ${v} km`}>
                    {n <= 7 && <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: c.text }}>{v ? Math.round(v) : ''}</Text>}
                    <View style={{ width: '70%', maxWidth: 28, height: Math.max(3, (v / max) * 84), backgroundColor: v ? c.accent : c.border, borderRadius: 4 }} />
                    <Text style={{ fontFamily: fonts.body, fontSize: 10, color: c.textMuted }} numberOfLines={1}>
                      {showLabel ? new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', ...(n <= 7 ? { weekday: 'narrow' as const } : {}) }) : ' '}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={muted}>{report.note}.</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}
