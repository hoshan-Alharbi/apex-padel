// The Apex Padel mark, same geometry as the app (mobile/src/features/splash/logo.ts).

const C = { volt: '#D4FF00', voltLight: '#E2FF3D', voltDeep: '#C2EF00', olive: '#AFC72A', cyan: '#38BDF8', cyanLight: '#4CC9FA', cyanDeep: '#0A84C9', orbit: '#2A3242' };

const DOTS: [number, number, number, string][] = [
  [512, 580, 20, C.volt],
  [448, 591, 16, C.cyan],
  [576, 591, 16, C.cyan],
  [392, 628, 12, C.olive],
  [632, 628, 12, C.olive],
  [480, 652, 18, C.volt],
  [544, 652, 18, C.volt],
  [512, 720, 22, C.volt],
  [452, 732, 15, C.cyan],
  [572, 732, 15, C.cyan],
];

export function Logo({ size = 34, title }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size * (736 / 672)} viewBox="176 176 672 736" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="logo-cyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.cyanLight} />
          <stop offset="1" stopColor={C.cyanDeep} />
        </linearGradient>
        <linearGradient id="logo-volt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.voltLight} />
          <stop offset="1" stopColor={C.voltDeep} />
        </linearGradient>
      </defs>
      <circle cx="512" cy="512" r="320" fill="none" stroke={C.orbit} strokeWidth="8" />
      <path d="M336 572 A188 188 0 1 0 688 572" fill="none" stroke="url(#logo-cyan)" strokeWidth="30" strokeLinecap="round" />
      <path d="M492 828 H532 L540 888 H484 Z" fill="url(#logo-volt)" />
      {DOTS.map(([cx, cy, r, fill]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />
      ))}
      <polygon points="512,208 752,544 648,544 512,348 376,544 272,544" fill="url(#logo-volt)" />
      <circle cx="746" cy="294" r="30" fill={C.volt} />
    </svg>
  );
}
