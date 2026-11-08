import { StyleSheet, Text, type TextStyle } from 'react-native';

import { arabicDescentRoom } from '@/lib/arabicDescent';

type Props = {
  children: string;
  style: TextStyle;
  /** Gradient stops (hex #RRGGBB) from the reading start to the reading end. */
  colors: string[];
};

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

function colorAt(stops: number[][], t: number) {
  const scaled = t * (stops.length - 1);
  const i = Math.min(Math.floor(scaled), stops.length - 2);
  const f = scaled - i;
  const [a, b] = [stops[i], stops[i + 1]];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`;
}

// Arabic letters that never connect to the following letter, plus whitespace. A color change
// right after one of these can't break a join, so they are the only safe split points.
const NON_JOINING = /[\sاأإآٱدذرزوؤةءى]/;
const ARABIC = /[؀-ۿ]/;

/** Splits text into runs that can take different colors without breaking Arabic shaping. */
function segments(text: string): string[] {
  const out: string[] = [];
  let run = '';
  for (const ch of Array.from(text)) {
    run += ch;
    if (!ARABIC.test(ch) || NON_JOINING.test(ch)) {
      out.push(run);
      run = '';
    }
  }
  if (run) out.push(run);
  return out;
}

/**
 * CSS `text-transparent bg-clip-text bg-gradient-to-r` for a line of text.
 * One Text with a color span per segment: Latin gets a color per letter; Arabic is split only
 * where letters don't join (Android breaks shaping across color spans), so words stay connected.
 * The gradient follows the reading direction naturally.
 */
export function GradientText({ children, style, colors }: Props) {
  const stops = colors.map(hex);
  const total = Math.max(1, Array.from(children).length - 1);
  // Color each run by the position of its middle character along the line.
  const runs = segments(children).reduce<{ text: string; start: number }[]>((acc, text) => {
    const prev = acc[acc.length - 1];
    const start = prev ? prev.start + Array.from(prev.text).length : 0;
    return [...acc, { text, start }];
  }, []);

  return (
    <Text style={[style, arabicDescentRoom(StyleSheet.flatten(style) ?? {}, ARABIC.test(children))]} accessibilityLabel={children}>
      {runs.map(({ text, start }, i) => {
        const mid = (start + (Array.from(text).length - 1) / 2) / total;
        return (
          <Text key={i} style={{ color: colorAt(stops, Math.min(1, mid)) }}>
            {text}
          </Text>
        );
      })}
    </Text>
  );
}
