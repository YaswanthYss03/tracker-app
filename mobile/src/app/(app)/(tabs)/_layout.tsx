// Bottom bar, Instagram style: icons only — Home · Map · ＋ · Alerts · Profile.
import { Tabs } from 'expo-router/tabs';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/auth/AuthProvider';
import { TrackersProvider } from '@/live/TrackersProvider';
import { AppText } from '@/components/ui';
import { useColors } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function icon(outline: IconName, filled: IconName) {
  return ({ focused, color }: { focused: boolean; color: unknown }) => (
    <Ionicons name={focused ? filled : outline} size={27} color={color as string} />
  );
}

/** Profile tab: round avatar with the user's initial, ringed when selected. */
function Avatar({ focused }: { focused: boolean }) {
  const c = useColors();
  const { user } = useAuth();
  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();
  return (
    <View style={{ width: 32, height: 32, borderRadius: 16, borderWidth: focused ? 2 : 0, borderColor: c.text, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="caption" color={c.onAccent} style={{ fontSize: 13 }}>{initial}</AppText>
      </View>
    </View>
  );
}

/** Centre ＋ : rounded square like Instagram's create button; opens Add tracker. */
function AddIcon() {
  const c = useColors();
  return (
    <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="add" size={26} color={c.onAccent} />
    </View>
  );
}

export default function TabsLayout() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const tap = () => Haptics.selectionAsync().catch(() => {});
  return (
    <TrackersProvider>
      <Tabs
        screenListeners={{ tabPress: tap }}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: c.text,
          tabBarInactiveTintColor: c.textMuted,
          tabBarStyle: {
            backgroundColor: c.surface,
            borderTopColor: c.border,
            height: 56 + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom,
          },
          sceneStyle: { backgroundColor: c.bg },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarAccessibilityLabel: 'Home', tabBarIcon: icon('home-outline', 'home') }} />
        <Tabs.Screen name="map" options={{ title: 'Map', tabBarAccessibilityLabel: 'Map of all vehicles', tabBarIcon: icon('map-outline', 'map') }} />
        <Tabs.Screen
          name="add"
          options={{ title: 'Add tracker', tabBarAccessibilityLabel: 'Add tracker', tabBarIcon: () => <AddIcon /> }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // it's an action, not a page
              router.push('/add-tracker');
            },
          }}
        />
        <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarAccessibilityLabel: 'Alerts', tabBarIcon: icon('notifications-outline', 'notifications') }} />
        <Tabs.Screen name="account" options={{ title: 'Profile', tabBarAccessibilityLabel: 'Profile', tabBarIcon: ({ focused }) => <Avatar focused={focused} /> }} />
      </Tabs>
    </TrackersProvider>
  );
}
