/**
 * Motion effects (all respect the phone's "reduce motion" setting):
 *
 *   <Skeleton />        shimmer: grey placeholder with a highlight moving left → right
 *   <SkeletonRows />    a few placeholder list rows while data loads
 *   <LightSweep>        a beam of light crossing a button, card or logo
 *   <SweepText>         the same beam, but only over the text/logo shape (masked)
 *   <GlowSweep />       a soft, wide marigold glow drifting across a card
 *   <GradientSweep>     an endlessly moving gradient (e.g. the wordmark underline)
 *   <PLoader />         the "P" loading animation (company initial)
 */
import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import RNMaskedView from '@react-native-masked-view/masked-view';
import Svg, { Circle } from 'react-native-svg';
import { brand } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import { radius as radii, space, useColors } from '@/theme';

// masked-view's class typings don't match React 19's JSX types yet.
const MaskedView = RNMaskedView as unknown as ComponentType<any>;

/** '#EAAA00' + 0.4 -> 'rgba(234,170,0,0.4)' (gradients fade to the same color, not to black). */
function rgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** 0 → 1 progress that repeats forever: wait `delay`, then run for `duration`. */
function useLoop(duration: number, delay: number, enabled: boolean) {
  const p = useSharedValue(0);
  useEffect(() => {
    if (!enabled) {
      p.value = 0;
      return;
    }
    p.value = 0;
    p.value = withRepeat(
      withSequence(withDelay(delay, withTiming(1, { duration, easing: Easing.inOut(Easing.quad) })), withTiming(0, { duration: 0 })),
      -1,
    );
    return () => cancelAnimation(p);
  }, [duration, delay, enabled, p]);
  return p;
}

type SweepProps = {
  /** Beam color (hex). */
  color?: string;
  /** Strongest opacity in the middle of the beam. */
  intensity?: number;
  /** Beam width as a share of the element width. */
  band?: number;
  duration?: number;
  /** Pause between passes. */
  delay?: number;
  /** Tilt of the beam in degrees (0 = vertical). */
  angle?: number;
  style?: StyleProp<ViewStyle>;
};

/** The moving band itself; fills its parent and clips to it. */
export function Sweep({ color = '#FFFFFF', intensity = 0.55, band = 0.35, duration = 1400, delay = 2200, angle = 18, style }: SweepProps) {
  const [w, setW] = useState(0);
  const reduce = useReducedMotion();
  const p = useLoop(duration, delay, w > 0 && !reduce);
  const bandW = Math.max(36, w * band);
  const anim = useAnimatedStyle(() => ({
    transform: [{ translateX: -1.5 * bandW + p.value * (w + 2 * bandW) }, { skewX: `${-angle}deg` }],
  }));
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }, style]} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && !reduce && (
        <Animated.View style={[{ position: 'absolute', top: -40, bottom: -40, left: 0, width: bandW }, anim]}>
          <LinearGradient
            colors={[rgba(color, 0), rgba(color, intensity), rgba(color, 0)]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
    </View>
  );
}

/** Light sweep: wraps a button/card/logo and passes a beam of light over it. */
export function LightSweep({ children, style, ...sweep }: SweepProps & { children: ReactNode }) {
  return (
    <View style={style}>
      {children}
      <Sweep band={0.28} intensity={0.6} {...sweep} />
    </View>
  );
}

/** Beam that only lights up the text/logo pixels (not the background around it). */
export function SweepText({ children, style, color, ...sweep }: SweepProps & { children: ReactNode }) {
  const c = useColors();
  return (
    <View style={style}>
      {children}
      <MaskedView pointerEvents="none" style={StyleSheet.absoluteFill} maskElement={<View>{children}</View>}>
        <Sweep color={color ?? (c.dark ? brand.marigold : '#FFFFFF')} band={0.3} intensity={0.9} {...sweep} />
      </MaskedView>
    </View>
  );
}

/** Glow sweep: soft, wide marigold light drifting across (put inside a card with overflow hidden). */
export function GlowSweep({ color = brand.marigold, ...sweep }: SweepProps) {
  return <Sweep color={color} band={0.9} intensity={0.28} angle={0} duration={2600} delay={900} {...sweep} />;
}

