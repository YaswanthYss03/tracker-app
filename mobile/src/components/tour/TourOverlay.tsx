// First-time tour: dims the screen, cuts a hole around one feature at a time and shows a
// small card with Back / Next and a Skip. Starts once per account; Profile can replay it.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, BackHandler, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '@/auth/AuthProvider';
import { useTrackers } from '@/live/TrackersProvider';
import { setPref, usePref, usePrefsLoaded } from '@/lib/prefs';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';
import { TAB_BAR, getTarget, startTour, stopTour, useTourActive, type ViewNode } from './store';

// tab: position of the bottom tab (Home 0, Map 1, Replay 2, Profile 3); those are highlighted by position.
type Step = { id: string; title: string; body: string; needsVehicle?: boolean; tab?: number };

const STEPS: Step[] = [
  { id: 'add', title: 'Add your vehicle', body: 'Scan the IMEI on your tracker, or type it, then enter the activation code.' },
  { id: 'vehicle', title: 'Your vehicles', body: 'Tap a vehicle to see where it is now, its speed and whether the ignition is on.', needsVehicle: true },
  { id: 'alerts', title: 'Alerts', body: 'Overspeed, power cut, geofence and offline alerts show up here.' },
  { id: 'map', tab: 1, title: 'Map', body: 'See every vehicle on one live map.' },
  { id: 'replay', tab: 2, title: 'Replay', body: 'Play back any ride at 1x to 10x speed, with stop markers.' },
  { id: 'profile', tab: 3, title: 'Profile', body: 'Your drivers, sharing, notification settings, and this tour again any time.' },
];

type Rect = { x: number; y: number; w: number; h: number };
const PAD = 6;
const CARD_MAX = 340;
const MARGIN = 16;

function measure(node: ViewNode): Promise<Rect | null> {
  return new Promise((resolve) => node.measureInWindow((x, y, w, h) => resolve(w > 0 && h > 0 ? { x, y, w, h } : null)));
}

