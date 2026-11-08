// Padel court markings (20 × 10 m: outline, net, service lines, centre line) as SVG.
// `draw` animates the strokes in on load (pathLength=1 + dashoffset, see sections.css).

type Props = { className?: string; draw?: boolean };

export function CourtLines({ className = '', draw = false }: Props) {
  const line = { pathLength: 1, vectorEffect: 'non-scaling-stroke' as const };
  return (
    <svg className={`court-lines ${draw ? 'is-drawing' : ''} ${className}`} viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect x="2" y="2" width="996" height="496" rx="4" fill="none" {...line} />
      <path d="M500 0 V500" {...line} className="net" />
      <path d="M195 0 V500 M805 0 V500" {...line} />
      <path d="M195 250 H805" {...line} />
    </svg>
  );
}
