// Confirmation dialog for destructive actions; optionally requires typing a text (e.g. the IMEI).
import { useState, type ReactNode } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { errorText } from '@/api/client';
import { AppText, Button, ErrorBox, Field } from './ui';
import { radius, space, useColors } from '@/theme';

export function ConfirmDialog({
  visible, title, message, confirmLabel = 'Confirm', danger, requireText, onConfirm, onClose, children,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  requireText?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
  children?: ReactNode;
}) {
  const c = useColors();
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      setTyped('');
      onClose();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: c.overlay }]}>
        <View style={[styles.box, { backgroundColor: c.surface }]}>
          <AppText variant="h2">{title}</AppText>
          <AppText color="textMuted">{message}</AppText>
          {children}
          {requireText ? (
            <Field label={`Type ${requireText} to confirm`} value={typed} onChangeText={setTyped} autoCapitalize="none" keyboardType="number-pad" />
          ) : null}
          <ErrorBox error={error} />
          <View style={{ flexDirection: 'row', gap: space.sm, justifyContent: 'flex-end' }}>
            <Button title="Cancel" variant="ghost" small onPress={onClose} />
            <Button
              title={confirmLabel}
              variant={danger ? 'danger' : 'primary'}
              small
              loading={busy}
              disabled={Boolean(requireText) && typed !== requireText}
              onPress={go}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', padding: space.lg },
  box: { borderRadius: radius.lg, padding: space.xl, gap: space.md },
});
