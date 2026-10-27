// The bottom bar (Home · Map · Trips · Profile) for the vehicle details page
// (the one page that sits on top of the tabs, as in the design). Same look and
// size as the real tab bar; tapping a tab goes back to that tab.
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { DIcon, type DesignIconName } from '@/components/DesignIcon';
import { fonts } from '@/theme';
import { useHomeColors } from '@/theme/designHome';

export type NavTab = 'home' | 'map' | 'trips' | 'profile';
const TABS: { key: NavTab; label: string; icon: DesignIconName; path: '/' | '/map' | '/trips' | '/account' }[] = [
  { key: 'home', label: 'Home', icon: 'home', path: '/' },
  { key: 'map', label: 'Map', icon: 'map', path: '/map' },
  { key: 'trips', label: 'Trips', icon: 'trips', path: '/trips' },
  { key: 'profile', label: 'Profile', icon: 'user', path: '/account' },
];

export function BottomNav({ active = 'home' }: { active?: NavTab }) {
  const c = useHomeColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      style={{ flexDirection: 'row', backgroundColor: c.dark ? c.surface : '#FFFFFF', borderTopWidth: 1, borderTopColor: c.border, height: 70 + insets.bottom, paddingTop: 6, paddingBottom: insets.bottom + 8, paddingHorizontal: 8 }}
    >
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <Pressable
            key={t.key}
            onPress={() => { Haptics.selectionAsync().catch(() => {}); router.navigate(t.path); }}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t.label}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{ width: 60, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? (c.dark ? 'rgba(229,72,77,0.25)' : '#FBE4E4') : 'transparent' }}>
              <DIcon name={t.icon} size={24} strokeWidth={on ? 2.1 : 1.9} color={on ? c.accent : c.text} />
            </View>
            <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: on ? fonts.bold : fonts.medium, fontSize: 12, lineHeight: 14, marginTop: 4, color: c.text }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
