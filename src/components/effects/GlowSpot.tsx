import { useId } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

type Props = {
  /** Diameter of the CSS circle being blurred (w-36 = 144). */
  size: number;
  /** Blur radius in px (blur-2xl = 40). The glow extends this far past the circle. */
  blur?: number;
  color: string;
  /** Peak opacity at the center (volt/10 = 0.1). */
  opacity: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Soft light spot: the RN equivalent of a CSS `rounded-full bg-color/10 blur-2xl` blob.
 * A blurred disc is a radial falloff, so a radial gradient reproduces it without a blur filter.
 */
export function GlowSpot({ size, blur = 40, color, opacity, style }: Props) {
  const id = useId();
  const total = size + blur * 2;
  const r = total / 2;
  const core = size / 2 / r; // where the original disc edge sits, as a fraction of the radius

  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width: total, height: total }, style]}>
      <Svg width={total} height={total}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset={Math.max(0, core - 0.25)} stopColor={color} stopOpacity={opacity} />
            <Stop offset={core} stopColor={color} stopOpacity={opacity * 0.5} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={r} cy={r} r={r} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
