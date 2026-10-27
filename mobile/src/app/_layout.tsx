// Root: fonts, splash screen, data cache, login state, and the logged-in / logged-out split.
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { fontAssets } from '@/theme/typography';
import { useColors } from '@/theme';
import { loadThemePref } from '@/theme/preference';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 15_000, refetchOnWindowFocus: true } },
});

function RootNavigator() {
  const { user, ready } = useAuth();
  const [fontsLoaded] = useFonts(fontAssets);
  const [themeReady, setThemeReady] = useState(false);
  const c = useColors();

  useEffect(() => {
    loadThemePref().finally(() => setThemeReady(true)); // saved Light / Dark / System
  }, []);

  useEffect(() => {
    if (ready && fontsLoaded && themeReady) SplashScreen.hideAsync().catch(() => {});
  }, [ready, fontsLoaded, themeReady]);

  if (!ready || !fontsLoaded || !themeReady) return null;

  return (
    <>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: c.bg }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 640 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, animation: 'slide_from_right' }}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Screen name="share/[token]" />
      </Stack>
      </View>
      </View>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
