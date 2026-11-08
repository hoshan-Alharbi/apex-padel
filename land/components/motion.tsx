'use client';

// Small client islands for the landing page's motion. Everything else stays a Server Component.
// All of them respect prefers-reduced-motion (final state shown, no animation).

import { CheckCircle, HourglassMedium } from '@phosphor-icons/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Calls `onEnter` once when the element scrolls into view. */
function useInView<T extends Element>(onEnter: () => void, threshold = 0.25) {
  const ref = useRef<T>(null);
  const cb = useRef(onEnter);
  cb.current = onEnter;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cb.current();
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

/**
 * Tilts its child a few degrees toward the pointer. Writes CSS variables from a rAF, so React
 * never re-renders while the mouse moves. Touch and reduced motion: no tilt.
 */
export function PointerTilt({ children, max = 7, className = '' }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const scope = el?.closest('section');
    if (!el || !scope || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = scope.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-y * max * 1.4).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    };
    scope.addEventListener('pointermove', onMove);
    scope.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      scope.removeEventListener('pointermove', onMove);
      scope.removeEventListener('pointerleave', onLeave);
    };
  }, [max]);
  return (
    <div ref={ref} className={`pointer-tilt ${className}`}>
      {children}
    </div>
  );
}

/**
 * Spotlight for card grids: one pointer listener on the grid sets --mx/--my on the hovered card
 * (CSS draws a radial gradient there and fades in a gradient border).
 */
export function SpotlightGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = ref.current;
    if (!grid || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      const cell = (e.target as Element).closest<HTMLElement>('.cell');
      if (!cell) return;
      const r = cell.getBoundingClientRect();
      cell.style.setProperty('--mx', `${e.clientX - r.left}px`);
      cell.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    grid.addEventListener('pointermove', onMove);
    return () => grid.removeEventListener('pointermove', onMove);
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Counts up to `value` (ease-out) the first time it's seen. Non-numeric parts are kept. */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  // "60-120" → animate each number; "2-4" too.
  const parts = value.split(/(\d+)/);
  const targets = parts.map((p) => (/^\d+$/.test(p) ? Number(p) : null));
  const [progress, setProgress] = useState(0);
  const ref = useInView<HTMLSpanElement>(() => {
    if (prefersReducedMotion()) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, 0.5);
  return (
    <span ref={ref} className="mono count" aria-label={value}>
      {parts.map((p, i) => (targets[i] === null ? p : Math.round((targets[i] as number) * progress)))}
    </span>
  );
}

type Player = { name: string; amount: string };
type SplitLabels = { timer: string; paid: string; waiting: string; collected: string[]; complete: string };

/**
 * The split-bill scene: the countdown really ticks, and once the section is in view the players
 * pay one after another (owner first), each card popping as it flips to "paid".
 * `children` is the phone (rendered on the server and passed through).
 */
export function SplitDemo({ players, startSeconds, labels, children }: { players: Player[]; startSeconds: number; labels: SplitLabels; children: ReactNode }) {
  const [paidCount, setPaidCount] = useState(1);
  const [seconds, setSeconds] = useState(startSeconds);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ref = useInView<HTMLDivElement>(() => {
    if (prefersReducedMotion()) {
      setPaidCount(players.length);
      return;
    }
    timers.current = players.slice(1).map((_, i) => setTimeout(() => setPaidCount(i + 2), 1000 + i * 1200));
  }, 0.35);

  useEffect(() => {
    const pending = timers.current;
    if (prefersReducedMotion()) return () => pending.forEach(clearTimeout);
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : startSeconds)), 1000);
    return () => {
      clearInterval(id);
      timers.current.forEach(clearTimeout);
    };
  }, [startSeconds]);

  const done = paidCount >= players.length;
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const half = Math.ceil(players.length / 2);
  const card = (p: Player, i: number) => {
    const paid = i < paidCount;
    return (
      <div key={p.name} className={`player ${paid ? 'is-paid' : 'waiting'}`}>
        <span className={`avatar ${paid ? 'paid' : 'waiting'}`} aria-hidden>
          {p.name.slice(0, 1)}
        </span>
        <span>
          <span className="player-name">{p.name}</span>
          <span className="player-amount">{p.amount}</span>
        </span>
        <span className={`player-status ${paid ? 'paid' : 'waiting'}`}>
          {paid ? <CheckCircle size={18} weight="fill" /> : <HourglassMedium size={18} weight="bold" />}
          {paid ? labels.paid : labels.waiting}
        </span>
      </div>
    );
  };

  return (
    <div ref={ref} className={`split-demo ${done ? 'is-done' : ''}`}>
      <div className="timer">
        <small>{labels.timer}</small>
        <span className="mono">
          {mm}:{ss}
        </span>
        <span className="progress">{done ? labels.complete : labels.collected[paidCount - 1]}</span>
      </div>
      <div className="split-stage">
        <div className="split-side start">{players.slice(0, half).map((p, i) => card(p, i))}</div>
        <div className="split-phone">{children}</div>
        <div className="split-side end">{players.slice(half).map((p, i) => card(p, half + i))}</div>
      </div>
    </div>
  );
}
