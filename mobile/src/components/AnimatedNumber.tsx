import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { AppText, type AppTextProps } from '@/components/AppText';
import { money } from '@/lib/format';

type Props = Omit<AppTextProps, 'children'> & { value: number; duration?: number };

/** Price that counts to its new value (ease-out) instead of jumping. */
export function AnimatedNumber({ value, duration = 380, ...text }: Props) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduced) {
      from.current = value;
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = origin + (value - origin) * eased;
      from.current = v;
      setShown(p < 1 ? Math.round(v) : value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);

  return <AppText {...text}>{money(reduced ? value : shown)}</AppText>;
}
