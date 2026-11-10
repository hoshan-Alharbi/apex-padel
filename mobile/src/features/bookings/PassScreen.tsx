import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Linking, ScrollView, Share, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PulseDot } from '@/components/effects/Dots';
import { DrawnCheck } from '@/components/effects/DrawnCheck';
import { EmptyState } from '@/components/EmptyState';
import { IconButton, type IconName } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PressableScale } from '@/components/PressableScale';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionLabel } from '@/components/SectionTitle';
import type { Booking } from '@/data/types';
import { MethodMark } from '@/features/booking/PaymentMethods';
import { PriceBreakdown } from '@/features/booking/PriceBreakdown';
import { paidAmount } from '@/features/booking/split';
import { useI18n } from '@/i18n';
import { dayLabel, money, timeRange, toDateKey } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import { useBookings } from '@/state/bookings';
import { colors } from '@/theme';

import { BookingPass } from './BookingPass';
import { clubOf, courtOf, type DisplayStatus, displayStatus } from './selectors';
import { StatusBadge } from './StatusBadge';

const ENTER = (i: number) => FadeInDown.delay(80 * i).duration(450);

/** Leave the result: back to the Bookings tab with the stack cleared. */
const toBookings = () => {
  router.dismissAll();
  router.navigate('/bookings');
};

