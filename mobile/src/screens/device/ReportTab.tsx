// Report (minimal): totals plus two bar charts, distance and riding time, for
// this week (Mon–Sun), last week, or the last 30 days.
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
  timezone: string;
  days: { day: string; distanceKm: number; maxSpeed: number; drivingS: number; idleS: number; trips: number }[];
  total: { distanceKm: number; drivingS: number; idleS: number; trips: number; maxSpeed: number };
  note: string;
};
type Range = 'week' | 'last' | '30';

const DAY = 86_400_000;
const at = (iso: string, plus = 0) => isoDay(new Date(`${iso}T12:00:00`).getTime() + plus * DAY);

/** The 7 days Monday–Sunday of this week (offsetWeeks 0) or last week (-1); or the last 30 days. */
function daysOf(range: Range): string[] {
  const today = isoDay();
  if (range === '30') return Array.from({ length: 30 }, (_, i) => at(today, i - 29));
  const dow = (new Date(`${today}T12:00:00`).getDay() + 6) % 7; // Monday = 0
  const monday = at(today, -dow + (range === 'last' ? -7 : 0));
  return Array.from({ length: 7 }, (_, i) => at(monday, i));
}

export function ReportTab({ device }: TabProps) {
  const c = useColors();
  const [range, setRange] = useState<Range>('week');
  const days = daysOf(range);
  const from = days[0];
  const to = days[days.length - 1];
  const { data, isLoading } = useQuery({
    queryKey: ['report', device.id, from, to],
    queryFn: () => api<{ data: Report }>(`/devices/${device.id}/reports/daily?from=${from}&to=${to}`),
  });
  const report = data?.data;
  const byDay = Object.fromEntries((report?.days || []).map((d) => [d.day, d]));
  const label = (d: string, i: number) => {
    const dt = new Date(`${d}T12:00:00`);
    if (range !== '30') return dt.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 3);
    return i % 5 === 0 || i === days.length - 1 ? String(dt.getDate()) : '';
  };
  const muted = { fontFamily: fonts.body, fontSize: 11, lineHeight: 15, color: c.textMuted } as const;
  const hrs = (s: number) => (s >= 3600 ? `${Math.round(s / 360) / 10}h` : s >= 60 ? `${Math.round(s / 60)}m` : '');

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, paddingBottom: 28, gap: 18 }}>
      <MiniTabs<Range> value={range} options={[['week', 'This week'], ['last', 'Last week'], ['30', '30 days']]} onChange={setRange} />
      {isLoading || !report ? (
        <Text style={[muted, { textAlign: 'center', paddingVertical: 32 }]}>Loading…</Text>
      ) : (
        <>
          <View style={{ flexDirection: 'row' }}>
            {[
              [km(report.total.distanceKm), 'km'],
              [String(report.total.trips), 'trips'],
              [duration(report.total.drivingS), 'riding'],
              [duration(report.total.idleS), 'idle'],
            ].map(([v, k]) => (
              <View key={k} style={{ flex: 1, gap: 2 }}>
                <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: c.text }}>{v}</Text>
                <Text style={muted}>{k}</Text>
              </View>
            ))}
          </View>

          <Chart
            title="Distance (km)"
            labels={days.map(label)}
            values={days.map((d) => byDay[d]?.distanceKm || 0)}
            text={(v) => (v ? String(Math.round(v)) : '')}
            color={c.accent}
            showValues={range !== '30'}
          />
          <Chart
            title="Riding time"
            labels={days.map(label)}
            values={days.map((d) => byDay[d]?.drivingS || 0)}
            text={hrs}
            color={c.text}
            showValues={range !== '30'}
          />
          <Text style={muted}>{report.note}.</Text>
        </>
      )}
    </ScrollView>
  );
}

function Chart({ title, labels, values, text, color, showValues }: {
  title: string; labels: string[]; values: number[]; text: (v: number) => string; color: string; showValues: boolean;
}) {
  const c = useColors();
  const max = Math.max(1, ...values);
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 112, gap: 3 }}>
        {values.map((v, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 }} accessibilityLabel={`${labels[i] || i + 1}: ${text(v) || 'none'}`}>
            {showValues && <Text numberOfLines={1} style={{ fontFamily: fonts.medium, fontSize: 10, color: c.text }}>{text(v)}</Text>}
            <View style={{ width: '70%', maxWidth: 26, height: Math.max(3, (v / max) * 70), backgroundColor: v ? color : c.border, borderRadius: 4 }} />
            <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: 10, color: c.textMuted }}>{labels[i] || ' '}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
