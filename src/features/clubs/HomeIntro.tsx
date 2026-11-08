import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PulseDot } from '@/components/effects/Dots';
import { GradientText } from '@/components/effects/GradientText';
import { useI18n } from '@/i18n';
import { colors, fonts } from '@/theme';
import { TYPE } from '@/theme/typography';

/** Greeting pill with a pulsing dot, then the two-line title whose second line is a gradient. */
export function HomeIntro() {
  const { s, format, lang } = useI18n();
  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2 self-start rounded-full border border-line/30 bg-surface px-2.5 py-1">
        <PulseDot size={8} color={colors.volt.DEFAULT} />
        <AppText variant="bodySm" weight="medium" tone="soft">
          {format(s.home.greeting, { name: s.user.firstName })}
        </AppText>
      </View>
      <View>
        <AppText variant="hero" weight="bold" tone="ink">
          {s.home.titleLine1}
        </AppText>
        <GradientText
          style={{
            fontFamily: fonts['sans-bold'],
            fontSize: TYPE.hero.fontSize,
            lineHeight: TYPE.hero.lineHeight,
            letterSpacing: lang === 'en' ? TYPE.hero.letterSpacing : 0,
            textAlign: 'left',
          }}
          colors={['#FFFFFF', colors.ink.DEFAULT, colors.volt.DEFAULT]}
        >
          {s.home.titleLine2}
        </GradientText>
      </View>
    </View>
  );
}
