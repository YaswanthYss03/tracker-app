// Small pill switch for filters inside a page (e.g. Logged | Auto, 7 days | 30 days).
import { Pressable, ScrollView, Text, View } from 'react-native';
import { fonts } from '@/theme';
import { useHomeColors } from '@/theme/designHome';

export function MiniTabs<T extends string>({ value, options, onChange, scroll }: { value: T; options: [T, string][]; onChange: (v: T) => void; scroll?: boolean }) {
  const c = useHomeColors();
  const row = (
    <View style={{ flexDirection: 'row', gap: 6 }} accessibilityRole="tablist">
      {options.map(([key, label]) => {
        const on = key === value;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? (c.dark ? c.text : '#202020') : c.surface }}
          >
            <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.bold, fontSize: 13, color: on ? (c.dark ? c.bg : '#FFFFFF') : c.text }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
  return scroll ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>{row}</ScrollView> : row;
}
