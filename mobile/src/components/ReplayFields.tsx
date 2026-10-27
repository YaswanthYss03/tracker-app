// Date / From / To fields for the replay screens. Tapping a field opens a real
// picker: a month calendar for the date, hour and minute wheels for the time.
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DIcon } from '@/components/DesignIcon';
import { DesignSheet } from '@/components/DesignSheet';
import { fonts } from '@/theme';
import { useHomeColors } from '@/theme/designHome';

const pad = (n: number) => String(n).padStart(2, '0');
const dmy = (iso: string) => iso.split('-').reverse().join('/');

export function ReplayFields({ date, from, to, max, onDate, onFrom, onTo }: {
  date: string; from: string; to: string; max: string; onDate: (iso: string) => void; onFrom: (t: string) => void; onTo: (t: string) => void;
}) {
  const [open, setOpen] = useState<'date' | 'from' | 'to' | null>(null);
  return (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1.3 }}><PickField label="Date" icon="calendar" value={dmy(date)} onPress={() => setOpen('date')} /></View>
        <View style={{ flex: 1 }}><PickField label="From" icon="clock" value={from} onPress={() => setOpen('from')} /></View>
        <View style={{ flex: 1 }}><PickField label="To" icon="clock" value={to} onPress={() => setOpen('to')} /></View>
      </View>
      <DatePickerSheet visible={open === 'date'} value={date} max={max} onPick={(d) => { setOpen(null); onDate(d); }} onClose={() => setOpen(null)} />
      <TimePickerSheet visible={open === 'from'} title="From time" value={from} onPick={(t) => { setOpen(null); onFrom(t); }} onClose={() => setOpen(null)} />
      <TimePickerSheet visible={open === 'to'} title="To time" value={to} onPick={(t) => { setOpen(null); onTo(t); }} onClose={() => setOpen(null)} />
    </>
  );
}

function PickField({ label, icon, value, onPress }: { label: string; icon: 'calendar' | 'clock'; value: string; onPress: () => void }) {
  const c = useHomeColors();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: c.textMuted }}>{label}</Text>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}: ${value}. Change`} style={[styles.field, { backgroundColor: c.dark ? c.surface : '#FFFFFF' }]}>
        <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.medium, fontSize: 16, color: c.text }}>{value}</Text>
        <DIcon name={icon} size={16} strokeWidth={2} color={c.text} />
      </Pressable>
    </View>
  );
}

/** Month calendar; days after `max` can't be picked. */
export function DatePickerSheet({ visible, value, max, onPick, onClose }: { visible: boolean; value: string; max: string; onPick: (iso: string) => void; onClose: () => void }) {
  const c = useHomeColors();
  const [y0, m0] = value.split('-').map(Number);
  const [view, setView] = useState({ y: y0, m: m0 - 1 });
  useEffect(() => { if (visible) setView({ y: y0, m: m0 - 1 }); }, [visible, y0, m0]);
  const [my, mm] = max.split('-').map(Number);
  const atMax = view.y > my || (view.y === my && view.m >= mm - 1);
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const step = (by: number) => setView(({ y, m }) => { const d = new Date(y, m + by, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  return (
    <DesignSheet visible={visible} onClose={onClose} title="Choose date">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => step(-1)} accessibilityRole="button" accessibilityLabel="Previous month" style={styles.nav}><DIcon name="chevL" size={18} strokeWidth={2.2} /></Pressable>
        <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.text }}>{first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</Text>
        <Pressable onPress={() => !atMax && step(1)} accessibilityRole="button" accessibilityLabel="Next month" style={[styles.nav, { opacity: atMax ? 0.3 : 1 }]}><DIcon name="chevR" size={18} strokeWidth={2.2} /></Pressable>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <Text key={i} style={{ width: `${100 / 7}%`, textAlign: 'center', fontFamily: fonts.bold, fontSize: 12, color: c.textMuted }}>{d}</Text>)}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((d, i) => {
          if (d == null) return <View key={`b${i}`} style={styles.cell} />;
          const iso = `${view.y}-${pad(view.m + 1)}-${pad(d)}`;
          const on = iso === value;
          const future = iso > max;
          return (
            <Pressable key={iso} disabled={future} onPress={() => onPick(iso)} accessibilityRole="button" accessibilityState={{ selected: on, disabled: future }} accessibilityLabel={dmy(iso)} style={styles.cell}>
              <View style={[styles.day, on && { backgroundColor: c.accent }, !on && iso === max && { borderWidth: 1.5, borderColor: c.accent }]}>
                <Text style={{ fontFamily: on ? fonts.bold : fonts.medium, fontSize: 15, color: on ? '#FFFFFF' : future ? c.border : c.text }}>{d}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </DesignSheet>
  );
}

const ITEM = 44;
/** Hour and minute wheels. */
export function TimePickerSheet({ visible, title, value, onPick, onClose }: { visible: boolean; title: string; value: string; onPick: (hhmm: string) => void; onClose: () => void }) {
  const c = useHomeColors();
  const [h, setH] = useState(Number(value.slice(0, 2)) || 0);
  const [m, setM] = useState(Number(value.slice(3, 5)) || 0);
  useEffect(() => { if (visible) { setH(Number(value.slice(0, 2)) || 0); setM(Number(value.slice(3, 5)) || 0); } }, [visible, value]);
  return (
    <DesignSheet visible={visible} onClose={onClose} title={title}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
        <Wheel count={24} value={h} onChange={setH} />
        <Text style={{ alignSelf: 'center', fontFamily: fonts.bold, fontSize: 22, color: c.text }}>:</Text>
        <Wheel count={60} value={m} onChange={setM} />
      </View>
      <Pressable onPress={() => onPick(`${pad(h)}:${pad(m)}`)} accessibilityRole="button" style={{ height: 50, borderRadius: 25, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: '#FFFFFF' }}>Set {pad(h)}:{pad(m)}</Text>
      </Pressable>
    </DesignSheet>
  );
}

function Wheel({ count, value, onChange }: { count: number; value: number; onChange: (n: number) => void }) {
  const c = useHomeColors();
  const ref = useRef<ComponentRef<typeof ScrollView>>(null);
  return (
    <ScrollView
      ref={ref}
      style={{ height: ITEM * 5, width: 84 }}
      showsVerticalScrollIndicator={false}
      onLayout={() => ref.current?.scrollTo({ y: value * ITEM, animated: false })}
      snapToInterval={ITEM}
      decelerationRate="fast"
      contentContainerStyle={{ paddingVertical: ITEM * 2 }}
      onMomentumScrollEnd={(e) => onChange(Math.max(0, Math.min(count - 1, Math.round(e.nativeEvent.contentOffset.y / ITEM))))}
    >
      {Array.from({ length: count }, (_, i) => {
        const on = i === value;
        return (
          <Pressable key={i} onPress={() => { onChange(i); ref.current?.scrollTo({ y: i * ITEM, animated: true }); }} style={{ height: ITEM, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: on ? '#FBE4E4' : 'transparent' }}>
            <Text style={{ fontFamily: on ? fonts.bold : fonts.medium, fontSize: on ? 22 : 18, color: on ? c.accent : c.textMuted }}>{pad(i)}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  field: { height: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14 },
  nav: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cell: { width: `${100 / 7}%`, height: 46, alignItems: 'center', justifyContent: 'center' },
  day: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
