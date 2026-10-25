// Bottom bar: Home · Map · Trips · Profile. The active tab sits in a soft
// marigold pill. Alerts open from the bell at the top of Home.
import { Tabs } from 'expo-router/tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { TrackersProvider } from '@/live/TrackersProvider';
import { fonts, useColors } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({ outline, filled }: { outline: IconName; filled: IconName }) {
  return ({ focused, color }: { focused: boolean; color: unknown }) => <PillIcon name={focused ? filled : outline} focused={focused} color={color as string} />;
}

function PillIcon({ name, focused, color }: { name: IconName; focused: boolean; color: string }) {
  const c = useColors();
  return (
    <View style={{ width: 56, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? (c.dark ? 'rgba(234,170,0,0.22)' : 'rgba(234,170,0,0.24)') : 'transparent' }}>
      <Ionicons name={name} size={22} color={color} />
    </View>
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
          tabBarActiveTintColor: c.text,
          tabBarInactiveTintColor: c.textMuted,
          tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12, marginTop: 2 },
          tabBarStyle: {
            backgroundColor: c.surface,
            borderTopColor: c.border,
            height: 64 + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom + 6,
          },
          sceneStyle: { backgroundColor: c.bg },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: TabIcon({ outline: 'home-outline', filled: 'home' }) }} />
        <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: TabIcon({ outline: 'map-outline', filled: 'map' }) }} />
        <Tabs.Screen name="trips" options={{ title: 'Trips', tabBarIcon: TabIcon({ outline: 'git-branch-outline', filled: 'git-branch' }) }} />
        <Tabs.Screen name="account" options={{ title: 'Profile', tabBarIcon: TabIcon({ outline: 'person-outline', filled: 'person' }) }} />
      </Tabs>
    </TrackersProvider>
  );
}
