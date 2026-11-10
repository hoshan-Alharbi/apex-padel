import { router } from 'expo-router';
import { useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { EmptyState } from '@/components/EmptyState';
import { TabScreen } from '@/components/TabScreen';
import { useI18n } from '@/i18n';
import { haptics } from '@/lib/haptics';
import { useNow } from '@/lib/useNow';
import { useBookings } from '@/state/bookings';
import { colors } from '@/theme';

import { BookingCard } from './BookingCard';
import { pastBookings, upcomingBookings } from './selectors';

type Tab = 'upcoming' | 'past';

/** "My Bookings": upcoming / past segments, newest state of every booking. */
export function BookingsScreen() {
  const { s } = useI18n();
  const { bookings } = useBookings();
  const now = useNow(15000);
  const [tab, setTab] = useState<Tab>('upcoming');
  const list = tab === 'upcoming' ? upcomingBookings(bookings, now) : pastBookings(bookings, now);

  return (
    <TabScreen title={s.bookings.title}>
      <Segments value={tab} onChange={setTab} counts={{ upcoming: upcomingBookings(bookings, now).length, past: pastBookings(bookings, now).length }} />
      <View className="gap-3">
        {list.length === 0 ? (
          tab === 'upcoming' ? (
            <EmptyState
              icon="event-available"
              title={s.bookings.emptyUpcoming}
              body={s.bookings.emptyUpcomingBody}
              action={{ label: s.bookings.explore, onPress: () => router.navigate('/') }}
            />
          ) : (
            <EmptyState icon="history" title={s.bookings.emptyPast} body={s.bookings.emptyPastBody} />
          )
        ) : (
          list.map((b, i) => (
            // Keyed by tab too, so switching segments fades the new list in quickly (no slide, no bounce).
            <Animated.View key={`${tab}-${b.id}`} entering={FadeIn.delay(30 * i).duration(180)}>
              <BookingCard booking={b} now={now} />
            </Animated.View>
          ))
        )}
      </View>
    </TabScreen>
  );
}

function Segments({ value, onChange, counts }: { value: Tab; onChange: (t: Tab) => void; counts: Record<Tab, number> }) {
  const { s, isRTL } = useI18n();
  const [width, setWidth] = useState(0);
  const tabs: Tab[] = ['upcoming', 'past'];
  const half = width / 2;
  const index = tabs.indexOf(value);
  // The indicator starts at the start edge; translateX is physical, so RTL moves it left.
  const offset = (isRTL ? -1 : 1) * index * half;
  const indicator = useAnimatedStyle(
    () => ({ transform: [{ translateX: withTiming(offset, { duration: 200, easing: Easing.out(Easing.cubic) }) }] }),
    [offset],
  );

  return (
    <View style={styles.track} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width - 8)}>
      {width > 0 && <Animated.View style={[styles.indicator, { width: half }, indicator]} />}
      {tabs.map((t) => {
        const active = t === value;
        return (
          <Pressable
            key={t}
            style={styles.segment}
            onPress={() => {
              if (!active) haptics.select();
              onChange(t);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <AppText variant="body" weight="bold" tone={active ? 'onPrimary' : 'soft'} align="center">
              {s.bookings[t]} ({counts[t]})
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 999,
    backgroundColor: colors.surface.low,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  indicator: { position: 'absolute', top: 4, bottom: 4, start: 4, borderRadius: 999, backgroundColor: colors.volt.DEFAULT },
  segment: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' },
});
