import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { SectionLabel } from '@/components/SectionTitle';
import { useI18n } from '@/i18n';
import { addDays, dayOfMonth, type DateKey, fromDateKey, longDate, monthName, weekdayIndex, weekdayInitials } from '@/lib/format';
import { colors } from '@/theme';

type Props = {
  days: DateKey[];
  today: DateKey;
  value: DateKey;
  onChange: (day: DateKey) => void;
  /** Free slots on a day for the current court and duration (drives the dot and the footer). */
  freeOn: (day: DateKey) => number;
};

/**
 * Week-grid calendar (Sunday first, like Saudi calendars) showing every bookable day at once.
 * Days outside the bookable range keep the grid aligned but are dimmed.
 */
export function DatePicker({ days, today, value, onChange, freeOn }: Props) {
  const { s, lang, plural } = useI18n();
  const first = days[0];
  const last = days[days.length - 1];
  const gridStart = addDays(first, -weekdayIndex(first));
  const gridEnd = addDays(last, 6 - weekdayIndex(last));
  const cells: DateKey[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) cells.push(d);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const bookable = new Set(days);

  const year = fromDateKey(first).getFullYear();
  const months = monthName(first, lang) === monthName(last, lang) ? monthName(first, lang) : `${monthName(first, lang)} – ${monthName(last, lang)}`;
  const free = freeOn(value);

  return (
    <>
      <SectionLabel>{s.book.date}</SectionLabel>
      <View style={styles.card}>
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="calendar-month" size={20} color={colors.cyan.DEFAULT} />
            <AppText variant="headline" weight="bold" tone="strong">
              {months} {year}
            </AppText>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View style={styles.legendDot} />
            <AppText variant="bodySm" tone="muted">
              {s.book.hasSlots}
            </AppText>
          </View>
        </View>

        <View style={styles.row}>
          {weekdayInitials(lang).map((w, i) => (
            <AppText key={i} variant="bodySm" weight="medium" tone="muted" align="center" style={styles.cell}>
              {w}
            </AppText>
          ))}
        </View>

        {weeks.map((week) => (
          <View key={week[0]} style={styles.row}>
            {week.map((day) => (
              <Day
                key={day}
                day={day}
                enabled={bookable.has(day)}
                selected={day === value}
                isToday={day === today}
                free={bookable.has(day) ? freeOn(day) : 0}
                onPress={() => onChange(day)}
              />
            ))}
          </View>
        ))}

        <Animated.View key={value} entering={FadeIn.duration(200)} style={styles.footer}>
          <AppText variant="body" weight="bold" tone="ink">
            {longDate(value, lang)}
          </AppText>
          <AppText variant="bodySm" weight="bold" tone={free > 0 ? 'cyan' : 'crimson'}>
            {free > 0 ? plural(s.book.freeSlots, free) : s.book.fullDay}
          </AppText>
        </Animated.View>
      </View>
    </>
  );
}

type DayProps = { day: DateKey; enabled: boolean; selected: boolean; isToday: boolean; free: number; onPress: () => void };

function Day({ day, enabled, selected, isToday, free, onPress }: DayProps) {
  const label = (
    <AppText weight="mono" tone={selected ? 'onPrimary' : enabled ? 'strong' : 'muted'} align="center" style={styles.num}>
      {dayOfMonth(day)}
    </AppText>
  );
  if (!enabled) {
    return (
      <View style={styles.cell}>
        <View style={[styles.circle, styles.disabled]}>{label}</View>
      </View>
    );
  }
  return (
    <View style={styles.cell}>
      <PressableScale
        haptic="select"
        scaleTo={0.95}
        onPress={onPress}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={day}
        style={[styles.circle, selected ? styles.selected : isToday ? styles.today : null]}
      >
        {label}
        <View style={[styles.dot, { backgroundColor: selected ? colors.onPrimary : free > 0 ? colors.cyan.DEFAULT : 'transparent' }]} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 16, backgroundColor: colors.surface.low, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  row: { flexDirection: 'row', marginBottom: 6 },
  cell: { flex: 1, alignItems: 'center' },
  circle: { width: 42, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingTop: 2 },
  selected: { backgroundColor: colors.volt.DEFAULT, boxShadow: '0px 0px 18px -2px rgba(202,243,0,0.5)' },
  today: { borderWidth: 1.5, borderColor: 'rgba(202,243,0,0.6)' },
  disabled: { opacity: 0.3 },
  num: { fontSize: 16, lineHeight: 22 },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
  legendDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan.DEFAULT },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
});
