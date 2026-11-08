import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = { size: number; color: string };

/** Tailwind `animate-pulse`: opacity 1 → 0.5 → 1 every 2s. */
export function PulseDot({ size, color }: Props) {
  const reduced = useReducedMotion();
  const o = useSharedValue(1);
  useEffect(() => {
    if (!reduced) o.set(withRepeat(withTiming(0.5, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.6, 1) }), -1, true));
  }, [o, reduced]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]} />;
}

/** Tailwind `animate-ping`: the dot itself sends out an expanding, fading copy every 1s. */
export function PingDot({ size, color }: Props) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (!reduced) p.set(withRepeat(withTiming(1, { duration: 1000, easing: Easing.bezier(0, 0, 0.2, 1) }), -1, false));
  }, [p, reduced]);
  const ring = useAnimatedStyle(() => ({ opacity: 1 - p.value, transform: [{ scale: 1 + p.value }] }));
  const dot = { width: size, height: size, borderRadius: size / 2, backgroundColor: color };
  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[dot, { position: 'absolute' }, ring]} />
      <View style={dot} />
    </View>
  );
}
