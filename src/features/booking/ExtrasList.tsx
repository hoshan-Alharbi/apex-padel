import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import type { IconName } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import { SectionLabel } from '@/components/SectionTitle';
import type { Extras } from '@/data/types';
import { useI18n } from '@/i18n';
import { haptics } from '@/lib/haptics';
import { colors } from '@/theme';

import { EXTRA_PRICES, MAX_RACKETS } from './pricing';

type Props = { value: Extras; onChange: (next: Extras) => void };

/** Racket rental (counter), balls and drinks (checkboxes). */
export function ExtrasList({ value, onChange }: Props) {
  const { s, format } = useI18n();
  const toggle = (key: 'balls' | 'water') => onChange({ ...value, [key]: !value[key] });

  return (
    <>
      <SectionLabel>{s.book.extras}</SectionLabel>
      <View className="gap-2.5">
        <ExtraRow icon="sports-tennis" color={colors.volt.DEFAULT} title={s.book.racket} sub={format(s.book.racketSub, { price: EXTRA_PRICES.racket })}>
          <Stepper value={value.rackets} max={MAX_RACKETS} onChange={(rackets) => onChange({ ...value, rackets })} />
        </ExtraRow>
        <PressableScale haptic="select" onPress={() => toggle('balls')} accessibilityRole="checkbox" accessibilityState={{ checked: value.balls }}>
          <ExtraRow icon="sports-baseball" color={colors.cyan.DEFAULT} title={s.book.balls} sub={format(s.book.ballsSub, { price: EXTRA_PRICES.balls })}>
            <Check on={value.balls} />
          </ExtraRow>
        </PressableScale>
        <PressableScale haptic="select" onPress={() => toggle('water')} accessibilityRole="checkbox" accessibilityState={{ checked: value.water }}>
          <ExtraRow icon="water-drop" color={colors.ink.DEFAULT} title={s.book.water} sub={format(s.book.waterSub, { price: EXTRA_PRICES.water })}>
            <Check on={value.water} />
          </ExtraRow>
        </PressableScale>
      </View>
    </>
  );
}

function ExtraRow({ icon, color, title, sub, children }: { icon: IconName; color: string; title: string; sub: string; children: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <AppText variant="bodyLg" weight="bold" tone="strong">
          {title}
        </AppText>
        <AppText variant="bodySm" tone="soft">
          {sub}
        </AppText>
      </View>
      {children}
    </View>
  );
}

function Check({ on }: { on: boolean }) {
  return <View style={[styles.check, on && styles.checkOn]}>{on && <MaterialIcons name="check" size={16} color={colors.onPrimary} />}</View>;
}

function Stepper({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  const step = (d: number) => {
    const next = Math.min(max, Math.max(0, value + d));
    if (next !== value) {
      haptics.select();
      onChange(next);
    }
  };
  return (
    <View style={styles.stepper}>
      <Pressable onPress={() => step(-1)} hitSlop={6} style={styles.stepBtn} accessibilityRole="button" accessibilityLabel="-">
        <MaterialIcons name="remove" size={18} color={value > 0 ? colors.ink.DEFAULT : colors.ink.muted} />
      </Pressable>
      <AppText variant="numeric" weight="mono" tone="strong" style={styles.count}>
        {value}
      </AppText>
      <Pressable onPress={() => step(1)} hitSlop={6} style={styles.stepBtn} accessibilityRole="button" accessibilityLabel="+">
        <MaterialIcons name="add" size={18} color={value < max ? colors.volt.DEFAULT : colors.ink.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surface.DEFAULT,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  icon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.high },
  check: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.ink.muted, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.volt.DEFAULT, borderColor: colors.volt.DEFAULT },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: colors.recessed,
  },
  stepBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  count: { minWidth: 18, textAlign: 'center' },
});
