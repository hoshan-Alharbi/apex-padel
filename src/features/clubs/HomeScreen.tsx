import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBlurTarget, useGlassTarget } from '@/components/effects/Glass';
import { useTabBarSpace } from '@/components/navigation/TabBar';
import { PressableScale } from '@/components/PressableScale';
import { CLUBS } from '@/data/clubs';
import type { CityId } from '@/data/types';
import { upcomingBookings } from '@/features/bookings/selectors';
import { useI18n } from '@/i18n';
import { useNow } from '@/lib/useNow';
import { useBookings } from '@/state/bookings';
import { colors } from '@/theme';

import { CitySheet } from './CitySheet';
import { ClubCard } from './ClubCard';
import { ClubCardSkeleton } from './ClubCardSkeleton';
import { type ClubFilter, filterClubs } from './filter';
import { FilterChips } from './FilterChips';
import { HEADER_HEIGHT, HomeHeader } from './HomeHeader';
import { HomeIntro } from './HomeIntro';
import { NextBookingBanner } from './NextBookingBanner';
import { SearchField } from './SearchField';

/** Simulated fetch time when the city changes (UI-only phase, no API). */
const FAKE_LOAD_MS = 650;
const ENTER = (i: number) => FadeInDown.delay(70 * i).duration(450);

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpace = useTabBarSpace();
  const screenTarget = useGlassTarget();
  const { bookings } = useBookings();
  const now = useNow(60000);
  const nextBooking = upcomingBookings(bookings, now)[0];

  const [city, setCity] = useState<CityId>('riyadh');
  const [filter, setFilter] = useState<ClubFilter>('all');
  const [query, setQuery] = useState('');
  const [cityOpen, setCityOpen] = useState(false);

  // A city counts as loading until its fake fetch completes.
  const [loadedCity, setLoadedCity] = useState<CityId | null>(null);
  const loading = loadedCity !== city;
  useEffect(() => {
    const id = setTimeout(() => setLoadedCity(city), FAKE_LOAD_MS);
    return () => clearTimeout(id);
  }, [city]);

  const clubs = useMemo(() => filterClubs(CLUBS, { city, filter, query }), [city, filter, query]);
  const clearFilters = () => {
    setFilter('all');
    setQuery('');
  };

  return (
    <View style={styles.root}>
      <ScreenBlurTarget targetRef={screenTarget} style={styles.root}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: insets.top + HEADER_HEIGHT + 16, paddingBottom: bottomSpace, paddingHorizontal: 16, gap: 20 }}
        >
          <Animated.View entering={ENTER(0)}>
            <HomeIntro />
          </Animated.View>
          <Animated.View entering={ENTER(1)}>
            <SearchField value={query} onChange={setQuery} />
          </Animated.View>
          {/* Negative margins: the chip rail's padding gives the active glow room without adding gap. */}
          <Animated.View entering={ENTER(2)} style={{ marginVertical: -10 }}>
            <FilterChips value={filter} onChange={setFilter} />
          </Animated.View>
          {nextBooking && (
            <Animated.View entering={ENTER(3)}>
              <NextBookingBanner booking={nextBooking} onPress={() => router.push({ pathname: '/booking/[id]', params: { id: nextBooking.id } })} />
            </Animated.View>
          )}

          <View style={{ gap: 14 }}>
            <Animated.View entering={ENTER(4)}>
              <SectionHeader city={city} count={loading ? null : clubs.length} />
            </Animated.View>
            <View style={{ gap: 16 }}>
              {loading ? (
                <>
                  <ClubCardSkeleton />
                  <ClubCardSkeleton />
                </>
              ) : clubs.length === 0 ? (
                <EmptyClubs onClear={clearFilters} />
              ) : (
                clubs.map((club, i) => (
                  <Animated.View
                    key={club.id}
                    entering={FadeInDown.delay(90 * i).duration(450)}
                    exiting={FadeOut.duration(180)}
                    layout={LinearTransition.duration(220)}
                  >
                    <ClubCard
                      club={club}
                      onPress={() => router.push({ pathname: '/club/[id]', params: { id: club.id } })}
                      onBook={() => router.push({ pathname: '/book/[clubId]', params: { clubId: club.id } })}
                    />
                  </Animated.View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </ScreenBlurTarget>

      <HomeHeader city={city} onCityPress={() => setCityOpen(true)} blurTarget={screenTarget} />

      <CitySheet
        open={cityOpen}
        city={city}
        onClose={() => setCityOpen(false)}
        onSelect={(next) => {
          setCityOpen(false);
          if (next !== city) {
            setCity(next);
            clearFilters();
          }
        }}
      />
    </View>
  );
}

function SectionHeader({ city, count }: { city: CityId; count: number | null }) {
  const { s, format, plural, isRTL } = useI18n();
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <AppText variant="headline" weight="bold" tone="ink">
          {s.home.sectionTitle}
        </AppText>
        <AppText variant="bodySm" tone="muted">
          {count === null ? format(s.home.sectionSubtitle, { city: s.cities[city] }) : `${format(s.home.sectionSubtitle, { city: s.cities[city] })} · ${plural(s.home.clubCount, count)}`}
        </AppText>
      </View>
      <PressableScale scaleTo={0.95} className="flex-row items-center gap-0.5">
        <AppText variant="bodySm" weight="bold" tone="volt">
          {s.home.viewAll}
        </AppText>
        <MaterialIcons name={isRTL ? 'chevron-left' : 'chevron-right'} size={16} color={colors.volt.DEFAULT} />
      </PressableScale>
    </View>
  );
}

function EmptyClubs({ onClear }: { onClear: () => void }) {
  const { s } = useI18n();
  return <EmptyState icon="search-off" title={s.home.emptyTitle} body={s.home.emptyBody} action={{ label: s.home.clearFilters, onPress: onClear }} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
