// Grid of vehicle types (car, bike, bus...). The chosen one is drawn on the map.
import { Pressable, StyleSheet, View } from 'react-native';
import { VehicleArt } from './VehicleArt';
import { VEHICLES, type VehicleType } from '@/lib/vehicles';
import { AppText } from '@/components/ui';
import { radius, space, useColors } from '@/theme';

export function VehiclePicker({ value, onChange }: { value: VehicleType | null; onChange: (v: VehicleType) => void }) {
  const c = useColors();
  return (
    <View style={{ gap: space.sm }}>
      <AppText variant="caption" color="textMuted">VEHICLE TYPE</AppText>
      <View style={styles.grid}>
        {VEHICLES.map((v) => {
          const on = v.type === value;
          return (
            <Pressable
              key={v.type}
              onPress={() => onChange(v.type)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={v.label}
              style={({ pressed }) => [
                styles.item,
                {
                  backgroundColor: on ? c.accent : c.surface,
                  borderColor: on ? c.accent : c.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={[styles.art, { borderColor: on ? c.onAccent : 'transparent' }]}>
                <VehicleArt type={v.type} size={40} />
              </View>
              <AppText variant="small" color={on ? c.onAccent : undefined}>{v.label}</AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  art: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 2, borderWidth: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  item: {
    width: '18.4%',
    minWidth: 60,
    aspectRatio: 0.82,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
});
