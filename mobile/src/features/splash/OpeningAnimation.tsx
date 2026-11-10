import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, FeGaussianBlur, Filter, G, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { haptics } from '@/lib/haptics';
import { colors } from '@/theme';

import {
  APEX_CLIP_Y,
  APEX_POINTS,
  APEX_SHADE_POINTS,
  BALL_RADIUS,
  BALL_REST_DEG,
  CENTER,
  COURT_DOTS,
  COURT_LINES,
  DOTS,
  drawableDashes,
  HANDLE_PATH,
  LOGO_COLORS as C,
  MARK_CENTER_Y,
  MARK_WIDTH,
  ORBIT_LENGTH,
  ORBIT_RADIUS,
  RING_LENGTH,
  RING_PATH,
  VIEWBOX,
} from './logo';
import {
  clamp,
  easeInOut,
  easeInOutSine,
  easeOut,
  END,
  HAPTIC_AT,
  REDUCED_HOLD_MS,
  seg,
  SKIP_TO,
  spring,
  springStiff,
  TL,
} from './timeline';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

/** Size of the logo in the header when it lands (px, mark width). */
const HEADER_MARK_SIZE = 22;
/** Height of the ball's settling hop (viewBox units). */
const HOP = 40;
/** Ball layer box (viewBox units), wide enough for its glow. */
const BALL_BOX = 100;
/** Start anyway if the screen behind never reports ready (e.g. launched on another route). */
const START_TIMEOUT_MS = 1500;

type Point = { x: number; y: number };
type Clock = { t: SharedValue<number> };

type Props = {
  /** Called on mount, so Home mounts behind the overlay. */
  onReveal: () => void;
  /** Home has laid out: safe to start without its mount freezing frames. */
  canStart: boolean;
  onFinish: () => void;
  /** Screen point where the logo lands: the location pin in the Home header. */
  exitTo: Point;
};

/**
 * Opening: the logo assembles from its pieces (court lines, racket ring, handle, dots, the A,
 * the ball lapping its orbit), then shrinks into the Home header while Home fades in.
 * One Reanimated clock drives every piece on the UI thread. Tap to skip to the exit.
 */
