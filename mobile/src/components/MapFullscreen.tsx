// Full-screen map of all vehicles. It grows out of the map card on Home
// (smooth expand from the card's position and corners) and shrinks back into
// it when closed. The Pavakie logo sits at the top centre once it is open.
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppMap, type LatLon, type MapMarker } from './Map';
import { AppText } from './ui';
import { radius, space, type, useColors } from '@/theme';

export type Rect = { x: number; y: number; width: number; height: number };

export function MapFullscreen({
  visible, from, markers, onClose, onMarkerPress,
}: {
  visible: boolean;
  /** The map card's position on screen (where the animation starts and ends). */
  from: Rect | null;
  markers: MapMarker[];
  onClose: () => void;
  onMarkerPress?: (id: string) => void;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();
  const p = useSharedValue(0); // 0 = card, 1 = full screen
  const [mounted, setMounted] = useState(false);
  const [fitKey, setFitKey] = useState(0);
  const points: LatLon[] = markers.map((m) => ({ lat: m.lat, lon: m.lon }));

  useEffect(() => {
    if (visible) {
      setMounted(true);
      p.value = 0;
      p.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
    }
  }, [visible, p]);

  function close() {
    p.value = withTiming(0, { duration: 340, easing: Easing.in(Easing.cubic) }, (done) => {
      if (done) runOnJS(finish)();
    });
  }
  function finish() {
    setMounted(false);
    onClose();
  }

  const start = from ?? { x: space.lg, y: H * 0.15, width: W - space.lg * 2, height: 200 };
  const frame = useAnimatedStyle(() => ({
    left: interpolate(p.value, [0, 1], [start.x, 0]),
    top: interpolate(p.value, [0, 1], [start.y, 0]),
    width: interpolate(p.value, [0, 1], [start.width, W]),
    height: interpolate(p.value, [0, 1], [start.height, H]),
    borderRadius: interpolate(p.value, [0, 1], [radius.lg, 0]),
  }));
  const backdrop = useAnimatedStyle(() => ({ opacity: p.value * 0.35 }));
  // Controls appear once the map has (almost) filled the screen.
  const chrome = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0.75, 1], [0, 1], 'clamp'),
    transform: [{ translateY: interpolate(p.value, [0.75, 1], [-8, 0], 'clamp') }],
  }));

  if (!mounted) return null;

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={close}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }, backdrop]} />
      <Animated.View style={[styles.frame, { backgroundColor: c.surface }, frame]}>
        <AppMap
          style={StyleSheet.absoluteFill}
          initialCenter={points[0]}
          initialZoom={12}
          markers={markers}
          fitTo={points}
          fitKey={`full-${fitKey}`}
          onMarkerPress={(id) => {
            onMarkerPress?.(id);
          }}
        />

        {/* Pavakie, top centre */}
        <Animated.View style={[styles.top, { top: insets.top + space.sm }, chrome]} pointerEvents="none">
          <View style={[styles.logoPill, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={[styles.logoMark, { backgroundColor: c.accent }]}>
              <Ionicons name="location" size={14} color={c.onAccent} />
            </View>
            <Text maxFontSizeMultiplier={1} style={[type.wordmark, { fontSize: 26, lineHeight: 34, color: c.text }]}>Pavakie</Text>
          </View>
        </Animated.View>

        {/* Close (top right) */}
        <Animated.View style={[styles.closeWrap, { top: insets.top + space.sm }, chrome]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Exit full screen" onPress={close} style={[styles.round, { backgroundColor: c.surface }]}>
            <Ionicons name="contract-outline" size={20} color={c.text} />
          </Pressable>
        </Animated.View>

        {/* Bottom: count + show all */}
        <Animated.View style={[styles.bottom, { bottom: insets.bottom + space.lg }, chrome]}>
          <View style={[styles.countPill, { backgroundColor: c.surface }]}>
            <Ionicons name="car-sport-outline" size={16} color={c.text} />
            <AppText variant="bodyStrong">{markers.length} {markers.length === 1 ? 'vehicle' : 'vehicles'} on the map</AppText>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Show all vehicles" onPress={() => setFitKey((n) => n + 1)} style={[styles.round, { backgroundColor: c.surface }]}>
            <Ionicons name="scan-outline" size={20} color={c.text} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const shadow = { elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } };
const styles = StyleSheet.create({
  frame: { position: 'absolute', overflow: 'hidden' },
  top: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  logoPill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 6, paddingRight: 16, paddingVertical: 4, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth, ...shadow },
  logoMark: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  closeWrap: { position: 'absolute', right: space.lg },
  round: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', ...shadow },
  bottom: { position: 'absolute', left: space.lg, right: space.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countPill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: space.lg, height: 44, borderRadius: 22, ...shadow },
});
