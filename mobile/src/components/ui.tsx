// Brand UI building blocks. Every screen uses these instead of raw RN styles.
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { radius, space, type, useColors, type Palette } from '@/theme';
import type { TypeVariant } from '@/theme/typography';
import { GlowSweep, GradientSweep, PLoader, Sweep, SweepText } from './effects';

// ---------- Text ----------

type AppTextProps = {
  variant?: TypeVariant;
  color?: keyof Palette | string;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  numberOfLines?: number;
  center?: boolean;
};

export function AppText({ variant = 'body', color = 'text', style, children, numberOfLines, center }: AppTextProps) {
  const c = useColors();
  const resolved = (c as Record<string, unknown>)[color as string] ?? color;
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      numberOfLines={numberOfLines}
      style={[type[variant], { color: resolved as string }, center && { textAlign: 'center' }, style]}
    >
      {children}
    </Text>
  );
}

/** "Pavakie" in Pinyon Script with a marigold underline. */
export function Wordmark({ size = 52, light }: { size?: number; light?: boolean }) {
  const c = useColors();
  return (
    <View style={{ alignItems: 'center' }}>
      <SweepText delay={3000} duration={1600}>
        <Text
          maxFontSizeMultiplier={1}
          style={[type.wordmark, { fontSize: size, lineHeight: size * 1.4, color: light ? '#FFFFFF' : c.text, paddingHorizontal: size * 0.2 }]}
        >
          Pavakie
        </Text>
      </SweepText>
      <GradientSweep style={{ width: size * 1.6, height: 4, borderRadius: 2, marginTop: -size * 0.15 }} />
      <Text maxFontSizeMultiplier={1.2} style={[type.label, { color: light ? '#FFFFFF' : c.textMuted, marginTop: 8 }]}>
        GPS TRACKER
      </Text>
    </View>
  );
}

// ---------- Layout ----------

export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ['top'],
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: StyleProp<ViewStyle>;
}) {
  const c = useColors();
  const inner = padded ? { padding: space.lg, gap: space.lg } : undefined;
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.bg }}>
      {scroll ? (
        <ScrollView contentContainerStyle={[inner, { paddingBottom: 48 }, style]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, inner, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const c = useColors();
  const base = [styles.card, { backgroundColor: c.surface, borderColor: c.border }, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.85 }]} android_ripple={{ color: c.surface2 }}>
      {children}
    </Pressable>
  );
}

export function Row({ children, gap = space.sm, style }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap, flexWrap: 'wrap' }, style]}>{children}</View>;
}

export function Divider() {
  const c = useColors();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border }} />;
}

// ---------- Buttons ----------

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, small, style }: ButtonProps) {
  const c = useColors();
  const palette = {
    primary: { bg: c.accent, fg: c.onAccent, border: c.accent },
    secondary: { bg: 'transparent', fg: c.text, border: c.text },
    ghost: { bg: 'transparent', fg: c.text, border: 'transparent' },
    danger: { bg: 'transparent', fg: c.danger, border: c.danger },
  }[variant];
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={off}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: palette.bg, borderColor: palette.border, opacity: off ? 0.5 : pressed ? 0.8 : 1 },
        style,
      ]}
    >
      {variant === 'primary' && !off && <Sweep delay={3200} duration={1100} intensity={0.65} band={0.22} />}
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={small ? 16 : 20} color={palette.fg} />}
          <Text maxFontSizeMultiplier={1.2} style={[type.bodyStrong, { color: palette.fg, fontSize: small ? 14 : 16 }]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({ icon, onPress, label, color }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; label: string; color?: string }) {
  const c = useColors();
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} hitSlop={10} style={({ pressed }) => [styles.iconButton, { backgroundColor: c.surface, opacity: pressed ? 0.7 : 1 }]}>
      <Ionicons name={icon} size={22} color={color || c.text} />
    </Pressable>
  );
}

// ---------- Inputs ----------

