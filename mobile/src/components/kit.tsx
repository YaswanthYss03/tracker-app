/**
 * Design v2 building blocks (shapes and spacing from the Pavakie prototype,
 * colours from the existing app palette):
 *
 *   TopBar · RoundButton · Chip · UnderlineTabs · Card · PillButton · Input ·
 *   Plate · StatusDot · Sheet · Dialog · Banner · Toggle · Stat
 */
import { useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View,
  type StyleProp, type TextInputProps, type ViewStyle,
} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { radius, shadow, space, type, useColors } from '@/theme';
import type { StatusGroup } from '@/lib/vehicleStatus';
import { statusColor } from '@/lib/vehicleStatus';
import { VehicleArt } from './VehicleArt';
import { colorOf } from '@/lib/vehicleColors';

type IconName = keyof typeof Ionicons.glyphMap;
const tap = () => Haptics.selectionAsync().catch(() => {});
/** Soft marigold tint used for selected / highlighted backgrounds. */
export const accentTint = 'rgba(217,54,54,0.13)';

// ---------- Top bar ----------

/** ‹ back or ✕ close, title, optional round action on the right. */
export function TopBar({ title, onBack, close, right, children }: { title?: ReactNode; onBack?: () => void; close?: boolean; right?: ReactNode; children?: ReactNode }) {
  const c = useColors();
  return (
    <View style={styles.topBar}>
      {onBack && (
        <Pressable accessibilityRole="button" accessibilityLabel={close ? 'Close' : 'Back'} onPress={onBack} hitSlop={10} style={styles.topBarLeft}>
          <Ionicons name={close ? 'close' : 'chevron-back'} size={26} color={c.text} />
        </Pressable>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        {typeof title === 'string' ? <Text numberOfLines={1} maxFontSizeMultiplier={1.2} style={[type.title, { color: c.text }]}>{title}</Text> : title}
        {children}
      </View>
      {right}
    </View>
  );
}

// ---------- Buttons ----------

/** White round icon button with soft shadow; optional count badge or "+" mark. */
export function RoundButton({ icon, onPress, label, size = 44, badge, plus, filled, iconSize }: {
  icon: IconName; onPress: () => void; label: string; size?: number; badge?: number | string; plus?: boolean; filled?: boolean; iconSize?: number;
}) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={badge ? `${label}, ${badge}` : label}
      onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => [
        { width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: filled ? c.accent : c.surface, opacity: pressed ? 0.85 : 1 },
        shadow.card,
      ]}
    >
      <Ionicons name={icon} size={iconSize ?? Math.round(size * 0.45)} color={filled ? c.onAccent : c.text} />
      {plus && (
        <View style={[styles.plus, { backgroundColor: c.accent }]}>
          <Ionicons name="add" size={11} color={c.onAccent} />
        </View>
      )}
      {badge ? (
        <View style={[styles.badge, { backgroundColor: c.danger, borderColor: c.bg }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/** Full-width pill button (52 px). primary = marigold, dark = aubergine, secondary = outline, danger = red text. */
export function PillButton({ title, onPress, variant = 'primary', icon, loading, disabled, style, small }: {
  title: string; onPress: () => void; variant?: 'primary' | 'dark' | 'secondary' | 'danger' | 'soft'; icon?: IconName; loading?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>; small?: boolean;
}) {
  const c = useColors();
  const pal = {
    primary: { bg: c.accent, fg: c.onAccent, border: c.accent },
    dark: { bg: c.text, fg: c.bg, border: c.text },
    secondary: { bg: c.surface, fg: c.text, border: c.border },
    danger: { bg: c.surface, fg: c.danger, border: c.border },
    soft: { bg: c.successSoft, fg: c.success, border: c.successSoft },
  }[variant];
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      disabled={off}
      onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => [
        { height: small ? 40 : 52, borderRadius: radius.pill, borderWidth: 1, borderColor: pal.border, backgroundColor: pal.bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: space.lg, opacity: off ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={pal.fg} /> : (
        <>
          {icon && <Ionicons name={icon} size={18} color={pal.fg} />}
          <Text maxFontSizeMultiplier={1.2} style={[type.name, { color: pal.fg, fontSize: small ? 14 : 16 }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

// ---------- Chips & tabs ----------

/** Pill chip (40 px). Selected = aubergine fill. Optional status dot. */
export function Chip({ label, selected, onPress, dot, hollow, icon, mono, outline }: {
  label: string; selected?: boolean; onPress?: () => void; dot?: string; hollow?: boolean; icon?: IconName; mono?: boolean;
  /** For chips on a white card/sheet: grey outline instead of a shadow. */
  outline?: boolean;
}) {
  const c = useColors();
  const fg = selected ? c.bg : c.text;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress ? () => { tap(); onPress(); } : undefined}
      style={[
        styles.chip,
        { backgroundColor: selected ? c.text : outline ? 'transparent' : c.surface },
        outline && { borderWidth: 1, borderColor: selected ? c.text : c.border },
        !selected && !outline && shadow.card,
      ]}
    >
      {dot && <View style={[styles.dot, hollow ? { borderWidth: 1.5, borderColor: dot } : { backgroundColor: dot }]} />}
      {icon && <Ionicons name={icon} size={16} color={fg} />}
      <Text maxFontSizeMultiplier={1.2} style={[mono ? type.plate : type.bodyStrong, { color: fg, fontSize: 14 }]}>{label}</Text>
    </Pressable>
  );
}

/** Text tabs with a marigold underline that slides to the active one (0.2 s). */
export function UnderlineTabs<T extends string>({ value, options, onChange, style }: { value: T; options: [T, string][]; onChange: (v: T) => void; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const [layout, setLayout] = useState<Record<string, { x: number; w: number }>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  useEffect(() => {
    const l = layout[value];
    if (!l) return;
    x.value = withTiming(l.x, { duration: 200, easing: Easing.out(Easing.quad) });
    w.value = withTiming(l.w, { duration: 200, easing: Easing.out(Easing.quad) });
  }, [value, layout, x, w]);
  const bar = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }], width: w.value }));
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border }, style]}>
      {options.map(([key, label]) => {
        const active = key === value;
        return (
          <Pressable
            key={key}
            onPress={() => { tap(); onChange(key); }}
            onLayout={(e) => { const { x: lx, width } = e.nativeEvent.layout; setLayout((p) => ({ ...p, [key]: { x: lx, w: width } })); }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={{ paddingVertical: space.md, paddingHorizontal: 2 }}
          >
            <Text maxFontSizeMultiplier={1.2} style={[active ? type.name : type.body, { color: active ? c.text : c.textMuted }]}>{label}</Text>
          </Pressable>
        );
      })}
      <Animated.View style={[{ position: 'absolute', left: 0, bottom: -1, height: 3, borderRadius: 2, backgroundColor: c.accent }, bar]} />
    </View>
  );
}

// ---------- Cards & content ----------

/** Rounded card (radius 20). `selected` lifts it with a stronger shadow and marigold edge. */
export function Card({ children, style, onPress, selected, padded = true }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; selected?: boolean; padded?: boolean }) {
  const c = useColors();
  const base = [
    { backgroundColor: c.surface, borderRadius: radius.card, borderWidth: 1, borderColor: selected ? c.accent : 'transparent' },
    padded && { padding: space.lg },
    selected ? shadow.lifted : shadow.card,
    style,
  ];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [...base, pressed && { opacity: 0.92 }]}>
      {children}
    </Pressable>
  );
}

