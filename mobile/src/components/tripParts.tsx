/**
 * Pieces for trip screens:
 *   <Scrubber>    play/pause + a bar you can drag (0..1)
 *   <SpeedChart>  speed over time as a soft area chart
 *   <SpeedGauge>  speedometer dial with a needle
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { buildAxis, compactSpan } from '@/lib/speedAxis';
import { SPEEDS, baseDuration } from '@/lib/replay';
import { DIcon } from '@/components/DesignIcon';
import { shadow, space, type, useColors } from '@/theme';

let savedSpeed = 1;
/** The chosen replay speed (1x..10x), kept while the app is open. */
export function useReplaySpeed() {
  const [speed, set] = useState(savedSpeed);
  return [speed, (v: number) => { savedSpeed = v; set(v); }] as const;
}

/**
 * Plays 0 → 1 while `playing`; returns [progress, setProgress]. The whole replay takes
 * baseDuration(span) / speed, where `span` (ms covered by the route) is read from a ref.
 */
export function usePlayback(playing: boolean, setPlaying: (v: boolean) => void, span: { current: number }, speed = 1) {
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  pRef.current = p;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  useEffect(() => {
    if (!playing) return undefined;
    if (pRef.current >= 1) setP(0);
    let last = Date.now();
    const t = setInterval(() => {
      const now = Date.now();
      const durationMs = Math.max(600, baseDuration(span.current) / speedRef.current);
      const next = Math.min(1, (pRef.current >= 1 ? 0 : pRef.current) + (now - last) / durationMs);
      last = now;
      setP(next);
      if (next >= 1) setPlaying(false);
    }, 50);
    return () => clearInterval(t);
  }, [playing, span, setPlaying]);
  return [p, setP] as const;
}

