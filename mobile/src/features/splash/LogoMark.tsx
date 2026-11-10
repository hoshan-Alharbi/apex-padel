import Svg, { Circle, Defs, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';

import { APEX_POINTS, BALL_REST_DEG, CENTER, DOTS, HANDLE_PATH, LOGO_COLORS as C, ORBIT_RADIUS, RING_PATH } from './logo';

const rest = (BALL_REST_DEG * Math.PI) / 180;

/** The finished logo, still (same pieces as the opening). Cropped to the mark's bounds. */
export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size * (736 / 672)} viewBox="176 176 672 736">
      <Defs>
        <LinearGradient id="markCyan" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.cyanLight} />
          <Stop offset="1" stopColor={C.cyanDeep} />
        </LinearGradient>
        <LinearGradient id="markVolt" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.voltLight} />
          <Stop offset="1" stopColor={C.voltDeep} />
        </LinearGradient>
      </Defs>
      <Circle cx={CENTER} cy={CENTER} r={ORBIT_RADIUS} fill="none" stroke={C.orbit} strokeWidth={8} />
      <Path d={RING_PATH} fill="none" stroke="url(#markCyan)" strokeWidth={30} strokeLinecap="round" />
      <Path d={HANDLE_PATH} fill="url(#markVolt)" />
      {DOTS.map((d) => (
        <Circle key={`${d.cx}-${d.cy}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} />
      ))}
      <Polygon points={APEX_POINTS} fill="url(#markVolt)" />
      <Circle cx={CENTER + ORBIT_RADIUS * Math.cos(rest)} cy={CENTER + ORBIT_RADIUS * Math.sin(rest)} r={30} fill={C.volt} />
    </Svg>
  );
}
