// Background for the welcome and sign-in screens: the plain app background (no video).
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { space, useColors } from '@/theme';

export function AuthBackdrop({ children }: { children: ReactNode }) {
  const c = useColors();
  return <View style={{ flex: 1, backgroundColor: c.bg }}>{children}</View>;
}

/** A sign-in screen: backdrop, safe area, keyboard handling and a scrolling column. */
export function AuthScreen({ children, centered }: { children: ReactNode; centered?: boolean }) {
  return (
    <AuthBackdrop>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.lg, gap: space.lg, paddingBottom: 48, flexGrow: centered ? 1 : undefined, justifyContent: centered ? 'center' : undefined }}>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackdrop>
  );
}