export function Scrubber({ value, onChange, playing, onPlay, label, disabled, speed, onSpeed }: {
  value: number; onChange: (v: number) => void; playing: boolean; onPlay: () => void; label?: string; disabled?: boolean;
  speed?: number; onSpeed?: (v: number) => void;
}) {
  const c = useColors();
  const [w, setW] = useState(1);
  const pick = (e: GestureResponderEvent) => onChange(Math.max(0, Math.min(1, e.nativeEvent.locationX / w)));
  return (
    <View style={{ gap: space.sm }}>
    <View style={styles.scrub}>
      <Pressable
        onPress={onPlay}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause' : 'Play'}
        style={[styles.play, { backgroundColor: c.dark ? c.surface : '#FFFFFF', opacity: disabled ? 0.4 : 1 }]}
      >
        <DIcon name={playing ? 'pause' : 'play'} size={18} strokeWidth={2.2} color={c.accent} />
      </Pressable>
      <View
        style={styles.track}
        onLayout={(e) => setW(e.nativeEvent.layout.width || 1)}
        onStartShouldSetResponder={() => !disabled}
        onMoveShouldSetResponder={() => !disabled}
        onResponderGrant={pick}
        onResponderMove={pick}
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      >
        <View style={[styles.rail, { backgroundColor: c.dark ? c.surface2 : '#DADADA' }]} />
        <View style={[styles.rail, { width: `${value * 100}%`, backgroundColor: c.accent }]} />
        <View style={[styles.knob, { left: value * w - 10, backgroundColor: c.accent }]} />
      </View>
      {label ? <Text style={[type.caption, { color: c.text, letterSpacing: 0, fontFamily: type.fieldLabel.fontFamily }]}>{label}</Text> : null}
    </View>
    {onSpeed ? (
      <View style={styles.speeds} accessibilityRole="radiogroup" accessibilityLabel="Replay speed">
        <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>Speed</Text>
        {SPEEDS.map((s) => {
          const on = speed === s;
          return (
            <Pressable
              key={s}
              onPress={() => onSpeed(s)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${s}x speed`}
              style={[styles.speedChip, { backgroundColor: on ? c.text : c.dark ? c.surface : '#FFFFFF', borderColor: on ? c.text : c.border }]}
            >
              <Text style={{ fontFamily: type.fieldLabel.fontFamily, fontSize: 13, color: on ? (c.dark ? c.bg : '#FFFFFF') : c.text }}>{s}x</Text>
            </Pressable>
          );
        })}
      </View>
    ) : null}
    </View>
  );
}

/**
 * Speed (km/h) over time as a line chart. `points` = one line ([ms, speed]);
 * `series` = several coloured lines (Compare). `cursor` 0..1 draws a marker.
 * Long stops are squeezed into narrow shaded bands (with their length), so the
 * driving parts get the room and the curve is easy to read.
 */
export function SpeedChart({ points, series, height = 120, cursor }: {
  points?: [number, number][]; series?: { points: [number, number][]; color: string }[]; height?: number; cursor?: number | null;
}) {
  const c = useColors();
  const [w, setW] = useState(0);
  const lines = series ?? [{ points: points ?? [], color: c.accent }];
  const all = lines.flatMap((l) => l.points);
  const pad = { l: 28, r: 6, t: 8, b: 20 };
  const max = Math.max(60, Math.ceil(Math.max(...all.map((p) => p[1]), 0) / 20) * 20);
  const t0 = all.length ? Math.min(...all.map((p) => p[0])) : 0;
  const t1 = all.length ? Math.max(...all.map((p) => p[0])) : 1;
  const plotW = Math.max(1, w - pad.l - pad.r);
  const axis = useMemo(() => buildAxis(all, t0, t1, plotW), [all.length, t0, t1, plotW]); // eslint-disable-line react-hooks/exhaustive-deps
  const x = (t: number) => pad.l + axis.xOf(t);
  const y = (v: number) => pad.t + (1 - v / max) * (height - pad.t - pad.b);
  const ticks = [0, max / 2, max];
  const cx = cursor != null ? x(t0 + cursor * (t1 - t0)) : null;
  const single = lines.length === 1;
  const top = Math.max(0, ...all.map((p) => p[1]));
  const clock = (t: number) => new Date(t).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  const last = axis.spans.length - 1;
  let lastLabel = pad.l; // the start time is already drawn at the left edge
  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ height }} accessibilityLabel={`Speed chart, top ${top} km/h`}>
      {w > 0 && all.length > 1 && (
        <Svg width={w} height={height}>
          <Defs>
            <LinearGradient id="spd" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={lines[0].color} stopOpacity={0.22} />
              <Stop offset="1" stopColor={lines[0].color} stopOpacity={0.02} />
            </LinearGradient>
          </Defs>
          {ticks.map((v) => (
            <Line key={v} x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke={c.border} strokeWidth={1} strokeDasharray={v ? '3 4' : undefined} />
          ))}
          {ticks.map((v) => (
            <SvgText key={`l${v}`} x={pad.l - 6} y={y(v) + 4} fontSize={10} fill={c.textMuted} textAnchor="end">{Math.round(v)}</SvgText>
          ))}
          {axis.spans.map((s, si) => {
            const sx0 = pad.l + s.x0;
            const sx1 = pad.l + s.x1;
            if (s.stop) {
              const mid = (sx0 + sx1) / 2;
              return (
                <G key={si}>
                  <Rect x={sx0} y={pad.t} width={sx1 - sx0} height={y(0) - pad.t} fill={c.surface2} opacity={0.6} />
                  <Line x1={sx0} x2={sx1} y1={y(0)} y2={y(0)} stroke={c.textMuted} strokeWidth={1.5} strokeDasharray="3 3" />
                  <SvgText x={mid} y={(pad.t + y(0)) / 2} fontSize={9} fontWeight="700" fill={c.textMuted} textAnchor="middle" transform={`rotate(-90 ${mid} ${(pad.t + y(0)) / 2})`}>{`Stopped ${compactSpan(s.t1 - s.t0)}`}</SvgText>
                </G>
              );
            }
            const showLabel = si > 0 && sx1 - sx0 >= 30 && sx0 - lastLabel >= 50 && w - pad.r - sx0 >= 50;
            if (showLabel) lastLabel = sx0;
            return (
              <G key={si}>
                {showLabel && <SvgText x={sx0} y={height - 4} fontSize={10} fill={c.textMuted} textAnchor="start">{clock(s.t0)}</SvgText>}
                {lines.map((l, li) => {
                  const inside = l.points.filter((p) => p[0] >= s.t0 && p[0] <= s.t1);
                  if (inside.length < 2) return null;
                  const coords = inside.map((p) => [x(p[0]), y(p[1])]);
                  if (si > 0) coords.unshift([sx0, y(0)]); // up from the stop
                  if (si < last) coords.push([sx1, y(0)]); // back down into the next stop
                  const d = coords.map((q, k) => `${k ? 'L' : 'M'}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ');
                  return (
                    <G key={li}>
                      {single && <Path d={`${d} L${coords[coords.length - 1][0].toFixed(1)},${y(0)} L${coords[0][0].toFixed(1)},${y(0)} Z`} fill="url(#spd)" />}
                      <Path d={d} stroke={l.color} strokeWidth={single ? 2 : 1.8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
                    </G>
                  );
                })}
              </G>
            );
          })}
          <SvgText x={pad.l} y={height - 4} fontSize={10} fill={c.textMuted} textAnchor="start">{clock(t0)}</SvgText>
          <SvgText x={w - pad.r} y={height - 4} fontSize={10} fill={c.textMuted} textAnchor="end">{clock(t1)}</SvgText>
          {cx != null && <Line x1={cx} x2={cx} y1={pad.t} y2={y(0)} stroke={c.text} strokeWidth={1} />}
        </Svg>
      )}
    </View>
  );
}

