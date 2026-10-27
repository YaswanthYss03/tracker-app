import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AlertEvent } from '@/api/types';
import { ALERT_ICONS, alertText, dateTime, SEVERE_ALERTS } from '@/lib/format';
import { AppText } from './ui';
import { fonts, radius, space, useColors } from '@/theme';

export function AlertRow({ alert, subtitle, onPress }: { alert: AlertEvent; subtitle?: string; onPress?: () => void }) {
  const c = useColors();
  const severe = SEVERE_ALERTS.has(alert.type);
  return (
    <Pressable
      onPress={onPress || (alert.lat != null ? () => Linking.openURL(`https://www.google.com/maps?q=${alert.lat},${alert.lon}`) : undefined)}
      style={[styles.row, { backgroundColor: c.surface, borderColor: c.border }]}
    >
      <View style={[styles.icon, { backgroundColor: severe ? c.dangerSoft : c.surface2 }]}>
        <Ionicons name={(ALERT_ICONS[alert.type] || 'notifications') as any} size={16} color={severe ? c.danger : c.text} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="small" color={severe ? 'danger' : 'text'} style={{ fontSize: 14, lineHeight: 19, fontFamily: fonts.bold }}>{alertText(alert)}</AppText>
        <AppText variant="caption" color="textMuted" style={{ letterSpacing: 0, fontSize: 12 }}>{subtitle ? `${subtitle} · ` : ''}{dateTime(alert.time)}</AppText>
      </View>
      {alert.lat != null && <Ionicons name="location-outline" size={16} color={c.textMuted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, borderWidth: 0 },
  icon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
