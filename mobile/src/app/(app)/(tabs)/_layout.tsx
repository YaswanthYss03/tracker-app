// Bottom bar: Home · Map · Trips · Profile, with the design's line icons.
// The active tab sits in a soft marigold pill. Alerts open from the bell at
// the top of Home.
import { Tabs } from 'expo-router/tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { TourOverlay } from '@/components/tour/TourOverlay';
import { TAB_BAR } from '@/components/tour/store';
import { TrackersProvider } from '@/live/TrackersProvider';
import { DIcon, type DesignIconName } from '@/components/DesignIcon';
import { fonts } from '@/theme';
import { useHomeColors as useColors } from '@/theme/designHome';

// Plain tab button: no Android ripple circle, just a light dim while pressed.
function TabButton({ children, style, onPress, onLongPress, testID, role, href, ...rest }: any) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
      role={role}
      aria-label={rest['aria-label']}
      aria-selected={rest['aria-selected']}
      style={({ pressed }) => [style, pressed && { opacity: 0.6 }]}
    >
      {children}
    </Pressable>
  );
}

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
      <View style={{ flex: 1 }}>
      <Tabs
        screenListeners={{ tabPress: () => Haptics.selectionAsync().catch(() => {}) }}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: c.dark ? c.surface : '#FFFFFF',
            borderTopColor: c.border,
            height: TAB_BAR.height + insets.bottom,
            paddingTop: TAB_BAR.padTop,
            paddingBottom: insets.bottom + TAB_BAR.padBottom,
            paddingHorizontal: TAB_BAR.padX,
          },
          sceneStyle: { backgroundColor: c.bg },
        }}
      >
        <Tabs.Screen name="index" options={{ tabBarButton: (props) => <TabButton {...props} />, title: 'Home', tabBarIcon: TabIcon('home'), tabBarLabel: TabLabel('Home') }} />
        <Tabs.Screen name="map" options={{ tabBarButton: (props) => <TabButton {...props} />, title: 'Map', tabBarIcon: TabIcon('map'), tabBarLabel: TabLabel('Map') }} />
        <Tabs.Screen name="trips" options={{ tabBarButton: (props) => <TabButton {...props} />, title: 'Replay', tabBarIcon: TabIcon('trips'), tabBarLabel: TabLabel('Replay') }} />
        <Tabs.Screen name="account" options={{ tabBarButton: (props) => <TabButton {...props} />, title: 'Profile', tabBarIcon: TabIcon('user'), tabBarLabel: TabLabel('Profile') }} />
      </Tabs>
      <TourOverlay />
      </View>
    </TrackersProvider>
  );
}
