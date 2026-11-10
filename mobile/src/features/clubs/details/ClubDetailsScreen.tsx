import { router } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { BottomBar, useBottomBarSpace } from '@/components/BottomBar';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CLUBS } from '@/data/clubs';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

import { startingPrice } from '../filter';
import { ClubHero } from './ClubHero';
import { ClubInfo } from './ClubInfo';
import { Amenities, CancellationPolicy, Courts, Reviews } from './ClubSections';
import { ClubTopBar } from './ClubTopBar';

const ENTER = (i: number) => FadeInDown.delay(60 * i).duration(420);

export function ClubDetailsScreen({ clubId }: { clubId: string }) {
  const { s, pick, format } = useI18n();
  const club = CLUBS.find((c) => c.id === clubId);
  const [courtId, setCourtId] = useState(club?.courts[0]?.id);
  const scrollY = useSharedValue(0);
  const bar = useBottomBarSpace();
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  if (!club) return <ClubNotFound />;
  const court = club.courts.find((c) => c.id === courtId) ?? club.courts[0];
  const { price, duration } = startingPrice(club);
  const share = () => Share.share({ message: format(s.club.shareMessage, { club: pick(club.name), address: pick(club.address) }) }).catch(() => {});

  return (
    <View style={styles.root}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bar.paddingBottom }}>
        <ClubHero club={club} scrollY={scrollY} />
        <View style={styles.body}>
          <Animated.View entering={ENTER(0)}>
            <ClubInfo club={club} onShare={share} />
          </Animated.View>
          <Animated.View entering={ENTER(1)}>
            <Amenities club={club} />
          </Animated.View>
          <Animated.View entering={ENTER(2)}>
            <Courts club={club} selected={court} onSelect={(c) => setCourtId(c.id)} />
          </Animated.View>
          <Animated.View entering={ENTER(3)}>
            <Reviews club={club} />
          </Animated.View>
          <Animated.View entering={ENTER(4)}>
            <CancellationPolicy />
          </Animated.View>
        </View>
      </Animated.ScrollView>

      <ClubTopBar clubId={club.id} title={pick(club.name)} scrollY={scrollY} onShare={share} />

      <BottomBar onHeight={bar.onHeight}>
        <View className="flex-row items-center justify-between gap-4">
          <View>
            <AppText variant="bodySm" tone="soft">
              {s.club.pricePerSession}
            </AppText>
            <View className="flex-row items-baseline gap-1">
              <AppText weight="mono" tone="strong" style={styles.price}>
                {price}
              </AppText>
              <AppText variant="bodySm" weight="bold" tone="volt">
                {s.common.currency}
              </AppText>
              <AppText variant="body" weight="medium" tone="soft">
                {format(s.club.perMinutes, { min: duration })}
              </AppText>
            </View>
          </View>
          <View className="flex-1">
            <PrimaryButton
              compact
              label={s.club.bookCta}
              icon="event-available"
              onPress={() => router.push({ pathname: '/book/[clubId]', params: { clubId: club.id, court: court.id } })}
            />
          </View>
        </View>
      </BottomBar>
    </View>
  );
}

function ClubNotFound() {
  const { s } = useI18n();
  return (
    <View style={styles.root}>
      <ScreenHeader title={s.club.notFound} />
      <View style={styles.body}>
        <EmptyState icon="sports-tennis" title={s.club.notFound} body={s.club.notFoundBody} action={{ label: s.common.backHome, onPress: () => router.replace('/') }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 16, paddingTop: 8, gap: 28 },
  price: { fontSize: 22, lineHeight: 28 },
});