export function TourOverlay() {
  const c = useColors();
  const { user } = useAuth();
  const { devices, isLoading } = useTrackers();
  const prefsLoaded = usePrefsLoaded();
  const seen = usePref('tourSeen');
  const active = useTourActive();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const rootRef = useRef<ViewNode>(null);
  const [index, setIndex] = useState(0);
  // null: still looking; false: element not found (the step shows without a highlight)
  const [rect, setRect] = useState<Rect | null | false>(null);
  const [size, setSize] = useState({ w: width, h: height });

  const steps = useMemo(() => STEPS.filter((s) => !s.needsVehicle || devices.length > 0), [devices.length]);
  const step = steps[Math.min(index, steps.length - 1)];

  // First time on this account: start once the vehicle list has loaded.
  const userId = user?.id;
  useEffect(() => {
    if (!userId || !prefsLoaded || isLoading || seen[userId]) return;
    const t = setTimeout(startTour, 700);
    return () => clearTimeout(t);
  }, [userId, prefsLoaded, isLoading, seen]);

  const finish = useCallback(() => {
    stopTour();
    setIndex(0);
    setRect(null);
    if (userId) setPref('tourSeen', { ...seen, [userId]: true });
  }, [userId, seen]);

  // Find the current step's element (relative to this overlay). Tabs are placed from the tab bar's layout;
  // if an element can't be found the step still shows, just without a highlight.
  useEffect(() => {
    if (!active || !step) return;
    let cancelled = false;
    setRect(null);
    const announce = () => AccessibilityInfo.announceForAccessibility(`${step.title}. ${step.body}`);
    if (step.tab != null) {
      const slot = (size.w - TAB_BAR.padX * 2) / TAB_BAR.count;
      const barH = TAB_BAR.height + insets.bottom;
      setRect({ x: TAB_BAR.padX + step.tab * slot, y: size.h - barH + TAB_BAR.padTop, w: slot, h: barH - TAB_BAR.padTop - insets.bottom - TAB_BAR.padBottom });
      announce();
      return;
    }
    (async () => {
      for (let attempt = 0; attempt < 8 && !cancelled; attempt++) {
        const node = getTarget(step.id);
        const origin = rootRef.current ? await measure(rootRef.current) : null;
        const r = node ? await measure(node) : null;
        if (cancelled) return;
        if (r && origin) {
          const fit = { x: r.x - origin.x, y: r.y - origin.y, w: r.w, h: r.h };
          if (fit.y >= 0 && fit.y + fit.h <= size.h && fit.x >= 0 && fit.x + fit.w <= size.w + 1) {
            setRect(fit);
            announce();
            return;
          }
        }
        await new Promise((res) => setTimeout(res, 120));
      }
      if (!cancelled) { setRect(false); announce(); }
    })();
    return () => { cancelled = true; };
  }, [active, step?.id, size.w, size.h, insets.bottom]); // eslint-disable-line react-hooks/exhaustive-deps

  // Android back button skips the tour.
  useEffect(() => {
    if (!active) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { finish(); return true; });
    return () => sub.remove();
  }, [active, finish]);

  if (!active || !step) return null;

  const last = index >= steps.length - 1;
  const hole = rect ? { x: rect.x - PAD, y: rect.y - PAD, w: rect.w + PAD * 2, h: rect.h + PAD * 2 } : null;
  const W = size.w;
  const H = size.h;
  const radius = hole ? Math.min(18, hole.h / 2) : 0;
  const d = hole
    ? `M0 0H${W}V${H}H0Z M${hole.x + radius} ${hole.y}H${hole.x + hole.w - radius}A${radius} ${radius} 0 0 1 ${hole.x + hole.w} ${hole.y + radius}V${hole.y + hole.h - radius}A${radius} ${radius} 0 0 1 ${hole.x + hole.w - radius} ${hole.y + hole.h}H${hole.x + radius}A${radius} ${radius} 0 0 1 ${hole.x} ${hole.y + hole.h - radius}V${hole.y + radius}A${radius} ${radius} 0 0 1 ${hole.x + radius} ${hole.y}Z`
    : `M0 0H${W}V${H}H0Z`;

  const cardW = Math.min(W - MARGIN * 2, CARD_MAX);
  const below = hole ? hole.y + hole.h / 2 < H / 2 : true;
  const cardLeft = hole ? Math.max(MARGIN, Math.min(W - MARGIN - cardW, hole.x + hole.w / 2 - cardW / 2)) : (W - cardW) / 2;
  const arrowLeft = hole ? Math.max(18, Math.min(cardW - 30, hole.x + hole.w / 2 - cardLeft - 6)) : 24;
  const cardBg = c.dark ? c.surface : '#FFFFFF';

  return (
    <View ref={rootRef} collapsable={false} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })} style={StyleSheet.absoluteFill} accessibilityViewIsModal importantForAccessibility="yes">
      <Pressable style={StyleSheet.absoluteFill} onPress={finish} accessibilityLabel="Skip the tour" accessibilityRole="button">
        <Animated.View key={step.id} entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} style={StyleSheet.absoluteFill}>
          <Svg width={W} height={H}>
            <Path d={d} fillRule="evenodd" fill="rgba(0,0,0,0.62)" />
            {hole && <Path d={`M${hole.x + radius} ${hole.y}H${hole.x + hole.w - radius}A${radius} ${radius} 0 0 1 ${hole.x + hole.w} ${hole.y + radius}V${hole.y + hole.h - radius}A${radius} ${radius} 0 0 1 ${hole.x + hole.w - radius} ${hole.y + hole.h}H${hole.x + radius}A${radius} ${radius} 0 0 1 ${hole.x} ${hole.y + hole.h - radius}V${hole.y + radius}A${radius} ${radius} 0 0 1 ${hole.x + radius} ${hole.y}Z`} fill="none" stroke="#FFFFFF" strokeWidth={2} />}
          </Svg>
        </Animated.View>
      </Pressable>

      {rect !== null && (
        <Animated.View
          key={`card-${step.id}`}
          entering={FadeIn.duration(180)}
          style={[
            styles.card,
            { width: cardW, left: cardLeft, backgroundColor: cardBg },
            !hole ? { top: H / 2 - 80 } : below ? { top: hole.y + hole.h + 14 } : { bottom: H - hole.y + 14 },
          ]}
        >
          {hole && <View style={[styles.arrow, { backgroundColor: cardBg, left: arrowLeft }, below ? { top: -6 } : { bottom: -6 }]} />}
          <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: c.text }}>{step.title}</Text>
          <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.body, fontSize: 14.5, lineHeight: 20, color: c.textMuted, marginTop: 4 }}>{step.body}</Text>
          <View style={styles.footer}>
            <Pressable onPress={finish} accessibilityRole="button" accessibilityLabel="Skip tour" hitSlop={8} style={styles.skip}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: c.textMuted }}>Skip</Text>
            </Pressable>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: c.textMuted, flex: 1, textAlign: 'center' }} accessibilityLabel={`Step ${index + 1} of ${steps.length}`}>{index + 1} of {steps.length}</Text>
            {index > 0 && (
              <Pressable onPress={() => setIndex((i) => i - 1)} accessibilityRole="button" accessibilityLabel="Back" style={[styles.btn, { backgroundColor: c.dark ? c.surface2 : '#F2F2F2' }]}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>Back</Text>
              </Pressable>
            )}
            <Pressable onPress={last ? finish : () => setIndex((i) => i + 1)} accessibilityRole="button" accessibilityLabel={last ? 'Done' : 'Next'} style={[styles.btn, { backgroundColor: c.accent }]}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#FFFFFF' }}>{last ? 'Done' : 'Next'}</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', borderRadius: 18, padding: 16, elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  arrow: { position: 'absolute', width: 12, height: 12, transform: [{ rotate: '45deg' }] },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  skip: { minHeight: 40, justifyContent: 'center', paddingRight: 6 },
  btn: { minHeight: 40, minWidth: 64, paddingHorizontal: 14, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
