// The Pavakie mark: a red tile with a white pin, and the name in bold DM Sans (same as the Home header).
import { Text, View } from 'react-native';
import { DIcon } from '@/components/DesignIcon';
import { fonts } from '@/theme';
import { useHomeColors } from '@/theme/designHome';

export function BrandMark({ size = 24, center }: { size?: number; center?: boolean }) {
  const c = useHomeColors();
  const tile = Math.round(size * 1.5);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Math.round(size * 0.42), alignSelf: center ? 'center' : 'flex-start' }} accessibilityRole="header" accessibilityLabel="Pavakie">
      <View style={{ width: tile, height: tile, borderRadius: Math.round(tile * 0.3), backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
        <DIcon name="pin" size={Math.round(tile * 0.55)} strokeWidth={2.2} color="#FFFFFF" />
      </View>
      <Text maxFontSizeMultiplier={1} style={{ fontFamily: fonts.bold, fontSize: size * 1.25, lineHeight: size * 1.6, letterSpacing: -0.6, color: c.text }}>Pavakie</Text>
    </View>
  );
}