/** A vehicle number plate in DM Mono ("TN 38 BX 4521"). */
export function Plate({ value, size = 17, color, numberOfLines = 1 }: { value: string; size?: number; color?: string; numberOfLines?: number }) {
  const c = useColors();
  return (
    <Text numberOfLines={numberOfLines} maxFontSizeMultiplier={1.2} style={[type.plate, { fontSize: size, lineHeight: size * 1.3, color: color ?? c.text }]}>
      {value}
    </Text>
  );
}

export function StatusDot({ group, size = 9 }: { group: StatusGroup; size?: number }) {
  const c = useColors();
  const col = statusColor(group, c);
  return <View style={[{ width: size, height: size, borderRadius: size / 2 }, group === 'offline' ? { borderWidth: 1.5, borderColor: col } : { backgroundColor: col }]} />;
}

/** Big number with small unit, e.g. "1,393 km" and a caption under it. */
export function Stat({ value, unit, label }: { value: string; unit?: string; label: string }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text maxFontSizeMultiplier={1.2}>
        <Text style={[type.h3, { color: c.text, fontSize: 20 }]}>{value}</Text>
        {unit ? <Text style={[type.caption, { color: c.textMuted }]}> {unit}</Text> : null}
      </Text>
      <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{label}</Text>
    </View>
  );
}

/** Dark pill banner (e.g. "Offline · saved 4 min ago"). */
export function Banner({ icon, text, tone = 'dark' }: { icon: IconName; text: string; tone?: 'dark' | 'soft' }) {
  const c = useColors();
  const dark = tone === 'dark';
  return (
    <View accessibilityRole="alert" style={[styles.banner, { backgroundColor: dark ? c.text : c.surface2 }]}>
      <Ionicons name={icon} size={18} color={dark ? c.bg : c.text} />
      <Text style={[type.bodyStrong, { color: dark ? c.bg : c.text, flex: 1, fontSize: 14 }]}>{text}</Text>
    </View>
  );
}

