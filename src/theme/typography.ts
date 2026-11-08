// Type scale copied from the reference's Tailwind config (ref/*/code.html → fontSize).
// letterSpacing is in px (em × fontSize) and only applies to Latin text: tracking breaks
// the joins between Arabic letters.

export type TypeVariant = 'hero' | 'headline' | 'bodyLg' | 'body' | 'bodySm' | 'numeric' | 'badge' | 'action';

export const TYPE: Record<TypeVariant, { fontSize: number; lineHeight: number; letterSpacing: number }> = {
  hero: { fontSize: 26, lineHeight: 32, letterSpacing: -0.39 }, // headline-lg-mobile, -0.015em
  headline: { fontSize: 18, lineHeight: 24, letterSpacing: 0 }, // headline-sm
  bodyLg: { fontSize: 16, lineHeight: 24, letterSpacing: 0 }, // body-lg
  body: { fontSize: 14, lineHeight: 20, letterSpacing: 0 }, // body-md
  bodySm: { fontSize: 12, lineHeight: 18, letterSpacing: 0 }, // body-sm
  numeric: { fontSize: 14, lineHeight: 18, letterSpacing: 0.7 }, // label-numeric, 0.05em
  badge: { fontSize: 11, lineHeight: 14, letterSpacing: 0.88 }, // label-badge, 0.08em (uppercase is per use)
  action: { fontSize: 15, lineHeight: 20, letterSpacing: 0.15 }, // action-button, 0.01em
};
