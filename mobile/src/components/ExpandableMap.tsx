// A map card with the two-arrow button (top-right) that makes it taller and back.
// Use it wherever a screen shows a map.
import { useState, type ReactNode } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { DIcon } from '@/components/DesignIcon';
import { clamp, useResponsive } from '@/lib/responsive';
import { radius, useColors } from '@/theme';

export function ExpandableMap({ height = 200, children, style }: { height?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  const r = useResponsive();
  const [big, setBig] = useState(false);
  const bigHeight = Math.round(clamp(r.height * 0.55, height + 80, 560));
  return (
    <View style={[{ height: big ? bigHeight : height, borderRadius: radius.card, overflow: 'hidden', backgroundColor: c.surface2 }, style]}>
      {children}
      <Pressable
        onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setBig(!big); }}
        accessibilityRole="button"
        accessibilityLabel={big ? 'Smaller map' : 'Bigger map'}
        style={styles.btn}
      >
        <DIcon name={big ? 'shrink' : 'expand'} size={16} strokeWidth={2.2} color="#202020" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
});
