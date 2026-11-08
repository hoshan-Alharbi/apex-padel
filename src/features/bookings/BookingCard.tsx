import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import type { Booking } from '@/data/types';
import { useI18n } from '@/i18n';
import { dayLabel, money, timeRange, toDateKey } from '@/lib/format';
import { colors } from '@/theme';

import { clubOf, courtOf, displayStatus } from './selectors';
import { StatusBadge } from './StatusBadge';

/** Row in "My Bookings": photo, club/court, time, status and amount. Opens the pass. */
export function BookingCard({ booking, now }: { booking: Booking; now: number }) {
  const { s, pick, plural, lang } = useI18n();
  const club = clubOf(booking);
  const court = courtOf(booking);
  if (!club || !court) return null;

  const status = displayStatus(booking, now);
  const faded = status === 'completed' || status === 'cancelled' || status === 'refunded';
  const waiting = booking.split?.shares.filter((x) => !x.paid).length ?? 0;

  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: booking.id } })}
      scaleTo={0.98}
      style={[styles.card, status === 'awaitingPartners' && styles.hot]}
    >
      <View className="flex-row gap-3">
        <Image source={club.image} contentFit="cover" style={[styles.thumb, faded && styles.faded]} />
        <View className="flex-1 gap-1">
          <View className="flex-row items-start justify-between gap-2">
            <AppText variant="bodyLg" weight="bold" tone="strong" className="flex-1" numberOfLines={1}>
              {pick(club.name)}
            </AppText>
            <StatusBadge status={status} />
          </View>
          <AppText variant="bodySm" tone="soft">
            {pick(court.name)} • {booking.code}
          </AppText>
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons name="schedule" size={14} color={faded ? colors.ink.muted : colors.volt.DEFAULT} />
            <AppText variant="bodySm" weight="bold" tone={faded ? 'muted' : 'volt'} numberOfLines={1}>
              {dayLabel(booking.date, toDateKey(new Date(now)), lang, booking.start)} • {timeRange(booking.start, booking.duration, lang)}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <AppText variant="bodySm" tone={waiting > 0 && status === 'awaitingPartners' ? 'errorSoft' : 'muted'}>
          {waiting > 0 && status === 'awaitingPartners' ? plural(s.bookings.sharesLeft, waiting) : s.checkout.methods[booking.method]}
        </AppText>
        <AppText variant="numeric" weight="mono" tone="ink">
          {money(booking.total)} {s.common.currency}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  hot: { borderColor: 'rgba(202,243,0,0.35)' },
  thumb: { width: 76, height: 76, borderRadius: 12 },
  faded: { opacity: 0.55 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
});
