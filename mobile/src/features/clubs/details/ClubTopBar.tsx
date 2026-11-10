import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

import { HERO_HEIGHT } from './ClubHero';

type Props = { clubId: string; title: string; scrollY: SharedValue<number>; onShare: () => void };

/** Floating header over the photo; turns into a solid bar with the club name as the photo scrolls away. */
export function ClubTopBar({ clubId, title, scrollY, onShare }: Props) {
  const { s, isRTL } = useI18n();
  const insets = useSafeAreaInsets();
  const solidFrom = HERO_HEIGHT - insets.top - 120;

  const bgStyle = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.value, [solidFrom, solidFrom + 60], [0, 1], 'clamp') }));
  const titleStyle = useAnimatedStyle(() => {
    const p = interpolate(scrollY.value, [solidFrom + 30, solidFrom + 90], [0, 1], 'clamp');
    return { opacity: p, transform: [{ translateY: (1 - p) * 8 }] };
  });

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.solid, bgStyle]} />
      <View style={styles.row}>
        <IconButton
          overlay
          icon={isRTL ? 'arrow-forward' : 'arrow-back'}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          accessibilityLabel={s.common.back}
        />
        <Animated.View style={[styles.title, titleStyle]}>
          <AppText variant="headline" weight="bold" tone="strong" align="center" numberOfLines={1}>
            {title}
          </AppText>
        </Animated.View>
        <View className="flex-row gap-2">
          <IconButton overlay icon="share" onPress={onShare} accessibilityLabel={s.common.share} />
          <FavoriteButton clubId={clubId} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  solid: { backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: 'rgba(68,73,50,0.3)' },
  row: { height: 60, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { flex: 1 },
});
