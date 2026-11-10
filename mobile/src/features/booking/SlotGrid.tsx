import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import type { IconName } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import { SectionLabel } from '@/components/SectionTitle';
import { useI18n } from '@/i18n';
import { clockTime } from '@/lib/format';
import { colors } from '@/theme';

import { groupByPeriod, type Period, type Slot } from './slots';

const PERIOD_ICON: Record<Period, IconName> = { afternoon: 'wb-sunny', evening: 'sports-score', late: 'nightlight-round' };

type Props = { slots: Slot[]; value: number | null; onChange: (start: number) => void };

/** Slots grouped by part of day. Booked ones are struck through and can't be picked. */
export function SlotGrid({ slots, value, onChange }: Props) {
  const { s } = useI18n();
  const groups = groupByPeriod(slots);

  return (
    <>
      <SectionLabel>{s.book.slots}</SectionLabel>
      {groups.length === 0 ? (
        <EmptyState icon="event-busy" title={s.book.noSlots} body={s.book.noSlotsBody} />
      ) : (
        <View className="gap-3">
          {groups.map((g) => (
            <Animated.View key={g.period} entering={FadeIn.duration(250)} style={styles.group}>
              <View className="mb-3 flex-row items-center gap-2">
                <MaterialIcons name={PERIOD_ICON[g.period]} size={18} color={g.period === 'evening' ? colors.volt.DEFAULT : colors.cyan.DEFAULT} />
                <AppText variant="headline" weight="bold" tone="strong">
                  {s.book.periods[g.period]}
                </AppText>
                <View style={[styles.tag, g.period === 'evening' && styles.tagPeak]}>
                  <AppText variant="badge" weight="bold" tone={g.period === 'evening' ? 'volt' : 'soft'} uppercase>
                    {s.book.periodTags[g.period]}
                  </AppText>
                </View>
              </View>
              <View className="flex-row flex-wrap" style={styles.grid}>
                {g.slots.map((slot) => (
                  <View key={slot.start} style={styles.cell}>
                    <SlotButton slot={slot} selected={slot.start === value} onPress={() => onChange(slot.start)} />
                  </View>
                ))}
              </View>
            </Animated.View>
          ))}
        </View>
      )}
    </>
  );
}

function SlotButton({ slot, selected, onPress }: { slot: Slot; selected: boolean; onPress: () => void }) {
  const { s, lang } = useI18n();
  const time = clockTime(slot.start, lang);

  if (slot.booked) {
    return (
      <View style={[styles.slot, styles.booked]} accessibilityState={{ disabled: true }} accessibilityLabel={`${time} ${s.book.booked}`}>
        <AppText variant="numeric" weight="mono" tone="muted" style={styles.struck}>
          {time}
        </AppText>
        <AppText variant="bodySm" tone="muted">
          {s.book.booked}
        </AppText>
      </View>
    );
  }

  return (
    <PressableScale
      haptic="select"
      scaleTo={0.98}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.slot, selected ? styles.selected : styles.free]}
    >
      <AppText variant="numeric" weight="mono" tone={selected ? 'onPrimary' : 'strong'}>
        {time}
      </AppText>
      {selected ? (
        <Animated.View entering={FadeIn.duration(160)} className="flex-row items-center gap-1">
          <MaterialIcons name="check-circle-outline" size={15} color={colors.onPrimary} />
          <AppText variant="bodySm" weight="bold" tone="onPrimary">
            {s.book.selected}
          </AppText>
        </Animated.View>
      ) : (
        <View className="flex-row items-center gap-1">
          <View style={styles.dot} />
          <AppText variant="bodySm" tone="cyan">
            {s.book.available}
          </AppText>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  group: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surface.low,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: colors.surface.high },
  tagPeak: { backgroundColor: 'rgba(202,243,0,0.12)' },
  grid: { margin: -4 },
  cell: { width: '50%', padding: 4 },
  slot: {
    minHeight: 54,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  free: { backgroundColor: colors.recessed, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  selected: { backgroundColor: colors.volt.DEFAULT, boxShadow: '0px 0px 24px -2px rgba(202,243,0,0.45)' },
  booked: { backgroundColor: 'rgba(18,23,33,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', opacity: 0.6 },
  struck: { textDecorationLine: 'line-through' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan.DEFAULT },
});
