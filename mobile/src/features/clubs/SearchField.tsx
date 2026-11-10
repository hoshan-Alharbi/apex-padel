import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { PressableScale } from '@/components/PressableScale';
import { useI18n } from '@/i18n';
import { colors, fonts } from '@/theme';
import { TYPE } from '@/theme/typography';

type Props = { value: string; onChange: (text: string) => void };

/** Recessed search input (border lights volt on focus) + square filter button. */
export function SearchField({ value, onChange }: Props) {
  const { s, isRTL } = useI18n();
  const [focused, setFocused] = useState(false);
  const p = useDerivedValue(() => withTiming(focused ? 1 : 0, { duration: 200 }));
  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(p.value, [0, 1], ['rgba(68,73,50,0.3)', colors.volt.DEFAULT]),
  }));

  return (
    <View className="flex-row items-center gap-2">
      <Animated.View style={[styles.input, borderStyle]}>
        <MaterialIcons name="search" size={20} color={focused ? colors.volt.DEFAULT : colors.ink.muted} />
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={s.home.searchPlaceholder}
          placeholderTextColor={colors.ink.muted}
          selectionColor={colors.volt.DEFAULT}
          returnKeyType="search"
          style={[styles.text, { textAlign: isRTL ? 'right' : 'left' }]}
        />
      </Animated.View>
      <PressableScale
        scaleTo={0.95}
        accessibilityRole="button"
        accessibilityLabel={s.home.filters}
        className="h-12 w-12 items-center justify-center rounded-md border border-line/40 bg-surface"
      >
        <MaterialIcons name="tune" size={22} color={colors.ink.DEFAULT} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: colors.recessed,
  },
  text: {
    flex: 1,
    height: '100%',
    color: colors.ink.DEFAULT,
    fontFamily: fonts.sans,
    fontSize: TYPE.body.fontSize,
    paddingVertical: 0,
  },
});
