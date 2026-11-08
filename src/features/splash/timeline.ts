// Opening timeline (seconds): the logo assembles from its pieces, then shrinks into the
// Home header. Mirrors the approved preview: docs/design/logo-opening-preview.html.
// Shared by every animated piece (UI-thread worklets).

/**
 * Overall pace: every time below is multiplied by it. 1 = the original 1.6 s cut; the owner
 * asked for it slower so the details read, hence 1.5 (≈2.4 s). Tune this, not the table.
 */
export const PACE = 1.5;
const at = (...times: number[]) => times.map((v) => v * PACE);
const span = (a: number, b: number) => at(a, b) as [number, number];

export const TL = {
  court: span(0.0, 0.3), // court lines draw from the centre outwards
  ring: span(0.18, 0.52), // racket ring draws as one stroke
  handle: span(0.36, 0.6), // handle slides up under the ring
  dots: at(0.42, 0.03, 0.22) as [number, number, number], // start, stagger per dot, per-dot duration
  apex: span(0.7, 1.0), // A rises out of the racket mouth
  glow: span(0.8, 1.0), // A glow pulse
  lap: span(0.8, 1.3), // ball laps the orbit, drawing it
  bounce: span(1.3, 1.4), // ball settles with a hop
  exit: span(1.4, 1.6), // logo shrinks into the header, Home fades in
};

export const END = TL.exit[1];
export const HAPTIC_AT = TL.bounce[0];
/** A tap jumps straight to the exit. */
export const SKIP_TO = TL.exit[0];
/** Reduce Motion: how long the static logo stays before Home. */
export const REDUCED_HOLD_MS = 600;

export const clamp = (v: number, a = 0, b = 1) => {
  'worklet';
  return Math.min(b, Math.max(a, v));
};
/** Progress 0→1 of `t` inside [a, b]. */
export const seg = (t: number, a: number, b: number) => {
  'worklet';
  return clamp((t - a) / (b - a));
};
export const easeOut = (t: number) => {
  'worklet';
  return 1 - Math.pow(1 - t, 3);
};
export const easeInOut = (t: number) => {
  'worklet';
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
/** Gentle in-out: peak speed ≈1.6× the average (cubic is 3×). Used for the ball's lap. */
export const easeInOutSine = (t: number) => {
  'worklet';
  return -(Math.cos(Math.PI * t) - 1) / 2;
};
/** Spring with ~15% overshoot, settled at t=1. */
export const spring = (t: number) => {
  'worklet';
  return t <= 0 ? 0 : 1 - Math.exp(-6 * t) * Math.cos(10 * t);
};
/** Stiffer spring, ~6% overshoot. */
export const springStiff = (t: number) => {
  'worklet';
  return t <= 0 ? 0 : 1 - Math.exp(-8 * t) * Math.cos(9 * t);
};