export function Field({ label, error, hint, ...props }: TextInputProps & { label: string; error?: string; hint?: string }) {
  const c = useColors();
  // A password field gets an eye to show or hide what was typed.
  const isPassword = !!props.secureTextEntry;
  const [shown, setShown] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="caption" color="textMuted">{label.toUpperCase()}</AppText>
      <View>
        <TextInput
          placeholderTextColor={c.textMuted}
          maxFontSizeMultiplier={1.3}
          {...props}
          secureTextEntry={isPassword && !shown}
          style={[
            type.body,
            styles.input,
            { color: c.text, backgroundColor: c.surface, borderColor: error ? c.danger : c.border },
            isPassword && { paddingRight: 52 },
            props.style,
          ]}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setShown((v) => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={shown ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={shown ? 'eye-off-outline' : 'eye-outline'} size={22} color={c.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <AppText variant="small" color="danger">{error}</AppText> : hint ? <AppText variant="small" color="textMuted">{hint}</AppText> : null}
    </View>
  );
}

export function ErrorBox({ error }: { error?: string | null }) {
  const c = useColors();
  if (!error) return null;
  return (
    <View style={[styles.notice, { backgroundColor: c.dangerSoft }]}>
      <Ionicons name="alert-circle" size={18} color={c.danger} />
      <AppText variant="small" color="danger" style={{ flex: 1 }}>{error}</AppText>
    </View>
  );
}

// ---------- Status ----------

export function Pill({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'ok' | 'accent' | 'danger' | 'offline' }) {
  const c = useColors();
  const map = {
    neutral: { bg: c.surface2, fg: c.text },
    ok: { bg: c.successSoft, fg: c.success },
    accent: { bg: c.accent, fg: c.onAccent },
    danger: { bg: c.dangerSoft, fg: c.danger },
    offline: { bg: c.surface2, fg: c.offline },
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: map.bg }]}>
      {(tone === 'ok' || tone === 'offline') && <View style={[styles.dot, { backgroundColor: map.fg }]} />}
      <Text maxFontSizeMultiplier={1.2} style={[type.caption, { color: map.fg }]}>{label}</Text>
    </View>
  );
}

export function StatCard({ value, unit, label, style, glow }: { value: string | number; unit?: string; label: string; style?: StyleProp<ViewStyle>; glow?: boolean }) {
  return (
    <Card style={[{ flex: 1, minWidth: 140, gap: 2, overflow: 'hidden' }, style]}>
      {glow && <GlowSweep />}
      <Row gap={4} style={{ alignItems: 'flex-end' }}>
        <AppText variant="display">{value}</AppText>
        {unit ? <AppText variant="bodyStrong" color="textMuted" style={{ marginBottom: 6 }}>{unit}</AppText> : null}
      </Row>
      <AppText variant="caption" color="textMuted">{label.toUpperCase()}</AppText>
    </Card>
  );
}

/** Loading state: the animated "P" (company initial). */
export function Loading({ label }: { label?: string }) {
  return (
    <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
      <PLoader label={label} />
    </View>
  );
}

export function EmptyState({ icon = 'map-outline', title, text, action }: { icon?: keyof typeof Ionicons.glyphMap; title: string; text?: string; action?: ReactNode }) {
  const c = useColors();
  return (
    <View style={{ alignItems: 'center', padding: space.xl, gap: space.md }}>
      <View style={[styles.emptyIcon, { backgroundColor: c.accent }]}>
        <Ionicons name={icon} size={36} color={c.onAccent} />
      </View>
      <AppText variant="h2" center>{title}</AppText>
      {text ? <AppText color="textMuted" center>{text}</AppText> : null}
      {action}
    </View>
  );
}

/** Horizontal scrolling tabs with a marigold underline on the active one. */
export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  const c = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4, paddingHorizontal: space.lg }}>
      {options.map(([key, label]) => {
        const active = key === value;
        return (
          <Pressable key={key} onPress={() => onChange(key)} accessibilityRole="tab" accessibilityState={{ selected: active }} style={styles.segment}>
            <Text maxFontSizeMultiplier={1.2} style={[type.bodyStrong, { color: active ? c.text : c.textMuted }]}>{label}</Text>
            <View style={{ height: 3, borderRadius: 2, marginTop: 6, backgroundColor: active ? c.accent : 'transparent' }} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, padding: space.lg },
  button: {
    minHeight: 52,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  buttonSmall: { minHeight: 40, paddingHorizontal: space.lg },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  input: { minHeight: 52, borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: space.md },
  notice: { flexDirection: 'row', gap: 8, alignItems: 'center', padding: space.md, borderRadius: radius.sm },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  segment: { paddingHorizontal: space.md, paddingTop: space.md, paddingBottom: 4, minHeight: 48 },
});
