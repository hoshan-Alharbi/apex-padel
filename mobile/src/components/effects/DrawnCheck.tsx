import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const R = 26;
const CIRCLE = 2 * Math.PI * R;
const TICK = 30; // length of the tick path below
const SPARKS = 8;

type Props = { size?: number; color?: string; burst?: boolean };

/** Success mark: the ring and the tick draw themselves, then a light burst of sparks. */
export function DrawnCheck({ size = 64, color = colors.volt.DEFAULT, burst = true }: Props) {
  const reduced = useReducedMotion();
  const ring = useSharedValue(reduced ? 1 : 0);
  const tick = useSharedValue(reduced ? 1 : 0);
  const pop = useSharedValue(reduced ? 1 : 0.6);
  const spark = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) return;
    const ease = Easing.out(Easing.cubic);
    ring.set(withTiming(1, { duration: 420, easing: ease }));
    tick.set(withDelay(320, withTiming(1, { duration: 280, easing: ease })));
    pop.set(withSpring(1, { damping: 9, stiffness: 180 }));
    spark.set(withDelay(420, withTiming(1, { duration: 600, easing: ease })));
  }, [reduced, ring, tick, pop, spark]);

  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCLE * (1 - ring.value) }));
  const tickProps = useAnimatedProps(() => ({ strokeDashoffset: TICK * (1 - tick.value) }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  return (
    <View style={{ width: size, height: size }}>
      {burst && !reduced && Array.from({ length: SPARKS }, (_, i) => <Spark key={i} index={i} size={size} color={color} progress={spark} />)}
      <Animated.View style={popStyle}>
        <Svg width={size} height={size} viewBox="0 0 64 64">
          <Circle cx={32} cy={32} r={R} fill={color} opacity={0.12} />
          <AnimatedCircle
            cx={32}
            cy={32}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={[CIRCLE, CIRCLE]}
            transform="rotate(-90 32 32)"
            animatedProps={ringProps}
          />
          <AnimatedPath
            d="M21 33 L29 41 L44 25"
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={[TICK, TICK]}
            animatedProps={tickProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

function Spark({ index, size, color, progress }: { index: number; size: number; color: string; progress: { value: number } }) {
  const angle = (index / SPARKS) * Math.PI * 2;
  const dist = size * 0.75;
  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: p > 0 && p < 1 ? 1 - p : 0,
      transform: [{ translateX: Math.cos(angle) * dist * p }, { translateY: Math.sin(angle) * dist * p }, { scale: 1 - p * 0.5 }],
    };
  });
  const dot = 6;
  return (
    <Animated.View
      style={[{ position: 'absolute', left: size / 2 - dot / 2, top: size / 2 - dot / 2, width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }, style]}
    />
  );
}
