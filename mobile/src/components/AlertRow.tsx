import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AlertEvent } from '@/api/types';
import { ALERT_ICONS, alertText, dateTime, SEVERE_ALERTS } from '@/lib/format';
import { AppText } from './ui';
import { radius, space, useColors } from '@/theme';

export function AlertRow({ alert, subtitle, onPress }: { alert: AlertEvent; subtitle?: string; onPress?: () => void }) {
  const c = useColors();
  const severe = SEVERE_ALERTS.has(alert.type);
  return (
    <Pressable
      onPress={onPress || (alert.lat != null ? () => Linking.openURL(`https://www.google.com/maps?q=${alert.lat},${alert.lon}`) : undefined)}
      style={[styles.row, { backgroundColor: c.surface, borderColor: c.border }]}
    >
      <View style={[styles.icon, { backgroundColor: severe ? c.dangerSoft : c.accent }]}>
        <Ionicons name={(ALERT_ICONS[alert.type] || 'notifications') as any} size={20} color={severe ? c.danger : c.onAccent} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong" color={severe ? 'danger' : 'text'}>{alertText(alert)}</AppText>
        <AppText variant="small" color="textMuted">{subtitle ? `${subtitle} · ` : ''}{dateTime(alert.time)}</AppText>
      </View>
      {alert.lat != null && <Ionicons name="location-outline" size={18} color={c.textMuted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
