import { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme';

type Props = { style?: StyleProp<ViewStyle> };

/** Pulsing placeholder block for loading states. */
export function Skeleton({ style }: Props) {
  const reduced = useReducedMotion();
  const pulse = useSharedValue(0.45);

  useEffect(() => {
    if (reduced) return;
    pulse.value = withRepeat(withTiming(0.9, { duration: 750, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [pulse, reduced]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return <Animated.View style={[{ backgroundColor: colors.surface.high, borderRadius: 8 }, style, animatedStyle]} />;
}
