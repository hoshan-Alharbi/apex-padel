import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';

const PRESS_SPRING = { damping: 18, stiffness: 420, mass: 0.6 };

export type PressableScaleProps = Omit<PressableProps, 'children' | 'style'> & {
  children?: ReactNode;
  /** Tailwind classes for the visible surface (background, radius, padding, row layout…). */
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** How far the element shrinks while pressed. */
  scaleTo?: number;
  haptic?: 'tap' | 'select' | 'none';
};

/**
 * Every tappable surface in the app: springs down on press and gives light haptic feedback.
 * Three layers on purpose — Pressable (touch), Animated.View (scale on the UI thread),
 * View (NativeWind classes) — because NativeWind does not style Reanimated components.
 */
export function PressableScale({
  children,
  className,
  style,
  scaleTo = 0.97,
  haptic = 'tap',
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        scale.set(withSpring(scaleTo, PRESS_SPRING));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, PRESS_SPRING));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic !== 'none') haptics[haptic]();
        onPress?.(e);
      }}
    >
      <Animated.View style={animatedStyle}>
        <View className={className} style={style}>
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
}
