import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurTargetView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PulseDot } from '@/components/effects/Dots';
import { Glass, useGlassTarget } from '@/components/effects/Glass';
import type { IconName } from '@/components/IconButton';
import type { Club } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

export const HERO_HEIGHT = 300;
const GLASS_TINT = 'rgba(14,19,29,0.75)';

type Props = { club: Club; scrollY: SharedValue<number> };

/** Club photo with glass badges. Parallax on scroll; stretches when pulled down. */
export function ClubHero({ club, scrollY }: Props) {
  const { s, pick, plural } = useI18n();
  const photoRef = useGlassTarget();

  const imageStyle = useAnimatedStyle(() => {
    const y = scrollY.value;
    return {
      transform: [
        { translateY: y < 0 ? y / 2 : y * 0.45 },
        { scale: interpolate(y, [-HERO_HEIGHT, 0], [2, 1], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <View style={styles.hero}>
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <BlurTargetView ref={photoRef} style={StyleSheet.absoluteFill}>
          <Image source={club.image} contentFit="cover" transition={250} style={StyleSheet.absoluteFill} />
        </BlurTargetView>
      </Animated.View>
      <LinearGradient colors={['rgba(14,19,29,0.55)', 'rgba(14,19,29,0)', 'rgba(14,19,29,0.2)', colors.bg]} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />

      <View style={styles.badges}>
        {club.badges.map((b, i) => (
          <Glass key={i} target={photoRef} tint={GLASS_TINT} style={[styles.badge, b.tone === 'cyan' ? styles.cyanBorder : styles.voltBorder]}>
            <MaterialIcons name={(b.icon ?? 'verified') as IconName} size={14} color={b.tone === 'cyan' ? colors.cyan.soft : colors.volt.DEFAULT} />
            <AppText variant="badge" weight="bold" tone={b.tone === 'cyan' ? 'cyanSoft' : 'volt'} uppercase style={styles.badgeText}>
              {pick(b.label)}
            </AppText>
          </Glass>
        ))}
      </View>

      <Glass target={photoRef} tint={GLASS_TINT} style={styles.live}>
        <PulseDot size={8} color={colors.volt.DEFAULT} />
        <AppText variant="bodySm" weight="medium" tone="ink">
          {plural(s.club.courtsLive, club.courts.length)}
        </AppText>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: HERO_HEIGHT, overflow: 'hidden', backgroundColor: colors.surface.low },
  badges: { position: 'absolute', top: 108, start: 16, gap: 8, alignItems: 'flex-start' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  cyanBorder: { borderColor: 'rgba(0,227,253,0.4)' },
  voltBorder: { borderColor: 'rgba(202,243,0,0.4)' },
  badgeText: { letterSpacing: 0 },
  live: {
    position: 'absolute',
    bottom: 20,
    end: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