/** Booking details and post-payment result: status, pass, quick actions, payment and roster. */
export function PassScreen({ bookingId, fresh }: { bookingId: string; fresh: boolean }) {
  const { s, pick, format, lang } = useI18n();
  const { getBooking } = useBookings();
  const now = useNow(5000);
  const booking = getBooking(bookingId);
  const club = booking && clubOf(booking);
  const court = booking && courtOf(booking);

  if (!booking || !club || !court) {
    return (
      <View style={styles.root}>
        <ScreenHeader title={s.pass.notFound} />
        <View style={styles.body}>
          <EmptyState icon="confirmation-number" title={s.pass.notFound} action={{ label: s.common.backHome, onPress: () => router.replace('/') }} />
        </View>
      </View>
    );
  }

  const status = displayStatus(booking, now);
  const when = `${dayLabel(booking.date, toDateKey(new Date(now)), lang, booking.start)} • ${timeRange(booking.start, booking.duration, lang)}`;
  const share = () =>
    Share.share({ message: format(s.pass.shareMessage, { club: pick(club.name), court: pick(court.name), when, code: booking.code }) }).catch(() => {});
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${club.name.en}, ${club.address.en}`)}`;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={s.pass.passLabel}
        subtitle={`${pick(club.name)} • ${s.cities[club.city]}`}
        end={<IconButton icon="share" onPress={share} accessibilityLabel={s.common.share} />}
        onBack={fresh ? toBookings : undefined}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: 48 }]}>
        <Animated.View entering={ENTER(0)}>
          <StatusCard status={status} animate={fresh} />
        </Animated.View>

        <Animated.View entering={ENTER(1)}>
          <BookingPass booking={booking} club={club} court={court} void={status === 'cancelled' || status === 'refunded'} />
        </Animated.View>

        <Animated.View entering={ENTER(2)}>
          <SectionLabel>{s.pass.actions}</SectionLabel>
          <View className="gap-2.5">
            {booking.split && (
              <ActionRow
                icon="call-split"
                title={s.pass.manageSplit}
                sub={format(s.split.progress, { paid: money(paidAmount(booking.split.shares)), total: money(booking.total) })}
                highlight={booking.status === 'awaitingPartners'}
                onPress={() => router.push({ pathname: '/split/[id]', params: { id: booking.id } })}
              />
            )}
            <ActionRow icon="forum" title={s.pass.shareSquad} sub={s.pass.shareSquadSub} onPress={share} />
            <ActionRow icon="near-me" title={s.pass.directions} sub={s.pass.directionsSub} onPress={() => Linking.openURL(mapsUrl)} />
          </View>
        </Animated.View>

        <Animated.View entering={ENTER(3)}>
          <PaymentCard booking={booking} status={status} />
        </Animated.View>

        {fresh && (
          <Animated.View entering={ENTER(4)}>
            <PrimaryButton label={s.pass.done} onPress={toBookings} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const STATUS_COPY = {
  confirmed: ['confirmedTitle', 'confirmedBody'],
  pending: ['pendingTitle', 'pendingBody'],
  awaitingPartners: ['awaitingTitle', 'awaitingBody'],
  cancelled: ['cancelledTitle', 'cancelledBody'],
  refunded: ['cancelledTitle', 'cancelledRefund'],
  completed: ['completedTitle', 'completedBody'],
} as const;

function StatusCard({ status, animate }: { status: DisplayStatus; animate: boolean }) {
  const { s } = useI18n();
  const [title, body] = STATUS_COPY[status];
  const icon: Record<DisplayStatus, ReactNode> = {
    confirmed: animate ? <DrawnCheck size={52} /> : <Circle icon="check-circle" color={colors.volt.DEFAULT} />,
    completed: <Circle icon="sports-tennis" color={colors.ink.soft} />,
    pending: (
      <View style={styles.pending}>
        <PulseDot size={18} color={colors.cyan.DEFAULT} />
      </View>
    ),
    awaitingPartners: <Circle icon="hourglass-top" color={colors.error.DEFAULT} />,
    cancelled: <Circle icon="cancel" color={colors.ink.muted} />,
    refunded: <Circle icon="currency-exchange" color={colors.ink.soft} />,
  };

  return (
    <View style={[styles.card, styles.statusCard, status === 'confirmed' && styles.statusOk]}>
      {icon[status]}
      <View className="flex-1 gap-0.5">
        <AppText variant="headline" weight="bold" tone="strong">
          {s.pass[title]}
        </AppText>
        <AppText variant="bodySm" tone="soft">
          {s.pass[body]}
        </AppText>
      </View>
      <StatusBadge status={status} />
    </View>
  );
}

function Circle({ icon, color }: { icon: IconName; color: string }) {
  return (
    <View style={[styles.circle, { borderColor: color }]}>
      <MaterialIcons name={icon} size={26} color={color} />
    </View>
  );
}

function ActionRow({ icon, title, sub, onPress, highlight = false }: { icon: IconName; title: string; sub: string; onPress: () => void; highlight?: boolean }) {
  const { isRTL } = useI18n();
  return (
    <PressableScale onPress={onPress} style={[styles.card, styles.action, highlight && styles.actionHot]}>
      <View style={styles.actionIcon}>
        <MaterialIcons name={icon} size={20} color={highlight ? colors.volt.DEFAULT : colors.cyan.DEFAULT} />
      </View>
      <View className="flex-1">
        <AppText variant="bodyLg" weight="bold" tone="strong">
          {title}
        </AppText>
        <AppText variant="bodySm" tone="soft">
          {sub}
        </AppText>
      </View>
      <MaterialIcons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color={colors.ink.muted} />
    </PressableScale>
  );
}

function PaymentCard({ booking, status }: { booking: Booking; status: DisplayStatus }) {
  const { s } = useI18n();
  const club = clubOf(booking)!;
  const paid = booking.split ? paidAmount(booking.split.shares) : booking.method === 'venue' ? 0 : booking.total;
  const badge =
    status === 'refunded' ? s.pass.refunded : booking.method === 'venue' ? s.pass.payAtVenue : paid < booking.total ? s.pass.partlyPaid : s.pass.paidFull;

  return (
    <View style={styles.card}>
      <View className="mb-3 flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="receipt-long" size={22} color={colors.volt.DEFAULT} />
          <AppText variant="headline" weight="bold" tone="strong">
            {s.pass.payment}
          </AppText>
        </View>
        <View style={styles.payBadge}>
          <AppText variant="badge" weight="bold" tone="volt">
            {badge}
          </AppText>
        </View>
      </View>
      <PriceBreakdown
        club={club}
        duration={booking.duration}
        extras={booking.extras}
        total={booking.total}
        // Partly paid splits show the booking total; the badge says it isn't all paid yet.
        totalLabel={booking.method === 'venue' ? s.pass.totalDue : paid < booking.total ? s.checkout.total : s.pass.totalPaid}
        footer={
          <View style={styles.methodChip}>
            <MethodMark method={booking.method} />
            <AppText variant="bodySm" tone="soft">
              {booking.method === 'venue' ? s.checkout.methods.venue : s.checkout.methodSubs[booking.method]}
            </AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 20 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusOk: { borderColor: 'rgba(202,243,0,0.3)' },
  circle: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  pending: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,227,253,0.12)' },
  action: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionHot: { borderColor: 'rgba(202,243,0,0.4)' },
  actionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.high },
  payBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(202,243,0,0.5)', backgroundColor: 'rgba(202,243,0,0.1)' },
  methodChip: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
});
