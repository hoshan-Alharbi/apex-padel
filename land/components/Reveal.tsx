'use client';

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';

type Props = { children: ReactNode; delay?: number; className?: string };

/**
 * Fades its content up once it scrolls into view (IntersectionObserver, no scroll listener).
 * globals.css shows everything immediately under prefers-reduced-motion, and layout.tsx does
 * the same when JavaScript is off.
 */
export function Reveal({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} data-shown={shown} style={{ '--delay': `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}
