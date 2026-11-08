import { Platform, type TextStyle } from 'react-native';

/**
 * Readex Pro draws the dots of a final ي (as in في، نادي) down to ~0.5em below the baseline,
 * deeper than the font's 0.25em descent. Android clips text to the Text view, so those dots
 * vanish ("في" reads as "فى"). This adds bottom room inside the view and takes the same amount
 * back as negative margin, so the dots show and layout doesn't move.
 */
const ROOM_EM = 0.32;
const DEFAULT_FONT_SIZE = 16;

const num = (...v: unknown[]) => (v.find((x) => typeof x === 'number') as number | undefined) ?? 0;

/** Style to append for Arabic text on Android (null elsewhere). Keeps the caller's own bottom spacing. */
export function arabicDescentRoom(flat: TextStyle, arabic: boolean, fallbackSize = DEFAULT_FONT_SIZE): TextStyle | null {
  if (Platform.OS !== 'android' || !arabic) return null;
  const room = Math.ceil((flat.fontSize ?? fallbackSize) * ROOM_EM);
  return {
    paddingBottom: num(flat.paddingBottom, flat.paddingVertical, flat.padding) + room,
    marginBottom: num(flat.marginBottom, flat.marginVertical, flat.margin) - room,
  };
}
