import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { SectionLabel } from '@/components/SectionTitle';
import type { Club, Duration } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

import { DURATIONS } from './slots';

const RECOMMENDED: Duration = 90;

type Props = { club: Club; value: Duration; onChange: (d: Duration) => void };

/** Three duration cards with their price; 90 minutes carries the "recommended" tab. */
export function DurationPicker({ club, value, onChange }: Props) {
  const { s, lang } = useI18n();
  return (
    <>
      <SectionLabel>{s.book.duration}</SectionLabel>
      <View className="flex-row gap-2" style={styles.row}>
        {DURATIONS.map((d) => {
          const active = d === value;
          return (
            <View key={d} className="flex-1">
              <PressableScale
                haptic="select"
                onPress={() => onChange(d)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={[styles.card, active ? styles.active : styles.idle]}
              >
                <AppText weight="mono" tone="strong" align="center" style={styles.mins}>
                  {d} {lang === 'ar' ? s.common.minutesShort : 'Mins'}
                </AppText>
                <AppText variant="bodySm" tone="soft" align="center" numberOfLines={1}>
                  {s.book.durationHint[`d${d}`]}
                </AppText>
                <AppText variant="numeric" weight="mono" tone={active ? 'volt' : 'muted'} align="center" className="mt-1">
                  {club.prices[d]} {s.common.currency}
                </AppText>
              </PressableScale>
              {d === RECOMMENDED && (
                <View pointerEvents="none" style={styles.ribbon}>
                  <AppText weight="bold" tone="onPrimary" uppercase style={styles.ribbonText}>
                    {s.book.recommended}
                  </AppText>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Room above for the recommended tab, which sits on the card's top edge.
  row: { paddingTop: 8 },
  card: { paddingVertical: 16, paddingHorizontal: 6, borderRadius: 16, gap: 2 },
  active: { backgroundColor: colors.surface.high, borderWidth: 2, borderColor: colors.volt.DEFAULT, boxShadow: '0px 0px 24px -2px rgba(202,243,0,0.35)' },
  idle: { backgroundColor: colors.surface.DEFAULT, borderWidth: 2, borderColor: 'rgba(255,255,255,0.06)' },
  mins: { fontSize: 16, lineHeight: 22 },
  ribbon: {
    position: 'absolute',
    top: -9,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.volt.DEFAULT,
  },
  ribbonText: { fontSize: 10, lineHeight: 14 },
});
