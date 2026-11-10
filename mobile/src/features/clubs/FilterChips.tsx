import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { useI18n } from '@/i18n';
import { colors, fonts } from '@/theme';
import { TYPE } from '@/theme/typography';

import { CLUB_FILTERS, type ClubFilter } from './filter';

const EMOJI: Record<Exclude<ClubFilter, 'all'>, string> = { ac: '❄️', indoor: '🏟️', outdoor: '☀️' };
const VOLT_GLOW = '0px 0px 24px -2px rgba(202,243,0,0.35)';

type Props = { value: ClubFilter; onChange: (f: ClubFilter) => void };

export function FilterChips({ value, onChange }: Props) {
  const { s } = useI18n();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail} contentContainerStyle={styles.row}>
      {CLUB_FILTERS.map((f) => (
        <Chip key={f} filter={f} label={s.filters[f]} active={value === f} onPress={() => onChange(f)} />
      ))}
    </ScrollView>
  );
}

type ChipProps = { filter: ClubFilter; label: string; active: boolean; onPress: () => void };

/** Active: solid volt + dot + glow. Idle: surface-container pill with a hairline and emoji. */
function Chip({ filter, label, active, onPress }: ChipProps) {
  const { lang } = useI18n();
  const p = useDerivedValue(() => withTiming(active ? 1 : 0, { duration: 200 }));
  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.surface.DEFAULT, colors.volt.DEFAULT]),
    borderColor: interpolateColor(p.value, [0, 1], ['rgba(68,73,50,0.3)', colors.volt.DEFAULT]),
  }));
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(p.value, [0, 1], [colors.ink.soft, colors.bg]),
  }));

  return (
    <PressableScale haptic="select" scaleTo={0.95} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}>
      <Animated.View style={[styles.chip, active ? styles.chipActive : styles.chipIdle, boxStyle]}>
        {filter === 'all' ? (
          <View style={styles.dot} />
        ) : (
          <AppText variant="action">{EMOJI[filter]}</AppText>
        )}
        <Animated.Text
          style={[
            styles.label,
            { letterSpacing: lang === 'en' ? TYPE.action.letterSpacing : 0 },
            textStyle,
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  rail: { marginHorizontal: -16, flexGrow: 0 },
  // Vertical padding leaves room for the active chip's glow inside the scroll clip.
  row: { gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipActive: { paddingHorizontal: 16, boxShadow: VOLT_GLOW },
  chipIdle: { paddingHorizontal: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.bg },
  label: {
    fontFamily: fonts['sans-bold'],
    fontSize: TYPE.action.fontSize,
    lineHeight: TYPE.action.lineHeight,
  },
});
