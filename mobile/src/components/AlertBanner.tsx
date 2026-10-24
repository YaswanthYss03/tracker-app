// In-app banner for live alerts while the app is open (push covers the background).
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './ui';
import { radius, space, useColors } from '@/theme';

export type BannerAlert = { title: string; text: string; severe?: boolean; deviceId?: string };

export function AlertBanner({ alert, onClose }: { alert: BannerAlert; onClose: () => void }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    Haptics.notificationAsync(alert.severe ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success).catch(() => {});
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [alert, onClose]);

  return (
    <Pressable
      onPress={() => {
        onClose();
        if (alert.deviceId) router.push(`/device/${alert.deviceId}`);
      }}
      style={[styles.banner, { top: insets.top + space.sm, backgroundColor: alert.severe ? c.danger : c.text }]}
    >
      <View style={[styles.icon, { backgroundColor: c.accent }]}>
        <Ionicons name={alert.severe ? 'warning' : 'notifications'} size={18} color={c.onAccent} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong" color={c.bg}>{alert.title}</AppText>
        <AppText variant="small" color={c.bg}>{alert.text}</AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={c.bg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    // Drops in at the top so it never covers the bottom bar.
    position: 'absolute', left: space.lg, right: space.lg,
    flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.md, elevation: 8,
  },
  icon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
