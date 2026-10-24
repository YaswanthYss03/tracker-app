// Welcome / onboarding: three slides, then log in or create an account.
import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Wordmark } from '@/components/ui';
import { space, useColors } from '@/theme';

const { width } = Dimensions.get('window');

const SLIDES: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }[] = [
  { icon: 'navigate-circle', title: 'See it live', text: 'Watch your vehicle move on the map in real time — speed, ignition and battery at a glance.' },
  { icon: 'notifications-circle', title: 'Know instantly', text: 'Overspeed, ignition, geofence, power cut and SOS alerts straight to your phone.' },
  { icon: 'people-circle', title: 'Share with family', text: 'Give family read-only access or send a live location link that expires on its own.' },
];

export default function Welcome() {
  const c = useColors();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ alignItems: 'center', paddingTop: space.xl }}>
        <Wordmark />
      </View>
      <FlatList
        ref={list}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.art, { backgroundColor: c.surface, borderColor: c.border }]}>
              <View style={[styles.artInner, { backgroundColor: c.accent }]}>
                <Ionicons name={item.icon} size={84} color={c.onAccent} />
              </View>
            </View>
            <AppText variant="h1" center>{item.title}</AppText>
            <AppText color="textMuted" center style={{ maxWidth: 320 }}>{item.text}</AppText>
          </View>
        )}
      />
      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View key={s.title} style={[styles.dot, { backgroundColor: i === index ? c.accent : c.border, width: i === index ? 26 : 8 }]} />
        ))}
      </View>
      <View style={{ padding: space.lg, gap: space.md }}>
        <Button title="Create account" onPress={() => router.push('/register')} />
        <Button title="I already have an account" variant="secondary" onPress={() => router.push('/login')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slide: { alignItems: 'center', justifyContent: 'center', gap: space.lg, paddingHorizontal: space.xl },
  art: { width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  artInner: { width: 150, height: 150, borderRadius: 75, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: space.md },
  dot: { height: 8, borderRadius: 4 },
});
