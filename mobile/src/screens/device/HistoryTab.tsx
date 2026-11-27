// Replay a day: the same design as the Replay tab for one vehicle — date and
// time pickers, the route on the map with a moving dot, playback bar, the
// speedometer with totals, and the speed line chart.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { LockableScrollView } from '@/components/LockableScrollView';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { RoutePoint } from '@/api/types';
import { duration, isoDay, km } from '@/lib/format';
import { ROUTE_RED, endDots, hhmm, pointAt, routeStats, stopDots, validTime } from '@/lib/replay';
import { AppMap } from '@/components/Map';
import { ExpandableMap } from '@/components/ExpandableMap';
import { ReplayFields } from '@/components/ReplayFields';
import { ReplayTotals, Scrubber, SpeedChart, usePlayback, useReplaySpeed } from '@/components/tripParts';
import { fonts } from '@/theme';
import { useResponsive } from '@/lib/responsive';
import { useHomeColors as useColors } from '@/theme/designHome';
import type { TabProps } from './types';

export function HistoryTab({ device }: TabProps) {
  const c = useColors();
  const r = useResponsive();
  const today = isoDay();
  const [date, setDate] = useState(today);
  const [fromText, setFrom] = useState('00:00');
  const [toText, setTo] = useState(hhmm());
  const [playing, setPlaying] = useState(false);
  const span = useRef(0);
  const [speed, setSpeed] = useReplaySpeed();
  const [progress, setProgress] = usePlayback(playing, setPlaying, span, speed);

  const from = validTime(fromText) ? fromText : '00:00';
  const to = validTime(toText) ? toText : date === today ? hhmm() : '23:59';
  const winStart = new Date(`${date}T${from}:00`).getTime();
  const winEnd = new Date(`${date}T${to}:59`).getTime();
  const pickDate = (iso: string) => { setDate(iso); setFrom('00:00'); setTo(iso === today ? hhmm() : '23:59'); };

  const { data, isLoading } = useQuery({
    queryKey: ['positions-window', device.id, winStart, winEnd],
    enabled: winEnd > winStart,
    queryFn: () =>
      api<{ data: { points: RoutePoint[] } }>(
        `/devices/${device.id}/positions?from=${encodeURIComponent(new Date(winStart).toISOString())}&to=${encodeURIComponent(new Date(Math.min(winEnd, Date.now())).toISOString())}&maxPoints=3000`,
      ),
  });
  const points = useMemo(() => data?.data.points ?? [], [data]);
  const coords = useMemo(() => points.map((p) => ({ lat: p.lat, lon: p.lon })), [points]);
  const stats = useMemo(() => routeStats(points), [points]);

  const has = points.length > 1;
  const t0 = has ? Date.parse(points[0].t) : winStart;
  const t1 = has ? Date.parse(points[points.length - 1].t) : winEnd;
  span.current = t1 - t0;
  const tNow = t0 + progress * (t1 - t0);
  const cur = has ? pointAt(points, tNow) : null;
  const playSpeed = has && progress > 0 && progress < 1 ? cur?.speed ?? 0 : null;
  const clock = new Date(tNow).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

  useEffect(() => {
    setPlaying(false);
    setProgress(1);
  }, [winStart, winEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  const page = c.dark ? c.bg : '#F2F2F2';
  return (
    <View style={{ flex: 1, backgroundColor: page }}>
      <LockableScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, gap: 16 }} keyboardShouldPersistTaps="handled">
        <ReplayFields date={date} from={from} to={to} max={today} onDate={pickDate} onFrom={setFrom} onTo={setTo} />

        <ExpandableMap height={230} style={{ borderRadius: 22 }}>
          <AppMap
            initialCenter={coords[0]}
            initialZoom={13}
            routes={has ? [{ id: 'day', color: ROUTE_RED, points: coords }] : []}
            dots={[...endDots(coords, 'day'), ...stopDots(points, 'day', progress > 0 && progress < 1 ? tNow : null)]}
            markers={cur ? [{ id: 'now', lat: cur.lat, lon: cur.lon, dot: ROUTE_RED, variant: 'replay' }] : []}
            fitTo={coords}
            fitKey={`${winStart}-${winEnd}-${coords.length}`}
          />
          {!isLoading && !has && (
            <View style={{ position: 'absolute', alignSelf: 'center', top: '42%', backgroundColor: c.dark ? c.surface : '#FFFFFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: c.text }}>No driving in this time window</Text>
            </View>
          )}
        </ExpandableMap>

        <Scrubber
          value={progress}
          onChange={(v) => { setPlaying(false); setProgress(v); }}
          playing={playing}
          onPlay={() => setPlaying(!playing)}
          disabled={!has}
          label={has ? clock : undefined}
          speed={speed}
          onSpeed={setSpeed}
        />

        <ReplayTotals
          distanceKm={km(stats.km)}
          driveText={duration(stats.driveS)}
          top={stats.top}
          avg={stats.avg}
          playSpeed={playSpeed}
          size={r.tiny ? 108 : r.small ? 122 : 140}
          caption={playSpeed != null ? `km/h · ${clock}` : undefined}
        />

        {has && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: c.text }}>Speed (km/h)</Text>
            <SpeedChart points={points.map((p) => [Date.parse(p.t), p.speed ?? 0] as [number, number])} cursor={progress > 0 && progress < 1 ? progress : null} height={130} />
          </View>
        )}
      </LockableScrollView>
    </View>
  );
}
