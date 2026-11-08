import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { AppText } from '@/components/AppText';
import { BottomBar, useBottomBarSpace } from '@/components/BottomBar';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionLabel } from '@/components/SectionTitle';
import { CLUBS } from '@/data/clubs';
import type { Duration, Extras } from '@/data/types';
import { CourtChips } from '@/features/clubs/details/ClubSections';
import { useI18n } from '@/i18n';
import { clockTime, dayLabel, nextDays, toDateKey } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import { useBookings } from '@/state/bookings';
import { colors } from '@/theme';

import { DatePicker } from './DatePicker';
import { DurationPicker } from './DurationPicker';
import { ExtrasList } from './ExtrasList';
import { bookingTotal, NO_EXTRAS } from './pricing';
import { SlotGrid } from './SlotGrid';
import { generateSlots, withOwnBookings } from './slots';

const BOOKABLE_DAYS = 14;

type Props = { clubId: string; courtId?: string };

/** Court, date, duration, time and extras, with a live total; continues to checkout. */
export function BookScreen({ clubId, courtId: initialCourt }: Props) {
  const { s, pick, lang } = useI18n();
  const { setDraft, bookings } = useBookings();
  const bar = useBottomBarSpace();
  const club = CLUBS.find((c) => c.id === clubId);

  const clock = useNow(30000);
  const now = new Date(clock);
  const today = toDateKey(now);
  const days = nextDays(today, BOOKABLE_DAYS);

  const [courtId, setCourtId] = useState(initialCourt ?? club?.courts[0]?.id ?? '');
  const [date, setDate] = useState(today);
  const [duration, setDuration] = useState<Duration>(90);
  const [start, setStart] = useState<number | null>(null);
  const [extras, setExtras] = useState<Extras>(NO_EXTRAS);

  const nowMin = date === today ? now.getHours() * 60 + now.getMinutes() : undefined;
  const slotsOn = (day: string) => {
    const own = bookings.filter((b) => b.status !== 'cancelled' && b.clubId === clubId && b.courtId === courtId && b.date === day);
    return withOwnBookings(generateSlots({ clubId, courtId, date: day, duration, nowMin: day === today ? nowMin : undefined }), duration, own);
  };
  const slots = slotsOn(date);
  // A picked time stays only while it's still free for the current court/date/duration.
  const selected = start !== null && slots.some((sl) => sl.start === start && !sl.booked) ? start : null;

  if (!club) {
    return (
      <View style={styles.root}>
        <ScreenHeader title={s.club.notFound} />
        <View style={styles.body}>
          <EmptyState icon="sports-tennis" title={s.club.notFound} body={s.club.notFoundBody} />
        </View>
      </View>
    );
  }

  const court = club.courts.find((c) => c.id === courtId) ?? club.courts[0];
  const total = bookingTotal(club, duration, extras);

  const goToCheckout = () => {
    if (selected === null) return;
    setDraft({ clubId, courtId: court.id, date, start: selected, duration, extras, total });
    router.push('/checkout');
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title={s.book.title} subtitle={`${pick(club.name)} • ${pick(court.name)}`} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: bar.paddingBottom }]}>
        <View>
          <SectionLabel>{s.book.court}</SectionLabel>
          <CourtChips courts={club.courts} selectedId={court.id} onSelect={(c) => setCourtId(c.id)} />
        </View>
        <View>
          <DatePicker days={days} today={today} value={date} onChange={setDate} freeOn={(day) => slotsOn(day).filter((sl) => !sl.booked).length} />
        </View>
        <View>
          <DurationPicker club={club} value={duration} onChange={setDuration} />
        </View>
        <View>
          <SlotGrid slots={slots} value={selected} onChange={setStart} />
        </View>
        <View>
          <ExtrasList value={extras} onChange={setExtras} />
        </View>
      </ScrollView>

      <BottomBar onHeight={bar.onHeight}>
        <View className="flex-row items-end justify-between gap-3">
          <View className="flex-1">
            <AppText variant="badge" weight="bold" tone="muted" uppercase>
              {s.book.total}
            </AppText>
            <View className="flex-row items-baseline gap-1.5">
              <AnimatedNumber value={total} weight="mono" tone="strong" style={styles.total} />
              <AppText variant="headline" weight="bold" tone="strong">
                {s.common.currency}
              </AppText>
            </View>
          </View>
          <AppText variant="bodySm" tone={selected === null ? 'muted' : 'volt'} align="end" style={styles.when}>
            {selected === null ? s.book.pickTime : `${dayLabel(date, today, lang, selected)} • ${clockTime(selected, lang)}`}
          </AppText>
        </View>
        <PrimaryButton label={s.book.continue} icon={lang === 'ar' ? 'arrow-back' : 'arrow-forward'} disabled={selected === null} onPress={goToCheckout} />
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 24 },
  total: { fontSize: 28, lineHeight: 34 },
  when: { maxWidth: '50%', marginBottom: 6 },
});
