import { StyleSheet, Text, type TextProps } from 'react-native';

import { useI18n } from '@/i18n';
import { arabicDescentRoom } from '@/lib/arabicDescent';
import { TYPE, type TypeVariant } from '@/theme/typography';

const WEIGHT = {
  regular: 'font-sans',
  medium: 'font-sans-medium',
  semibold: 'font-sans-semibold',
  bold: 'font-sans-bold',
  mono: 'font-mono',
} as const;

const TONE = {
  ink: 'text-ink',
  strong: 'text-ink-strong',
  soft: 'text-ink-soft',
  muted: 'text-ink-muted',
  volt: 'text-volt',
  onVolt: 'text-volt-ink',
  onPrimary: 'text-onPrimary',
  bg: 'text-bg',
  cyan: 'text-cyan',
  cyanSoft: 'text-cyan-soft',
  crimson: 'text-crimson',
  errorSoft: 'text-error-onContainer',
} as const;

// RN maps 'left' to the start edge and 'right' to the end edge under RTL.

const ALIGN = { start: 'left', center: 'center', end: 'right' } as const;

export type AppTextProps = TextProps & {
  /** Size, line height and tracking from the reference type scale. */
  variant?: TypeVariant;
  weight?: keyof typeof WEIGHT;
  tone?: keyof typeof TONE;
  align?: keyof typeof ALIGN;
  /** Latin only (Arabic has no case). */
  uppercase?: boolean;
  className?: string;
};

/**
 * The only Text the app uses: brand font family per weight (Android ignores fontWeight on
 * custom fonts), the reference type scale, color tone and direction-aware alignment.
 */
export function AppText({
  variant,
  weight = 'regular',
  tone = 'ink',
  align = 'start',
  uppercase = false,
  className = '',
  style,
  ...rest
}: AppTextProps) {
  const { lang } = useI18n();
  const type = variant ? TYPE[variant] : undefined;
  const latin = lang === 'en';
  // Keeps the dots of a final ي from being clipped on Android (see lib/arabicDescent).
  const descentRoom = arabicDescentRoom(StyleSheet.flatten(style) ?? {}, !latin, type?.fontSize);

  return (
    <Text
      className={`${WEIGHT[weight]} ${TONE[tone]} ${className}`}
      style={[
        { textAlign: ALIGN[align] },
        type && {
          fontSize: type.fontSize,
          lineHeight: type.lineHeight,
          letterSpacing: latin ? type.letterSpacing : 0,
        },
        latin && uppercase && { textTransform: 'uppercase' },
        style,
        descentRoom,
      ]}
      {...rest}
    />
  );
}
