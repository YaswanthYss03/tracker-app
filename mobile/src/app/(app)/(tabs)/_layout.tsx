// Bottom bar: Home · Map · Trips · Profile, with the design's line icons.
// The active tab sits in a soft marigold pill. Alerts open from the bell at
// the top of Home.
import { Tabs } from 'expo-router/tabs';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { TrackersProvider } from '@/live/TrackersProvider';
import { DIcon, type DesignIconName } from '@/components/DesignIcon';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';

function TabIcon(name: DesignIconName) {
  return ({ focused }: { focused: boolean }) => <PillIcon name={name} focused={focused} />;
}

function PillIcon({ name, focused }: { name: DesignIconName; focused: boolean }) {
  const c = useColors();
  return (
    <View style={{ width: 60, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? (c.dark ? 'rgba(229,72,77,0.25)' : '#FBE4E4') : 'transparent' }}>
      <DIcon name={name} size={24} strokeWidth={focused ? 2.1 : 1.9} color={focused ? c.accent : c.text} />
    </View>
  );
}

function TabLabel(title: string) {
  return ({ focused }: { focused: boolean }) => <Label title={title} focused={focused} />;
}

function Label({ title, focused }: { title: string; focused: boolean }) {
  const c = useColors();
  return (
    <Text maxFontSizeMultiplier={1.2} style={{ fontFamily: focused ? fonts.bold : fonts.medium, fontSize: 12, lineHeight: 14, marginTop: 4, color: c.text }}>
      {title}
    </Text>
  );
}

export default function TabsLayout() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <TrackersProvider>
      <Tabs
        screenListeners={{ tabPress: () => Haptics.selectionAsync().catch(() => {}) }}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: c.dark ? c.surface : '#FFFFFF',
            borderTopColor: c.border,
            height: 70 + insets.bottom,
            paddingTop: 6,
            paddingBottom: insets.bottom + 8,
            paddingHorizontal: 8,
          },
          sceneStyle: { backgroundColor: c.bg },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: TabIcon('home'), tabBarLabel: TabLabel('Home') }} />
        <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: TabIcon('map'), tabBarLabel: TabLabel('Map') }} />
        <Tabs.Screen name="trips" options={{ title: 'Trips', tabBarIcon: TabIcon('trips'), tabBarLabel: TabLabel('Trips') }} />
        <Tabs.Screen name="account" options={{ title: 'Profile', tabBarIcon: TabIcon('user'), tabBarLabel: TabLabel('Profile') }} />
      </Tabs>
    </TrackersProvider>
  );
}