// Soft backgrounds behind the vehicle pictures (light mode).
const TINT: Record<string, string> = {
  car: '#DCE6F3', bike: '#F4DEDE', scooter: '#D9EFEB', bus: '#F5EAC9', van: '#E3E7EC',
  truck: '#F6E2CC', auto: '#E1EFD8', bicycle: '#DCEFE0', tractor: '#F4DCDC', other: '#ECE3EF',
};

/** Vehicle picture on a soft tinted tile. */
export function VehicleTile({ type: kind, width = 76, height = 62, dimmed, deep, color, style }: {
  type?: string | null; width?: ViewStyle['width']; height?: number; dimmed?: boolean;
  /** Stronger tile and a bigger picture, for the Map sheet. */
  deep?: boolean;
  /** Body colour key: tints the tile in that colour. */
  color?: string | null;
  style?: StyleProp<ViewStyle>;
}) {
  const c = useColors();
  const bg = c.dark ? c.surface2 : colorOf(color)?.tint ?? TINT[kind ?? 'other'] ?? TINT.other;
  return (
    <View style={[{ width, height, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }, style]}>
      {deep && !c.dark ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.07)' }]} /> : null}
      <VehicleArt type={kind} size={Math.round(height * (deep ? 0.92 : 0.8))} dimmed={dimmed} />
    </View>
  );
}

// ---------- Inputs ----------

/** 52 px white field with a bold label above; optional counter ("0/15"). */
export function Input({ label, counter, error, right, ...props }: TextInputProps & { label: string; counter?: string; error?: string; right?: ReactNode }) {
  const c = useColors();
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[type.fieldLabel, { color: c.text }]}>{label}</Text>
        {counter ? <Text style={[type.caption, { color: c.textMuted, letterSpacing: 0 }]}>{counter}</Text> : null}
      </View>
      <View style={[styles.input, { backgroundColor: c.surface, borderColor: error ? c.danger : 'transparent' }]}>
        <TextInput placeholderTextColor={c.textMuted} maxFontSizeMultiplier={1.3} accessibilityLabel={label} {...props} style={[type.body, { flex: 1, color: c.text, paddingVertical: 0 }, props.style]} />
        {right}
      </View>
      {error ? <Text style={[type.caption, { color: c.danger, letterSpacing: 0 }]}>{error}</Text> : null}
    </View>
  );
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  const c = useColors();
  return <Switch value={value} onValueChange={(v) => { tap(); onChange(v); }} trackColor={{ true: c.accent, false: c.border }} thumbColor="#FFFFFF" accessibilityLabel={label} />;
}

// ---------- Overlays ----------

/** Bottom sheet (radius 26, handle) that slides up. */
export function Sheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: c.overlay }]} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { backgroundColor: c.bg, paddingBottom: insets.bottom + space.lg }]}>
        <View style={[styles.handle, { backgroundColor: c.border }]} />
        {title ? <Text style={[type.title, { color: c.text, fontSize: 20 }]}>{title}</Text> : null}
        {children}
      </View>
    </Modal>
  );
}

/** Centred dialog (radius 22) with up to two pill actions. */
export function Dialog({ visible, title, message, children, cancel, confirm, onCancel, onConfirm, danger, confirmDisabled, busy }: {
  visible: boolean; title: string; message?: string; children?: ReactNode; cancel?: string; confirm: string;
  onCancel: () => void; onConfirm: () => void; danger?: boolean; confirmDisabled?: boolean; busy?: boolean;
}) {
  const c = useColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={[styles.dialogWrap, { backgroundColor: c.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: c.surface }]}>
          <Text style={[type.title, { color: c.text, fontSize: 20 }]}>{title}</Text>
          {message ? <Text style={[type.small, { color: c.textMuted }]}>{message}</Text> : null}
          {children}
          <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.sm }}>
            <PillButton title={cancel ?? 'Cancel'} variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
            <PillButton title={confirm} variant={danger ? 'dark' : 'primary'} onPress={onConfirm} disabled={confirmDisabled} loading={busy} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.sm, minHeight: 56 },
  topBarLeft: { marginLeft: -6, marginRight: 2 },
  plus: { position: 'absolute', right: '22%', top: '22%', width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  chip: { height: 40, paddingHorizontal: 14, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, height: 44, borderRadius: 14 },
  input: { height: 52, borderRadius: radius.input, borderWidth: 1, paddingHorizontal: space.lg, flexDirection: 'row', alignItems: 'center', gap: space.sm },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, padding: space.xl, paddingTop: space.sm, gap: space.md },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: space.sm },
  dialogWrap: { flex: 1, justifyContent: 'center', padding: space.xl },
  dialog: { borderRadius: 22, padding: space.xl, gap: space.sm },
});
