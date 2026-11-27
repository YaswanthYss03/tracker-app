// Shows the current in-app notification at the top of the screen.
import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DIcon } from '@/components/DesignIcon';
import { useToast } from '@/lib/toast';
import { fonts } from '@/theme';

export function ToastHost() {
  const toast = useToast();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: insets.top + 8, alignItems: 'center', zIndex: 100 }}>
      <Animated.View
        key={toast.id}
        entering={FadeInUp.duration(220)}
        exiting={FadeOutUp.duration(200)}
        accessibilityLiveRegion="polite"
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#202020', paddingHorizontal: 16, paddingVertical: 11, borderRadius: 22, elevation: 8, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}
      >
        <DIcon name="check" size={16} strokeWidth={2.6} color="#FFFFFF" />
        <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#FFFFFF' }}>{toast.text}</Text>
      </Animated.View>
    </View>
  );
}
