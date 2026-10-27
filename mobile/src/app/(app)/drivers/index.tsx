// Drivers: a grid of cards (picture, name, the plates they drive). + adds one.
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '@/components/BottomNav';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { errorText } from '@/api/client';
import { useDrivers, plateTail } from '@/lib/drivers';
import { DriverAvatar } from '@/components/DriverAvatar';
import { PillButton, RoundButton, TopBar } from '@/components/kit';
import { ErrorBox } from '@/components/ui';
import { SkeletonRows } from '@/components/effects';
import { radius, shadow, space, type, useColors } from '@/theme';

export default function Drivers() {
  const c = useColors();
  const { data: drivers = [], isLoading, error, refetch, isRefetching } = useDrivers();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar
        title="Drivers"
        onBack={() => router.back()}
        right={<RoundButton icon="add" label="Add driver" filled onPress={() => router.push('/drivers/edit')} size={44} iconSize={24} />}
      />
      <ErrorBox error={error ? errorText(error) : null} />
      {isLoading ? (
        <SkeletonRows count={3} style={{ padding: space.lg }} />
      ) : (
        <FlatList
          data={drivers}
          keyExtractor={(d) => d.id}
          numColumns={2}
          columnWrapperStyle={{ gap: space.md }}
          contentContainerStyle={{ padding: space.lg, gap: space.md, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={40} color={c.textMuted} />
              <Text style={[type.h3, { color: c.text, textAlign: 'center' }]}>No drivers yet</Text>
              <Text style={[type.small, { color: c.textMuted, textAlign: 'center' }]}>Add your drivers to see who drives which vehicle and call them quickly.</Text>
              <PillButton title="Add driver" icon="add" onPress={() => router.push('/drivers/edit')} style={{ alignSelf: 'stretch', marginTop: space.sm }} />
            </View>
          }
          renderItem={({ item }) => {
            const plates = item.mainOf.map((v) => plateTail(v.registrationNumber, v.name));
            const backups = item.backupOf.map((v) => plateTail(v.registrationNumber, v.name));
            const expired = item.licenceExpiry && item.licenceExpiry < new Date().toISOString().slice(0, 10);
            return (
              <Pressable
                onPress={() => router.push(`/drivers/edit?id=${item.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}${plates.length ? `, drives ${plates.join(', ')}` : ''}`}
                style={({ pressed }) => [styles.card, { backgroundColor: c.surface, opacity: pressed ? 0.9 : 1 }, shadow.card]}
              >
                {expired && (
                  <View style={[styles.flag, { backgroundColor: c.dangerSoft }]} accessibilityLabel="Licence expired">
                    <Ionicons name="card-outline" size={14} color={c.danger} />
                  </View>
                )}
                <DriverAvatar driver={item} size={72} />
                <Text numberOfLines={1} style={[type.name, { color: c.text, marginTop: space.sm }]}>{item.name}</Text>
                <Text numberOfLines={1} style={[type.plate, { color: c.textMuted, fontSize: 12, lineHeight: 16 }]}>
                  {plates.length ? plates.join(' · ') : backups.length ? `Backup ${backups.join(' · ')}` : 'No vehicle'}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
      <BottomNav active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, maxWidth: '50%', alignItems: 'center', paddingVertical: space.lg, paddingHorizontal: space.sm, borderRadius: radius.card, gap: 2 },
  flag: { position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.sm, padding: space.xl },
});
