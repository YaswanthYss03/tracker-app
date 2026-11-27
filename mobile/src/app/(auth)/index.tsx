// Welcome: three slides over the looping map video, then log in or create an account.
import { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AuthBackdrop } from '@/components/AuthBackdrop';
import { BrandMark } from '@/components/Brand';
import { DIcon, type DesignIconName } from '@/components/DesignIcon';
import { Button } from '@/components/ui';
import { fonts, space } from '@/theme';
import { useHomeColors } from '@/theme/designHome';

const SLIDES: { icon: DesignIconName; title: string; text: string }[] = [
  { icon: 'map', title: 'See every vehicle live', text: 'Watch your vehicles move on the map in real time, with speed, ignition and battery at a glance.' },
  { icon: 'bell', title: 'Know the moment it matters', text: 'Overspeed, ignition, geofence, power cut and SOS alerts, straight to your phone.' },
  { icon: 'replay', title: 'Replay any day', text: 'Go back through a day or a trip with a speedometer and a speed chart, vehicle by vehicle.' },
];

export default function Welcome() {
  const c = useHomeColors();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList>(null);

  return (
    <AuthBackdrop>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', paddingTop: space.xl }}>
          <BrandMark size={26} center />
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
              <View style={[styles.art, { backgroundColor: c.dark ? 'rgba(38,38,39,0.9)' : 'rgba(255,255,255,0.92)' }]}>
                <View style={[styles.artInner, { backgroundColor: c.accent }]}>
                  <DIcon name={item.icon} size={56} strokeWidth={1.9} color="#FFFFFF" />
                </View>
              </View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.7, color: c.text, textAlign: 'center' }}>{item.title}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: c.textMuted, textAlign: 'center', maxWidth: 320 }}>{item.text}</Text>
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
    </AuthBackdrop>
  );
}

const styles = StyleSheet.create({
  slide: { alignItems: 'center', justifyContent: 'center', gap: space.lg, paddingHorizontal: space.xl },
  art: { width: 190, height: 190, borderRadius: 95, alignItems: 'center', justifyContent: 'center' },
  artInner: { width: 124, height: 124, borderRadius: 62, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: space.md },
  dot: { height: 8, borderRadius: 4 },
});
