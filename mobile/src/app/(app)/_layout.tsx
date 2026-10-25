import { Stack } from 'expo-router';
import { useColors } from '@/theme';
import { usePushNotifications } from '@/push/push';

export default function AppLayout() {
  const c = useColors();
  usePushNotifications(); // registers this phone for alerts while logged in
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, animation: 'slide_from_right' }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-tracker" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="vehicles/edit" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="drivers/edit" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="device/[id]" />
      <Stack.Screen name="change-password" />
    </Stack>
  );
}
