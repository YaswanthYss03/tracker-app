// Bottom sheet from the design: white, 26 px top corners, small handle, bold title.
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts } from '@/theme';
import { useHomeColors } from '@/theme/designHome';

export function DesignSheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const c = useHomeColors();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} onPress={onClose} accessibilityLabel="Close" />
      <View style={{ marginTop: 'auto', backgroundColor: c.dark ? c.surface : '#FFFFFF', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 8, paddingHorizontal: 20, paddingBottom: insets.bottom + 20, gap: 12, maxHeight: '80%' }}>
        <View style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: '#D6D6D6' }} />
        <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: c.text }}>{title}</Text>
        {children}
      </View>
    </Modal>
  );
}
