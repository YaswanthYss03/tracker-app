/**
 * Pieces for trip screens:
 *   <Scrubber>    play/pause + a bar you can drag (0..1)
 *   <SpeedChart>  speed over time as a soft area chart
 *   <SpeedGauge>  speedometer dial with a needle
 */
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { DIcon } from '@/components/DesignIcon';
import { shadow, space, type, useColors } from '@/theme';

/** Plays 0 → 1 over `durationMs` while `playing`; returns [progress, setProgress]. */
export function usePlayback(playing: boolean, setPlaying: (v: boolean) => void, durationMs = 12_000) {
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  pRef.current = p;
  useEffect(() => {
    if (!playing) return undefined;
    if (pRef.current >= 1) setP(0);
    let last = Date.now();
    const t = setInterval(() => {
      const now = Date.now();
      const next = Math.min(1, (pRef.current >= 1 ? 0 : pRef.current) + (now - last) / durationMs);
      last = now;
      setP(next);
      if (next >= 1) setPlaying(false);
    }, 50);
    return () => clearInterval(t);
  }, [playing, durationMs, setPlaying]);
  return [p, setP] as const;
}

export function Scrubber({ value, onChange, playing, onPlay, label, disabled }: {
  value: number; onChange: (v: number) => void; playing: boolean; onPlay: () => void; label?: string; disabled?: boolean;
}) {
  const c = useColors();
  const [w, setW] = useState(1);
  const pick = (e: GestureResponderEvent) => onChange(Math.max(0, Math.min(1, e.nativeEvent.locationX / w)));
  return (
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
  );
}

/**
 * Speed (km/h) over time as a line chart. `points` = one line ([ms, speed]);
 * `series` = several coloured lines (Compare). `cursor` 0..1 draws a marker.
 */
export function SpeedChart({ points, series, height = 120, cursor }: {
  points?: [number, number][]; series?: { points: [number, number][]; color: string }[]; height?: number; cursor?: number | null;
}) {
  const c = useColors();
  const [w, setW] = useState(0);
  const lines = series ?? [{ points: points ?? [], color: c.accent }];
  const all = lines.flatMap((l) => l.points);
  const pad = { l: 28, r: 6, t: 8, b: 14 };
  const max = Math.max(60, Math.ceil(Math.max(...all.map((p) => p[1]), 0) / 20) * 20);
  const t0 = all.length ? Math.min(...all.map((p) => p[0])) : 0;
  const t1 = all.length ? Math.max(...all.map((p) => p[0])) : 1;
  const x = (t: number) => pad.l + ((t - t0) / Math.max(1, t1 - t0)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (height - pad.t - pad.b);
  const path = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
  const ticks = [0, max / 2, max];
  const cx = cursor != null ? pad.l + cursor * (w - pad.l - pad.r) : null;
  const single = lines.length === 1;
  const top = Math.max(0, ...all.map((p) => p[1]));
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
          {single && lines[0].points.length > 1 && (
            <Path d={`${path(lines[0].points)} L${x(lines[0].points[lines[0].points.length - 1][0]).toFixed(1)},${y(0)} L${x(lines[0].points[0][0]).toFixed(1)},${y(0)} Z`} fill="url(#spd)" />
          )}
          {lines.map((l, i) => l.points.length > 1 && (
            <Path key={i} d={path(l.points)} stroke={l.color} strokeWidth={single ? 2 : 1.8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          ))}
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
  scrub: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  play: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 32, justifyContent: 'center' },
  rail: { position: 'absolute', left: 0, right: 0, height: 8, borderRadius: 4 },
  knob: { position: 'absolute', width: 20, height: 20, borderRadius: 10 },
});
