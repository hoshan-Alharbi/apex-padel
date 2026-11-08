import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { AppText } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

const N = 21; // modules per side, like a version-1 QR

/** Seeded pseudo-random generator so a booking always draws the same pattern. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const inFinder = (x: number, y: number) => {
  const corner = (cx: number, cy: number) => x >= cx && x < cx + 8 && y >= cy && y < cy + 8;
  return corner(0, 0) || corner(N - 8, 0) || corner(0, N - 8);
};

/**
 * Decorative entry code: QR-like (finder squares + seeded modules), not a scannable QR —
 * there is no gate to scan in the UI-only phase.
 */
export function PassCode({ seed, dimmed = false }: { seed: string; dimmed?: boolean }) {
  const { s } = useI18n();
  const rand = rng(seed);
  const modules: { x: number; y: number; volt: boolean }[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (inFinder(x, y)) continue;
      const r = rand();
      if (r < 0.42) modules.push({ x, y, volt: r < 0.12 });
    }
  }
  const finder = (fx: number, fy: number) => (
    <>
      <Rect x={fx} y={fy} width={7} height={7} fill={colors.volt.DEFAULT} />
      <Rect x={fx + 1} y={fy + 1} width={5} height={5} fill={colors.bg} />
      <Rect x={fx + 2} y={fy + 2} width={3} height={3} fill={colors.volt.DEFAULT} />
    </>
  );

  return (
    <View style={[styles.frame, dimmed && styles.dimmed]}>
      <View style={styles.inner}>
        <Svg width="100%" height="100%" viewBox={`-1 -1 ${N + 2} ${N + 2}`}>
          {modules.map((m) => (
            <Rect key={`${m.x}-${m.y}`} x={m.x + 0.08} y={m.y + 0.08} width={0.84} height={0.84} fill={m.volt ? colors.volt.DEFAULT : colors.ink.strong} />
          ))}
          {finder(0, 0)}
          {finder(N - 7, 0)}
          {finder(0, N - 7)}
        </Svg>
      </View>
      <View style={styles.gate}>
        <AppText variant="badge" weight="bold" tone="volt" uppercase align="center" style={{ letterSpacing: 0 }}>
          {s.pass.gate}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: 200, padding: 12, paddingBottom: 26, borderRadius: 18, backgroundColor: '#FFFFFF', alignSelf: 'center' },
  dimmed: { opacity: 0.25 },
  inner: { aspectRatio: 1, borderRadius: 10, padding: 6, backgroundColor: colors.bg },
  gate: {
    position: 'absolute',
    bottom: -14,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: 'rgba(202,243,0,0.4)',
  },
});
