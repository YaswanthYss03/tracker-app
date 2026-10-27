// Vehicles: every vehicle with its picture, plate, name and colour. ✎ edits, + adds.
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '@/components/BottomNav';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { api, errorText } from '@/api/client';
import { plateOrName, type Device } from '@/api/types';
import { colorOf } from '@/lib/vehicleColors';
import { PillButton, Plate, RoundButton, TopBar, VehicleTile } from '@/components/kit';
import { ErrorBox } from '@/components/ui';
import { SkeletonRows } from '@/components/effects';
import { radius, shadow, space, type, useColors } from '@/theme';

export default function Vehicles() {
  const c = useColors();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['devices'],
    queryFn: () => api<{ data: Device[] }>('/devices'),
  });
  const vehicles = [...(data?.data ?? [])].sort((a, b) => plateOrName(a).localeCompare(plateOrName(b)));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TopBar
        title="Vehicles"
        onBack={() => router.back()}
        right={<RoundButton icon="add" label="Add vehicle" filled onPress={() => router.push('/vehicles/edit')} size={44} iconSize={24} />}
      />
      <ErrorBox error={error ? errorText(error) : null} />
      {isLoading ? (
        <SkeletonRows count={4} style={{ padding: space.lg }} />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: space.lg, gap: space.sm, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[type.h3, { color: c.text }]}>Add your first vehicle</Text>
              <PillButton title="Add vehicle" icon="add" onPress={() => router.push('/vehicles/edit')} style={{ alignSelf: 'stretch' }} />
            </View>
          }
          renderItem={({ item }) => {
            const owner = item.role === 'owner';
            const sub = [item.name, colorOf(item.color)?.label].filter(Boolean).join(' · ') || (owner ? 'Add a name and colour' : '');
            return (
              <Pressable
                onPress={() => router.push(`/device/${item.id}`)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.row, { backgroundColor: c.surface, opacity: pressed ? 0.9 : 1 }, shadow.card]}
              >
                <VehicleTile type={item.icon} color={item.color} width={68} height={50} />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Plate value={plateOrName(item)} size={16} />
                  <Text numberOfLines={1} style={[type.small, { color: c.textMuted }]}>{owner ? sub : `Shared with you${sub ? ` · ${sub}` : ''}`}</Text>
                </View>
                {owner ? (
                  <Pressable onPress={() => router.push(`/vehicles/edit?id=${item.id}`)} hitSlop={12} accessibilityRole="button" accessibilityLabel={`Edit ${plateOrName(item)}`} style={styles.edit}>
                    <Ionicons name="create-outline" size={20} color={c.text} />
                  </Pressable>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
                )}
              </Pressable>
            );
          }}
        />
      )}
      <BottomNav active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.sm, paddingRight: space.md, borderRadius: radius.card },
  edit: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.xl },
});