/** Distance and driving on the left, top and average speed on the right, the dial exactly in the middle. */
export function ReplayTotals({ distanceKm, driveText, top, avg, playSpeed, caption, size = 140 }: {
  distanceKm: string; driveText: string; top: number; avg: number; playSpeed: number | null; caption?: string; size?: number;
}) {
  const c = useColors();
  const stat = (value: string, label: string, right?: boolean) => (
    <View style={{ gap: 1, alignItems: right ? 'flex-end' : 'flex-start' }}>
      <Text numberOfLines={1} style={{ fontFamily: type.name.fontFamily, fontSize: 18, lineHeight: 24, color: c.text }}>{value}</Text>
      <Text style={{ fontFamily: type.caption.fontFamily, fontSize: 12, color: c.textMuted }}>{label}</Text>
    </View>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2 }}>
      <View style={{ flex: 1, minWidth: 0, gap: 14, justifyContent: 'center' }}>
        {stat(`${distanceKm} km`, 'Distance')}
        {stat(driveText, 'Driving')}
      </View>
      <SpeedGauge size={size} value={playSpeed} caption={caption} />
      <View style={{ flex: 1, minWidth: 0, gap: 14, justifyContent: 'center', alignItems: 'flex-end' }}>
        {stat(`${top} km/h`, 'Top speed', true)}
        {stat(avg ? `${avg} km/h` : '—', 'Avg speed', true)}
      </View>
    </View>
  );
}

/**
 * Speedometer dial from the design: white disc, 240° track with the speed
 * filled in, ticks every 10 and numbers every 20 (0–100), needle and hub,
 * and the speed (or nothing) underneath. `value` null = not playing.
 */
export function SpeedGauge({ value, caption, size = 140 }: { value: number | null; caption?: string; size?: number }) {
  const c = useColors();
  const max = 100;
  const fr = Math.max(0, Math.min(1, (value ?? 0) / max));
  // Ticks every 10 km/h along the 240° sweep (long at 0/20/40…); numbers every 20.
  const at = (v: number, r: number) => {
    const a = ((-120 + 240 * (v / max) - 90) * Math.PI) / 180;
    return [60 + r * Math.cos(a), 60 + r * Math.sin(a)];
  };
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const v = i * 10;
    const [x1, y1] = at(v, 40);
    const [x2, y2] = at(v, i % 2 === 0 ? 37 : 40);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }).join('');
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel={value != null ? `Speedometer ${value} km/h` : 'Speedometer'}>
      <Circle cx={60} cy={60} r={57} fill={c.dark ? c.surface : '#FFFFFF'} />
      <Circle cx={60} cy={60} r={44} fill="none" stroke={c.surface2} strokeWidth={7} strokeDasharray="184.3 276.5" transform="rotate(150 60 60)" />
      {fr > 0 && (
        <Circle cx={60} cy={60} r={44} fill="none" stroke={c.accent} strokeWidth={7} strokeDasharray={`${(184.3 * fr).toFixed(1)} 276.5`} transform="rotate(150 60 60)" />
      )}
      <Path d={ticks} stroke={c.textMuted} strokeWidth={1.2} strokeLinecap="round" />
      {[0, 20, 40, 60, 80, 100].map((v) => {
        const [x, y] = at(v, 29);
        return <SvgText key={v} x={x} y={y + 3} fontSize={8} fill={c.textMuted} textAnchor="middle">{v}</SvgText>;
      })}
      <Line x1={60} y1={60} x2={60} y2={25} stroke={c.accent} strokeWidth={2.5} strokeLinecap="round" transform={`rotate(${(-120 + 240 * fr).toFixed(1)} 60 60)`} />
      <Circle cx={60} cy={60} r={5} fill={c.text} />
      {value != null && (
        <>
          <SvgText x={60} y={94} fontSize={21} fontWeight="700" fill={c.text} textAnchor="middle">{value}</SvgText>
          <SvgText x={60} y={105} fontSize={8.5} fill={c.textMuted} textAnchor="middle">{caption ?? 'km/h'}</SvgText>
        </>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  speeds: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  speedChip: { minWidth: 46, height: 34, paddingHorizontal: 10, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scrub: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  play: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 32, justifyContent: 'center' },
  rail: { position: 'absolute', left: 0, right: 0, height: 8, borderRadius: 4 },
  knob: { position: 'absolute', width: 20, height: 20, borderRadius: 10 },
});
