import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { useI18n } from '@/i18n';
import { haptics } from '@/lib/haptics';
import { colors } from '@/theme';

type Props = { value: boolean; onChange: (next: boolean) => void; accessibilityLabel: string; disabled?: boolean };

const TRACK_W = 52;
const KNOB = 24;
const PAD = 4;

/** Volt switch from the reference ("Split with players"): the knob springs across. */
export function Toggle({ value, onChange, accessibilityLabel, disabled = false }: Props) {
  const { isRTL } = useI18n();
  const travel = (isRTL ? -1 : 1) * (TRACK_W - KNOB - PAD * 2);
  const on = useDerivedValue(() => withSpring(value ? 1 : 0, { damping: 16, stiffness: 260 }));
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(on.value, [0, 1], [colors.surface.highest, colors.volt.DEFAULT]),
  }));
  // The knob starts at the start edge; "on" slides it to the end edge (translateX is physical).
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: on.value * travel }],
    backgroundColor: interpolateColor(on.value, [0, 1], [colors.ink.soft, colors.bg]),
  }));

  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        haptics.select();
        onChange(!value);
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={disabled && styles.disabled}
    >
      <Animated.View style={[styles.track, track]}>
        <Animated.View style={[styles.knob, knob]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: TRACK_W, height: KNOB + PAD * 2, borderRadius: 999, padding: PAD, alignItems: 'flex-start' },
  knob: { width: KNOB, height: KNOB, borderRadius: KNOB / 2 },
  disabled: { opacity: 0.4 },
});
