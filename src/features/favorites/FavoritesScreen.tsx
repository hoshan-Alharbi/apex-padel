import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { EmptyState } from '@/components/EmptyState';
import { TabScreen } from '@/components/TabScreen';
import { CLUBS } from '@/data/clubs';
import { ClubCard } from '@/features/clubs/ClubCard';
import { useI18n } from '@/i18n';
import { useFavorites } from '@/state/favorites';

/** Saved clubs (all cities), in sync with the hearts on Home and the club page. */
export function FavoritesScreen() {
  const { s, plural } = useI18n();
  const { ids } = useFavorites();
  const clubs = CLUBS.filter((c) => ids.has(c.id));

  return (
    <TabScreen title={s.favorites.title} subtitle={clubs.length > 0 ? plural(s.favorites.subtitle, clubs.length) : undefined}>
      <View className="gap-4">
        {clubs.length === 0 ? (
          <EmptyState icon="favorite-border" title={s.favorites.empty} body={s.favorites.emptyBody} action={{ label: s.bookings.explore, onPress: () => router.navigate('/') }} />
        ) : (
          clubs.map((club, i) => (
            <Animated.View key={club.id} entering={FadeIn.delay(60 * i).duration(250)} exiting={FadeOut.duration(150)}>
              <ClubCard
                club={club}
                onPress={() => router.push({ pathname: '/club/[id]', params: { id: club.id } })}
                onBook={() => router.push({ pathname: '/book/[clubId]', params: { clubId: club.id } })}
              />
            </Animated.View>
          ))
        )}
      </View>
    </TabScreen>
  );
}
