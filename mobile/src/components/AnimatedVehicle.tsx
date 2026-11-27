// A vehicle driving on the spot: wheels turn, the body bobs, the road slides underneath and the
// exhaust puffs smoke (the bicycle gets a wind breeze instead; "other" is a floating pin with GPS rings).
// One scene for every type (lib/vehicleAnim.ts) so they all move at the same speed, and the
// wheels turn at the rate the road moves. Plain transforms, so it runs on the UI thread and
// works in Expo Go. Standing still (reduce motion, or `playing` off) shows the same picture.
import { useEffect, useMemo, useState } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Rect, SvgXml } from 'react-native-svg';
import { DEFAULT_BODY, SCENE, animArt, bodySvg, wheelSvg } from '@/lib/vehicleAnim';
import { useColors } from '@/theme';

const SPEED = 120; // design px per second, for the road and (through the radius) the wheels
const DASH = 24;
const GAP = 24;

function Wheel({ x, r, s, playing }: { x: number; r: number; s: number; playing: boolean }) {
  const angle = useSharedValue(0);
  useEffect(() => {
    cancelAnimation(angle);
    angle.value = 0;
    if (playing) angle.value = withRepeat(withTiming(360, { duration: (2 * Math.PI * r * 1000) / SPEED, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(angle);
  }, [playing, r, angle]);
  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${angle.value}deg` }] }));
  const xml = useMemo(() => wheelSvg(r), [r]);
  return (
    <Animated.View style={[{ position: 'absolute', left: (x - r) * s, top: (SCENE.ground - 2 * r) * s, width: 2 * r * s, height: 2 * r * s }, spin]}>
      <SvgXml xml={xml} width="100%" height="100%" />
    </Animated.View>
  );
}

/** Looping 0 -> 1 progress value, started after `delay` ms. */
function useLoop(playing: boolean, duration: number, delay = 0, easing = Easing.linear) {
  const v = useSharedValue(0);
  useEffect(() => {
    cancelAnimation(v);
    v.value = 0;
    if (playing) v.value = withDelay(delay, withRepeat(withTiming(1, { duration, easing }), -1, false));
    return () => cancelAnimation(v);
  }, [playing, duration, delay, easing, v]);
  return v;
}

/** One puff of exhaust smoke: starts small at the pipe, drifts back and up, grows and fades. */
function Puff({ x, y, s, playing, delay, tone }: { x: number; y: number; s: number; playing: boolean; delay: number; tone: string }) {
  const p = useLoop(playing, 1500, delay);
  const style = useAnimatedStyle(() => ({
    opacity: p.value === 0 ? 0 : 0.55 * (1 - p.value),
    transform: [{ translateX: -46 * s * p.value }, { translateY: -26 * s * p.value }, { scale: 0.5 + 1.2 * p.value }],
  }));
  const d = 11 * s;
  return <Animated.View style={[{ position: 'absolute', left: x * s - d / 2, top: y * s - d / 2, width: d, height: d, borderRadius: d / 2, backgroundColor: tone }, style]} />;
}

const STREAK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 14"><path d="M1 9 H38 Q50 9 50 5 Q50 1.5 46 2.5" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/></svg>';

/** A wind streak crossing the scene from the front of the vehicle to the back. */
function Breeze({ y, s, w, playing, delay, dur, tone }: { y: number; s: number; w: number; playing: boolean; delay: number; dur: number; tone: string }) {
  const p = useLoop(playing, dur, delay);
  const style = useAnimatedStyle(() => ({
    opacity: p.value === 0 ? 0 : 0.85 * Math.sin(Math.PI * p.value),
    transform: [{ translateX: w - (w + 80 * s) * p.value }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', left: 0, top: y * s, width: 56 * s, height: 14 * s }, style]}>
      <SvgXml xml={STREAK.replace('#FFFFFF', tone)} width="100%" height="100%" />
    </Animated.View>
  );
}

/** GPS ring spreading over the ground. */
function Ring({ s, playing, delay, tone }: { s: number; playing: boolean; delay: number; tone: string }) {
  const p = useLoop(playing, 2100, delay, Easing.out(Easing.quad));
  const style = useAnimatedStyle(() => ({ opacity: p.value === 0 ? 0 : 0.55 * (1 - p.value), transform: [{ scale: 0.2 + 1.5 * p.value }] }));
  const w = 130 * s;
  const h = 30 * s;
  return <Animated.View style={[{ position: 'absolute', left: 120 * s - w / 2, top: 112 * s - h / 2, width: w, height: h, borderRadius: h, borderWidth: 2, borderColor: tone }, style]} />;
}

export function AnimatedVehicle({ type, color, height = 150, playing = true, clip = true, style }: {
  type?: string | null;
  /** Body colour as #RRGGBB; each type has its own default. */
  color?: string | null;
  height?: number;
  playing?: boolean;
  /** Cut the picture off at the edges of this box (off: it may spill over the card behind it). */
  clip?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const c = useColors();
  const reduce = useReducedMotion();
  const live = playing && !reduce;
  const s = height / SCENE.h;
  const [width, setWidth] = useState(SCENE.w * s);
  const art = animArt(type);
  const xml = useMemo(() => bodySvg(type, color || DEFAULT_BODY[type ?? ''] || DEFAULT_BODY.other), [type, color]);

  const ping = art.mode === 'ping';
  const bob = useSharedValue(0);
  const road = useSharedValue(0);
  useEffect(() => {
    cancelAnimation(bob);
    cancelAnimation(road);
    bob.value = 0;
    road.value = 0;
    if (!live) return undefined;
    if (ping) {
      bob.value = withRepeat(withTiming(-9 * s, { duration: 750, easing: Easing.inOut(Easing.sin) }), -1, true);
    } else {
      bob.value = withRepeat(withTiming(-1.6 * s, { duration: 260, easing: Easing.inOut(Easing.quad) }), -1, true);
      road.value = withRepeat(withTiming(-(DASH + GAP) * s, { duration: ((DASH + GAP) * 1000) / SPEED, easing: Easing.linear }), -1, false);
    }
    return () => { cancelAnimation(bob); cancelAnimation(road); };
  }, [live, ping, s, bob, road]);
  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));
  const roadStyle = useAnimatedStyle(() => ({ transform: [{ translateX: road.value }] }));
  const shadowStyle = useAnimatedStyle(() => ({ opacity: 0.18 + (bob.value / (-9 * s)) * -0.1, transform: [{ scaleX: 1 + (bob.value / (9 * s)) * 0.25 }] }));

  const sceneW = SCENE.w * s;
  const left = (width - sceneW) / 2; // the scene is centred; puffs and rings are placed in scene units
  const roadTop = (SCENE.ground + 1) * s;
  const dashes = Math.ceil(width / ((DASH + GAP) * s)) + 2;
  const ink = c.dark ? '#FFFFFF' : '#202020';
  const smoke = c.dark ? '#C9CDD2' : '#8E959C';
  const breeze = c.dark ? '#E4E8EC' : '#8FA3B3';
  const ringTone = c.dark ? '#E5484D' : '#C8302E';

  return (
    <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)} style={[{ width: '100%', height, overflow: clip ? 'hidden' : 'visible', alignItems: 'center' }, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {ping ? (
        <>
          {/* GPS rings and a soft shadow under the floating pin */}
          <View style={{ position: 'absolute', left, top: 0, width: sceneW, height }}>
            {[0, 700, 1400].map((d) => <Ring key={d} s={s} playing={live} delay={d} tone={ringTone} />)}
            <Animated.View style={[{ position: 'absolute', left: 108 * s, top: 110 * s, width: 24 * s, height: 5 * s, borderRadius: 5 * s, backgroundColor: ink }, shadowStyle]} />
          </View>
        </>
      ) : (
        <>
          {/* ground: a thin line with dashes sliding under the wheels */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: roadTop, height: 2 * s, backgroundColor: ink, opacity: 0.18 }} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: roadTop + 8 * s, height: 3 * s, overflow: 'hidden' }}>
            <Animated.View style={[{ width: dashes * (DASH + GAP) * s, height: 3 * s }, roadStyle]}>
              <Svg width="100%" height="100%" viewBox={`0 0 ${dashes * (DASH + GAP)} 3`} preserveAspectRatio="none">
                {Array.from({ length: dashes }, (_, i) => <Rect key={i} x={i * (DASH + GAP)} y={0} width={DASH} height={3} rx={1.5} fill={ink} opacity={0.22} />)}
              </Svg>
            </Animated.View>
          </View>
          {/* exhaust smoke behind the vehicle, or a breeze for the bicycle */}
          {live && art.exhaust ? (
            <View pointerEvents="none" style={{ position: 'absolute', left, top: 0, width: sceneW, height }}>
              {[0, 500, 1000].map((d) => <Puff key={d} x={art.exhaust!.x} y={art.exhaust!.y} s={s} playing={live} delay={d} tone={smoke} />)}
            </View>
          ) : null}
          {live && !art.exhaust ? (
            <View pointerEvents="none" style={{ position: 'absolute', left, top: 0, width: sceneW, height }}>
              <Breeze y={34} s={s} w={sceneW} playing={live} delay={0} dur={1400} tone={breeze} />
              <Breeze y={58} s={s} w={sceneW} playing={live} delay={450} dur={1200} tone={breeze} />
              <Breeze y={82} s={s} w={sceneW} playing={live} delay={900} dur={1500} tone={breeze} />
              <Breeze y={20} s={s} w={sceneW} playing={live} delay={1100} dur={1300} tone={breeze} />
            </View>
          ) : null}
        </>
      )}
      {/* vehicle */}
      <Animated.View style={[{ width: sceneW, height }, bobStyle]}>
        <SvgXml xml={xml} width={sceneW} height={height} />
        {art.wheels.map((w) => <Wheel key={w.x} x={w.x} r={w.r} s={s} playing={live} />)}
      </Animated.View>
    </View>
  );
}
