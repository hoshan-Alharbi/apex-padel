import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { type ComponentProps, useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Glass, useScreenTarget } from '@/components/effects/Glass';
import { useI18n } from '@/i18n';
import { haptics } from '@/lib/haptics';
import { colors } from '@/theme';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const ICONS: Record<string, { active: IconName; idle: IconName }> = {
  index: { active: 'sports-tennis', idle: 'sports-tennis' },
  bookings: { active: 'calendar-today', idle: 'calendar-today' },
  favorites: { active: 'favorite', idle: 'favorite-border' },
  account: { active: 'person', idle: 'person-outline' },
};

const BAR_HEIGHT = 64; // h-16
const MARK_WIDTH = 28;
/** Side padding of the tab row (and the mark's track), so tabs share the width without it. */
const ROW_PAD = 8;
/** Calm ease-out, no overshoot (springs read as a wobble on the bar). */
const MOVE = { duration: 240, easing: Easing.out(Easing.cubic) };

/** Bottom space screens must leave so content can scroll above the bar. */
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return BAR_HEIGHT + insets.bottom + 24;
}

/**
 * Reference bottom nav: docked, `bg-surface-container-low/95 backdrop-blur-lg`,
 * `shadow-[0_-8px_25px_rgba(0,0,0,0.5)]`, volt active tab. Adds a sliding volt mark on top
 * so tab changes animate.
 */
export function TabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { isRTL } = useI18n();
  const target = useScreenTarget();
  const [barWidth, setBarWidth] = useState(0);
  const count = state.routes.length;
  // The row's measured width includes its side padding; the tabs only share what's inside it.
  const tabWidth = Math.max(0, barWidth - ROW_PAD * 2) / count;
  // Physical slot of the active tab: tabs run right-to-left under RTL. The mark's track is
  // forced LTR so translateX is physical too.
  const slot = isRTL ? count - 1 - state.index : state.index;

  const x = useDerivedValue(() => withTiming(slot * tabWidth + (tabWidth - MARK_WIDTH) / 2, MOVE));
  const markStyle = useAnimatedStyle(() => ({
    opacity: withTiming(barWidth > 0 ? 1 : 0),
    transform: [{ translateX: x.value }],
  }));

  return (
    <View style={[styles.wrap, { height: BAR_HEIGHT + insets.bottom }]}>
      <Glass target={target} tint="rgba(23,28,38,0.95)" intensity={55} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={styles.track}>
        <Animated.View style={[styles.mark, markStyle]} />
      </View>
      <View style={styles.row} onLayout={(e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width)}>
        {state.routes.map((route, index) => {
          const focused = index === state.index;
          const { options } = descriptors[route.key];
          const label = typeof options.title === 'string' ? options.title : route.name;
          const onPress = () => {
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              haptics.select();
              navigateToTab(route.key);
            }
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={styles.item}
            >
              <TabItem focused={focused} label={label} icons={ICONS[route.name] ?? ICONS.index} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TabItem({ focused, label, icons }: { focused: boolean; label: string; icons: { active: IconName; idle: IconName } }) {
  const progress = useDerivedValue(() => withTiming(focused ? 1 : 0, MOVE));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -1.5 * progress.value }, { scale: 1 + 0.1 * progress.value }],
  }));

  return (
    <View style={styles.itemInner}>
      <Animated.View style={iconStyle}>
        <MaterialIcons name={focused ? icons.active : icons.idle} size={24} color={focused ? colors.volt.DEFAULT : colors.ink.soft} />
      </Animated.View>
      <AppText variant="badge" weight="bold" tone={focused ? 'volt' : 'soft'} align="center">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    boxShadow: '0px -8px 25px 0px rgba(0,0,0,0.5)',
  },
  row: { height: BAR_HEIGHT, flexDirection: 'row', paddingHorizontal: ROW_PAD },
  track: { position: 'absolute', top: 0, left: ROW_PAD, right: ROW_PAD, height: 3, direction: 'ltr' },
  mark: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: MARK_WIDTH,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.volt.DEFAULT,
    boxShadow: '0px 0px 10px 0px rgba(202,243,0,0.6)',
  },
  item: { flex: 1 },
  itemInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
});
