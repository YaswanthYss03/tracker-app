// Shown when the app is opened on an address it does not have (an old or mistyped link).
import { router } from 'expo-router';
import { AppText, Button, Screen } from '@/components/ui';
import { space } from '@/theme';
import { View } from 'react-native';

export default function NotFound() {
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.lg }}>
        <AppText variant="h1" center>This page does not exist</AppText>
        <AppText color="textMuted" center>The link may be old or mistyped.</AppText>
        <Button title="Go to home" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}