/** Gradient sweep: a gradient that keeps flowing sideways, seamlessly. */
export function GradientSweep({
  colors = [brand.marigold, '#FFD966'],
  duration = 2400,
  style,
  children,
}: {
  colors?: [string, string];
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  const [w, setW] = useState(0);
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (!w || reduce) return;
    p.value = 0;
    p.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(p);
  }, [w, reduce, duration, p]);
  // Three identical periods side by side; sliding by one period loops without a jump.
  const anim = useAnimatedStyle(() => ({ transform: [{ translateX: -p.value * w }] }));
  const [a, b] = colors;
  return (
    <View style={[{ overflow: 'hidden' }, style]} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, left: 0, width: w * 3 }, anim]}>
          <LinearGradient colors={[a, b, a, b, a, b, a]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flex: 1 }} />
        </Animated.View>
      )}
      {children}
    </View>
  );
}

/** Shimmer placeholder block. */
export function Skeleton({ width = '100%', height = 16, radius = 8, style }: { width?: ViewStyle['width']; height?: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  return (
    <View style={[{ width, height, borderRadius: radius, backgroundColor: c.dark ? '#3A1B36' : '#CDD5DC', overflow: 'hidden' }, style]}>
      <Sweep color="#FFFFFF" intensity={c.dark ? 0.12 : 0.55} band={0.6} angle={0} duration={1100} delay={250} />
    </View>
  );
}

/** Placeholder list rows (icon + two lines + number), shown while a list loads. */
export function SkeletonRows({ count = 3, style }: { count?: number; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  return (
    <View style={[{ gap: space.md }, style]} accessibilityLabel="Loading" accessibilityRole="progressbar">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.row, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Skeleton width={48} height={48} radius={24} />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="65%" height={18} />
            <Skeleton width="40%" height={12} />
          </View>
          <Skeleton width={44} height={30} />
        </View>
      ))}
    </View>
  );
}

/**
 * The "P" loader: Pinyon Script P (company initial) in a circle, a marigold
 * arc spinning around it, a soft pulsing halo and a light sweep over the P.
 */
export function PLoader({ size = 92, label }: { size?: number; label?: string }) {
  const c = useColors();
  const reduce = useReducedMotion();
  const spin = useSharedValue(0);
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (reduce) return;
    spin.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.linear }), -1, false);
    pulse.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => {
      cancelAnimation(spin);
      cancelAnimation(pulse);
    };
  }, [reduce, spin, pulse]);

  const ring = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));
  const letter = useAnimatedStyle(() => ({ transform: [{ scale: 0.94 + pulse.value * 0.08 }] }));
  const halo = useAnimatedStyle(() => ({ opacity: 0.1 + pulse.value * 0.25, transform: [{ scale: 1 + pulse.value * 0.18 }] }));

  const stroke = Math.max(4, size * 0.06);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const inner = size - stroke * 2 - 8;

  return (
    <View style={{ alignItems: 'center', gap: space.md }} accessibilityRole="progressbar" accessibilityLabel={label || 'Loading'}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: c.accent }, halo]} />
        <Animated.View style={[StyleSheet.absoluteFill, ring]}>
          <Svg width={size} height={size}>
            <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.border} strokeWidth={stroke} fill="none" opacity={0.6} />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={brand.marigold}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circ * 0.3} ${circ}`}
              fill="none"
            />
          </Svg>
        </Animated.View>
        <View style={{ width: inner, height: inner, borderRadius: inner / 2, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <Animated.View style={letter}>
            <SweepText duration={1000} delay={700} color={brand.marigold}>
              <Text
                maxFontSizeMultiplier={1}
                style={{ fontFamily: fonts.script, fontSize: inner * 0.72, lineHeight: inner * 1.05, color: c.text, paddingHorizontal: inner * 0.12, includeFontPadding: false }}
              >
                P
              </Text>
            </SweepText>
          </Animated.View>
        </View>
      </View>
      {label ? <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: c.textMuted }}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
