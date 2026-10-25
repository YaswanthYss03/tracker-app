/**
 * Pieces for trip screens:
 *   <Scrubber>    play/pause + a bar you can drag (0..1)
 *   <SpeedChart>  speed over time as a soft area chart
 *   <SpeedGauge>  half-circle gauge with a needle
 */
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
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
        style={[styles.play, { backgroundColor: c.surface, opacity: disabled ? 0.4 : 1 }, shadow.card]}
      >
        <Ionicons name={playing ? 'pause' : 'play'} size={20} color={c.text} style={{ marginLeft: playing ? 0 : 2 }} />
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
        <View style={[styles.rail, { backgroundColor: c.surface2 }]} />
        <View style={[styles.rail, { width: `${value * 100}%`, backgroundColor: c.accent }]} />
        <View style={[styles.knob, { left: value * w - 9, backgroundColor: c.accent, borderColor: c.surface }]} />
      </View>
      {label ? <Text style={[type.caption, { color: c.text, letterSpacing: 0, fontFamily: type.fieldLabel.fontFamily }]}>{label}</Text> : null}
    </View>
  );
}

/** Speed (km/h) over time. `points` are [ms, speed]; `cursor` 0..1 draws a marker. */
export function SpeedChart({ points, height = 120, cursor }: { points: [number, number][]; height?: number; cursor?: number | null }) {
  const c = useColors();
  const [w, setW] = useState(0);
  const pad = { l: 28, r: 6, t: 8, b: 14 };
  const max = Math.max(60, Math.ceil(Math.max(...points.map((p) => p[1]), 0) / 20) * 20);
  const t0 = points[0]?.[0] ?? 0;
  const t1 = points[points.length - 1]?.[0] ?? 1;
  const x = (t: number) => pad.l + ((t - t0) / Math.max(1, t1 - t0)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (height - pad.t - pad.b);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
  const area = points.length ? `${line} L${x(t1).toFixed(1)},${y(0)} L${x(t0).toFixed(1)},${y(0)} Z` : '';
  const ticks = [0, max / 2, max];
  const cx = cursor != null ? pad.l + cursor * (w - pad.l - pad.r) : null;
  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ height }} accessibilityLabel={`Speed chart, top ${Math.max(0, ...points.map((p) => p[1]))} km/h`}>
      {w > 0 && points.length > 1 && (
        <Svg width={w} height={height}>
          <Defs>
            <LinearGradient id="spd" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={c.accent} stopOpacity={0.45} />
              <Stop offset="1" stopColor={c.accent} stopOpacity={0.05} />
            </LinearGradient>
          </Defs>
          {ticks.map((v) => (
            <Line key={v} x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke={c.border} strokeWidth={1} strokeDasharray={v ? '3 4' : undefined} />
          ))}
          {ticks.map((v) => (
            <SvgText key={`l${v}`} x={pad.l - 6} y={y(v) + 4} fontSize={10} fill={c.textMuted} textAnchor="end">{Math.round(v)}</SvgText>
          ))}
          <Path d={area} fill="url(#spd)" />
          <Path d={line} stroke={c.text} strokeWidth={1.6} fill="none" strokeLinejoin="round" />
          {cx != null && <Line x1={cx} x2={cx} y1={pad.t} y2={y(0)} stroke={c.text} strokeWidth={1} />}
        </Svg>
      )}
    </View>
  );
}

/** Half-circle gauge (0..max km/h) with a needle at `value`. */
export function SpeedGauge({ value, max = 120, size = 130, label }: { value: number; max?: number; size?: number; label: string }) {
  const c = useColors();
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const pt = (v: number, rr = r) => {
    const a = Math.PI * (1 - Math.min(v, max) / max);
    return [cx + rr * Math.cos(a), cy - rr * Math.sin(a)];
  };
  const arc = (v0: number, v1: number) => {
    const [x0, y0] = pt(v0);
    const [x1, y1] = pt(v1);
    return `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`;
  };
  const [nx, ny] = pt(value, r - 14);
  return (
    <View style={{ alignItems: 'center' }} accessibilityLabel={`${label} ${value} km/h`}>
      <Svg width={size} height={size / 2 + 14}>
        <Path d={arc(0, max)} stroke={c.surface2} strokeWidth={10} fill="none" strokeLinecap="round" />
        <Path d={arc(0, Math.max(0.5, value))} stroke={c.accent} strokeWidth={10} fill="none" strokeLinecap="round" />
        {[0, max / 3, (2 * max) / 3, max].map((v) => {
          const [tx, ty] = pt(v, r - 22);
          return <SvgText key={v} x={tx} y={ty + 3} fontSize={9} fill={c.textMuted} textAnchor="middle">{Math.round(v)}</SvgText>;
        })}
        <Line x1={cx} y1={cy} x2={nx} y2={ny} stroke={c.text} strokeWidth={3} strokeLinecap="round" />
        <Circle cx={cx} cy={cy} r={5} fill={c.text} />
      </Svg>
      <Text style={[type.name, { color: c.text, marginTop: -4 }]}>{value} <Text style={[type.caption, { color: c.textMuted }]}>km/h</Text></Text>
      <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrub: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  play: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 32, justifyContent: 'center' },
  rail: { position: 'absolute', left: 0, right: 0, height: 6, borderRadius: 3 },
  knob: { position: 'absolute', width: 18, height: 18, borderRadius: 9, borderWidth: 3 },
});