export function OpeningAnimation({ onReveal, onFinish, exitTo, canStart }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  const skipped = useSharedValue(false);

  const size = Math.min(W * 0.8, 320);
  const k = size / VIEWBOX; // px per viewBox unit
  const cx = W / 2;
  const cy = H * 0.48;

  const play = (from: number) => {
    t.set(from);
    t.set(
      withTiming(END, { duration: (END - from) * 1000, easing: Easing.linear }, (done) => {
        if (done) scheduleOnRN(onFinish);
      }),
    );
  };

  const started = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mount Home behind the overlay first; the animation waits for it (see `canStart`).
  useEffect(() => {
    onReveal();
    if (reduced) t.set(SKIP_TO); // Reduce Motion: the finished logo, still
    return () => {
      cancelAnimation(t);
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one run per mount
  }, []);

  useEffect(() => {
    const start = () => {
      if (started.current) return;
      started.current = true;
      if (reduced) holdTimer.current = setTimeout(onFinish, REDUCED_HOLD_MS);
      else play(0);
    };
    if (canStart) {
      const raf = requestAnimationFrame(start);
      return () => cancelAnimationFrame(raf);
    }
    const id = setTimeout(start, START_TIMEOUT_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start is keyed on readiness only
  }, [canStart]);

  useAnimatedReaction(
    () => t.value >= HAPTIC_AT,
    (landed, prev) => {
      if (landed && prev === false && !skipped.value) scheduleOnRN(haptics.tap);
    },
  );

  const skip = () => {
    if (reduced || t.get() >= SKIP_TO) return;
    skipped.set(true);
    cancelAnimation(t);
    play(SKIP_TO);
  };

  // Exit: move the mark's centre onto the header pin and shrink it to the header size.
  const scaleTo = HEADER_MARK_SIZE / (MARK_WIDTH * k);
  const dx = exitTo.x - cx;
  const dy = exitTo.y - cy - scaleTo * (MARK_CENTER_Y - CENTER) * k;

  // Same curve as the logo's move, so the logo leads and Home doesn't show before it moves.
  const backdropStyle = useAnimatedStyle(() => ({ opacity: 1 - easeInOut(seg(t.value, TL.exit[0], TL.exit[1])) }));
  const logoStyle = useAnimatedStyle(() => {
    const p = easeInOut(seg(t.value, TL.exit[0], TL.exit[1]));
    return {
      opacity: 1 - seg(t.value, END - 0.07, END), // melts into the pin
      transform: [{ translateX: dx * p }, { translateY: dy * p }, { scale: 1 + (scaleTo - 1) * p }],
    };
  });

  return (
    <View style={styles.overlay}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} />
      <Animated.View pointerEvents="none" style={[styles.abs, { left: cx - size / 2, top: cy - size / 2, width: size, height: size }, logoStyle]}>
        <Base t={t} size={size} />
        <Handle t={t} size={size} k={k} />
        <Apex t={t} size={size} k={k} />
        <Ball t={t} k={k} />
      </Animated.View>
      <Pressable style={StyleSheet.absoluteFill} onPress={skip} accessibilityRole="button" accessibilityLabel="Apex Padel" />
    </View>
  );
}

/** Court lines, orbit (+ trail), racket ring and dots: everything drawn with stroke/size props. */
function Base({ t, size }: Clock & { size: number }) {
  const ringProps = useAnimatedProps(() => {
    const p = easeInOut(seg(t.value, TL.ring[0], TL.ring[1]));
    return { strokeDashoffset: RING_LENGTH * (1 - p), opacity: p > 0 ? 1 : 0 };
  });
  const courtDotsProps = useAnimatedProps(() => ({ opacity: seg(t.value, TL.court[1] * 0.5, TL.court[1]) }));
  // The orbit is revealed behind the ball; its stroke starts at the rest point (rotated).
  const orbitProps = useAnimatedProps(() => ({ strokeDashoffset: ORBIT_LENGTH * (1 - ballSwept(t.value) / 360) }));
  const trailProps = useAnimatedProps(() => {
    const swept = ballSwept(t.value);
    const fade = 1 - seg(t.value, TL.bounce[0] - 0.04, TL.bounce[1]);
    const len = Math.min(ORBIT_LENGTH * 0.2, (ORBIT_LENGTH * swept) / 360) * fade;
    const head = ((BALL_REST_DEG + swept + 360) / 360) * ORBIT_LENGTH;
    return {
      strokeDasharray: [len, ORBIT_LENGTH - len],
      strokeDashoffset: -((((head - len) % ORBIT_LENGTH) + ORBIT_LENGTH) % ORBIT_LENGTH),
      opacity: t.value >= TL.lap[0] ? 0.9 * fade : 0,
    };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="cyan" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.cyanLight} />
          <Stop offset="1" stopColor={C.cyanDeep} />
        </LinearGradient>
      </Defs>
      {COURT_LINES.map((line) => (
        <CourtLine key={line.d} t={t} d={line.d} length={line.length} />
      ))}
      <AnimatedG animatedProps={courtDotsProps} fill={C.courtDot}>
        {COURT_DOTS.map(([x, y]) => (
          <Circle key={`${x}-${y}`} cx={x} cy={y} r={15} />
        ))}
      </AnimatedG>
      <AnimatedCircle
        cx={CENTER}
        cy={CENTER}
        r={ORBIT_RADIUS}
        fill="none"
        stroke={C.orbit}
        strokeWidth={5}
        strokeDasharray={[ORBIT_LENGTH, ORBIT_LENGTH]}
        transform={`rotate(${BALL_REST_DEG} ${CENTER} ${CENTER})`}
        animatedProps={orbitProps}
      />
      <AnimatedCircle cx={CENTER} cy={CENTER} r={ORBIT_RADIUS} fill="none" stroke={C.volt} strokeWidth={7} strokeLinecap="round" animatedProps={trailProps} />
      <AnimatedPath
        d={RING_PATH}
        fill="none"
        stroke="url(#cyan)"
        strokeWidth={26}
        strokeLinecap="round"
        strokeDasharray={[RING_LENGTH, RING_LENGTH]}
        animatedProps={ringProps}
      />
      {DOTS.map((dot, i) => (
        <Dot key={`${dot.cx}-${dot.cy}`} t={t} index={i} {...dot} />
      ))}
    </Svg>
  );
}

function CourtLine({ t, d, length }: Clock & { d: string; length: number }) {
  const { dashes, period } = drawableDashes(length);
  const props = useAnimatedProps(() => ({
    strokeDashoffset: period - easeOut(seg(t.value, TL.court[0], TL.court[1])) * length,
  }));
  return <AnimatedPath d={d} stroke={C.court} strokeWidth={4} fill="none" strokeDasharray={dashes} animatedProps={props} />;
}

function Dot({ t, index, cx, cy, r, fill }: Clock & { index: number; cx: number; cy: number; r: number; fill: string }) {
  const [start, stagger, duration] = TL.dots;
  const props = useAnimatedProps(() => {
    const s0 = start + index * stagger;
    return { r: r * spring(seg(t.value, s0, s0 + duration)) };
  });
  return <AnimatedCircle cx={cx} cy={cy} fill={fill} animatedProps={props} />;
}

/** Handle: springs up into place under the ring. */
function Handle({ t, size, k }: Clock & { size: number; k: number }) {
  const style = useAnimatedStyle(() => {
    const p = seg(t.value, TL.handle[0], TL.handle[1]);
    return { opacity: clamp(p * 3), transform: [{ translateY: (1 - spring(p)) * 70 * k }] };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
        <Defs>
          <LinearGradient id="voltHandle" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={C.voltLight} />
            <Stop offset="1" stopColor={C.voltDeep} />
          </LinearGradient>
        </Defs>
        <Path d={HANDLE_PATH} fill="url(#voltHandle)" />
        <Rect x={476} y={892} width={72} height={12} rx={6} fill={C.grip} />
      </Svg>
    </Animated.View>
  );
}

/** The A: rises out of the racket mouth (clipped by the view) with a glow pulse. */
function Apex({ t, size, k }: Clock & { size: number; k: number }) {
  const riseStyle = useAnimatedStyle(() => {
    const p = seg(t.value, TL.apex[0], TL.apex[1]);
    return { opacity: clamp(p * 4), transform: [{ translateY: (1 - springStiff(p)) * 360 * k }] };
  });
  // Static blurred copy; only its opacity animates (rests at the logo's 0.5).
  const glowStyle = useAnimatedStyle(() => ({ opacity: 0.5 + 0.5 * Math.sin(Math.PI * seg(t.value, TL.glow[0], TL.glow[1])) }));
  const box = `0 0 ${VIEWBOX} ${VIEWBOX}`;

  return (
    <View style={[styles.abs, styles.clip, { width: size, height: APEX_CLIP_Y * k }]}>
      <Animated.View style={[{ width: size, height: size }, riseStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}>
          <Svg width={size} height={size} viewBox={box}>
            <Defs>
              <Filter id="apexGlow" x="-30%" y="-30%" width="160%" height="160%">
                <FeGaussianBlur stdDeviation={16} />
              </Filter>
            </Defs>
            <Polygon points={APEX_POINTS} fill={C.volt} filter="url(#apexGlow)" />
          </Svg>
        </Animated.View>
        <Svg width={size} height={size} viewBox={box} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="voltApex" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={C.voltLight} />
              <Stop offset="1" stopColor={C.voltDeep} />
            </LinearGradient>
          </Defs>
          <Polygon points={APEX_POINTS} fill="url(#voltApex)" />
          <Polygon points={APEX_SHADE_POINTS} fill="#000" opacity={0.18} />
        </Svg>
      </Animated.View>
    </View>
  );
}

/** Ball: one lap of the orbit, then a small hop to settle. */
function Ball({ t, k }: Clock & { k: number }) {
  const box = BALL_BOX * k;
  const style = useAnimatedStyle(() => {
    if (t.value < TL.lap[0]) return { opacity: 0 };
    const swept = ballSwept(t.value);
    const ub = seg(t.value, TL.bounce[0], TL.bounce[1]);
    const hop = t.value >= TL.bounce[0] ? HOP * Math.exp(-3 * ub) * Math.abs(Math.sin(2 * Math.PI * ub)) : 0;
    const a = ((BALL_REST_DEG + swept) * Math.PI) / 180;
    const r = ORBIT_RADIUS + hop;
    return {
      opacity: 1,
      transform: [
        { translateX: (CENTER + r * Math.cos(a)) * k - box / 2 },
        { translateY: (CENTER + r * Math.sin(a)) * k - box / 2 },
        { rotate: `${(swept - 360) * 1.5}deg` }, // spins with travel, ends upright
        { scale: easeOut(seg(t.value, TL.lap[0], TL.lap[0] + 0.06)) },
      ],
    };
  });
  return (
    <Animated.View style={[styles.abs, { left: 0, top: 0, width: box, height: box }, style]}>
      <Svg width={box} height={box} viewBox={`${-BALL_BOX / 2} ${-BALL_BOX / 2} ${BALL_BOX} ${BALL_BOX}`}>
        <Circle r={46} fill={C.volt} opacity={0.16} />
        <Circle r={BALL_RADIUS} fill={C.volt} />
        <Path d="M-27 -2 Q0 -14 27 -2" fill="none" stroke={C.seam} strokeWidth={5} strokeLinecap="round" />
      </Svg>
    </Animated.View>
  );
}

/** Degrees the ball has travelled from its rest point (0 → 360). */
function ballSwept(t: number) {
  'worklet';
  return 360 * easeInOutSine(seg(t, TL.lap[0], TL.lap[1]));
}

const styles = StyleSheet.create({
  // Forced LTR so left/top and translateX are physical in both languages.
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, direction: 'ltr' },
  backdrop: { backgroundColor: colors.bg },
  abs: { position: 'absolute' },
  clip: { left: 0, top: 0, overflow: 'hidden' },
});
