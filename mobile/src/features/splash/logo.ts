// The Apex Padel logo (ref/logo.png) as separate vector pieces, in a 1024×1024 viewBox.
// Colors are the logo artwork's own palette, so they live here and not in the theme.

export const VIEWBOX = 1024;
export const CENTER = 512;

export const LOGO_COLORS = {
  volt: '#D4FF00',
  voltLight: '#E2FF3D',
  voltDeep: '#C2EF00',
  olive: '#AFC72A',
  cyan: '#38BDF8',
  cyanLight: '#4CC9FA',
  cyanDeep: '#0A84C9',
  court: '#2A3240',
  courtDot: '#161C27',
  orbit: '#232A37',
  grip: '#9CA3AF',
  seam: '#0E131D',
} as const;

/** Court crosshair, split into halves that start at the centre so they draw outwards. */
export const COURT_LINES = [
  { d: 'M512 512 H256', length: 256 },
  { d: 'M512 512 H768', length: 256 },
  { d: 'M512 512 V372', length: 140 },
  { d: 'M512 512 V770', length: 258 },
] as const;
export const COURT_DOTS = [
  [512, 470],
  [472, 512],
  [552, 512],
] as const;

export const ORBIT_RADIUS = 320;
export const ORBIT_LENGTH = 2 * Math.PI * ORBIT_RADIUS;
/** Where the ball rests on the orbit (degrees, screen coordinates). */
export const BALL_REST_DEG = -43;
export const BALL_RADIUS = 28;

export const RING_PATH = 'M336 572 A188 188 0 1 0 688 572';
/** Arc length of RING_PATH (r=188, 221°), rounded up so a full offset hides it. */
export const RING_LENGTH = 726;
export const HANDLE_PATH = 'M492 828 H532 L540 888 H484 Z';

/** Racket dots in reveal order: top → bottom, centre → out. */
export const DOTS = [
  { cx: 512, cy: 580, r: 20, fill: LOGO_COLORS.volt },
  { cx: 448, cy: 591, r: 16, fill: LOGO_COLORS.cyan },
  { cx: 576, cy: 591, r: 16, fill: LOGO_COLORS.cyan },
  { cx: 392, cy: 628, r: 12, fill: LOGO_COLORS.olive },
  { cx: 632, cy: 628, r: 12, fill: LOGO_COLORS.olive },
  { cx: 480, cy: 652, r: 18, fill: LOGO_COLORS.volt },
  { cx: 544, cy: 652, r: 18, fill: LOGO_COLORS.volt },
  { cx: 512, cy: 720, r: 22, fill: LOGO_COLORS.volt },
  { cx: 452, cy: 732, r: 15, fill: LOGO_COLORS.cyan },
  { cx: 572, cy: 732, r: 15, fill: LOGO_COLORS.cyan },
] as const;

export const APEX_POINTS = '512,208 752,544 648,544 512,348 376,544 272,544';
export const APEX_SHADE_POINTS = '512,348 648,544 632,544 512,372 392,544 376,544';
/** The A is hidden below this line, so it rises out of the racket mouth. */
export const APEX_CLIP_Y = 560;

/** Bounds of the drawn mark (orbit + handle), used to size it in the header. */
export const MARK_WIDTH = 672;
export const MARK_CENTER_Y = 544;

/**
 * Dash pattern for a dashed line that "draws" with strokeDashoffset: the dashes, then a gap as
 * long as the line. Offset `period` hides it; `period - length` shows it fully.
 */
export function drawableDashes(length: number) {
  const dashes: number[] = [];
  let period = 0;
  while (period < length) {
    dashes.push(14, 12);
    period += 26;
  }
  return { dashes: [...dashes, length], period };
}
