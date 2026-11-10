import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PingDot } from '@/components/effects/Dots';
import { DrawnCheck } from '@/components/effects/DrawnCheck';
import { BottomBar, useBottomBarSpace } from '@/components/BottomBar';
import { EmptyState } from '@/components/EmptyState';
import { PressableScale } from '@/components/PressableScale';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import type { Booking, SplitShare } from '@/data/types';
import { PaymentOverlay } from '@/features/booking/PaymentOverlay';
import { paidAmount } from '@/features/booking/split';
import { useI18n } from '@/i18n';
import { dayLabel, money, timeRange, toDateKey } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import { useBookings } from '@/state/bookings';
import { colors } from '@/theme';

import { clubOf } from './selectors';

const pad = (n: number) => String(n).padStart(2, '0');
/** Link a partner receives (the app's scheme; opens the pay page). */
export const payLink = (b: Booking, share: SplitShare) => `apexpadel://pay/${b.id}/${share.id}`;

/** Split tracker: countdown, who paid, send links, or pay the rest. */
export function SplitScreen({ bookingId }: { bookingId: string }) {
  const { s, pick, format, lang } = useI18n();
  const { getBooking, payRemaining } = useBookings();
  const now = useNow(1000);
  const [paying, setPaying] = useState(false);
  const bar = useBottomBarSpace();
  const booking = getBooking(bookingId);
  const club = booking && clubOf(booking);

  if (!booking?.split || !club) {
    return (
      <View style={styles.root}>
        <ScreenHeader title={s.split.title} />
        <View style={styles.body}>
          <EmptyState icon="call-split" title={s.pass.notFound} />
        </View>
      </View>
    );
  }

  const { shares } = booking.split;
  const paid = paidAmount(shares);
  const unpaid = Math.round((booking.total - paid) * 100) / 100;
  const live = booking.status === 'awaitingPartners';
  const when = `${dayLabel(booking.date, toDateKey(new Date(now)), lang, booking.start)} • ${timeRange(booking.start, booking.duration, lang)}`;

  const sendLink = (share: SplitShare) =>
    Share.share({
      message: format(s.split.linkMessage, { name: pick(share.name), amount: money(share.amount), club: pick(club.name), when, url: payLink(booking, share) }),
    }).catch(() => {});

  return (
    <View style={styles.root}>
      <ScreenHeader title={s.split.title} subtitle={`${pick(club.name)} • ${when}`} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: live ? bar.paddingBottom : 40 }]}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Countdown booking={booking} now={now} paid={paid} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)} className="gap-2.5">
          {shares.map((share) => (
            <View key={share.id}>
              <ShareRow
                share={share}
                live={live}
                onSend={() => sendLink(share)}
                onPreview={() => router.push({ pathname: '/pay/[bookingId]/[shareId]', params: { bookingId: booking.id, shareId: share.id } })}
              />
            </View>
          ))}
        </Animated.View>

        {live && (
          <View className="flex-row items-start gap-2 px-1">
            <MaterialIcons name="info-outline" size={16} color={colors.ink.muted} style={{ marginTop: 2 }} />
            <AppText variant="bodySm" tone="muted" className="flex-1">
              {s.split.rule}
            </AppText>
          </View>
        )}
      </ScrollView>

      {live && (
        <BottomBar onHeight={bar.onHeight}>
          <PrimaryButton label={format(s.split.payRest, { amount: money(unpaid) })} icon="lock" onPress={() => setPaying(true)} />
        </BottomBar>
      )}
      <PaymentOverlay
        open={paying}
        method={booking.method}
        amount={unpaid}
        onDone={() => {
          setPaying(false);
          payRemaining(booking.id);
        }}
      />
    </View>
  );
}

function Countdown({ booking, now, paid }: { booking: Booking; now: number; paid: number }) {
  const { s, format } = useI18n();
  const deadline = booking.split!.deadline;
  const left = Math.max(0, deadline - now);
  const mm = Math.floor(left / 60000);
  const ss = Math.floor((left % 60000) / 1000);
  const ratio = booking.total > 0 ? paid / booking.total : 0;

  const fill = useSharedValue(ratio);
  useEffect(() => {
    fill.set(withSpring(ratio, { damping: 18, stiffness: 120 }));
  }, [ratio, fill]);
  const barStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  if (booking.status === 'confirmed') {
    return (
      <View style={[styles.card, styles.center, styles.ok]}>
        <DrawnCheck size={56} />
        <AppText variant="headline" weight="bold" tone="strong" align="center">
          {s.split.complete}
        </AppText>
      </View>
    );
  }
  if (booking.status === 'cancelled') {
    return (
      <View style={[styles.card, styles.center]}>
        <MaterialIcons name="currency-exchange" size={40} color={colors.ink.soft} />
        <AppText variant="headline" weight="bold" tone="strong" align="center">
          {s.split.expired}
        </AppText>
        <AppText variant="bodySm" tone="soft" align="center">
          {booking.refunded ? s.pass.cancelledRefund : s.pass.cancelledBody}
        </AppText>
      </View>
    );
  }

  const urgent = left < 5 * 60000;
  return (
    <View style={[styles.card, styles.center]}>
      <AppText variant="badge" weight="bold" tone="muted" uppercase>
        {s.split.timeLeft}
      </AppText>
      <AppText weight="mono" style={[styles.clock, { color: urgent ? colors.crimson.DEFAULT : colors.ink.strong }]}>
        {pad(mm)}:{pad(ss)}
      </AppText>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
      <AppText variant="numeric" weight="mono" tone="volt">
        {format(s.split.progress, { paid: money(paid), total: money(booking.total) })}
      </AppText>
    </View>
  );
}

function ShareRow({ share, live, onSend, onPreview }: { share: SplitShare; live: boolean; onSend: () => void; onPreview: () => void }) {
  const { s, pick } = useI18n();
  return (
    <View style={[styles.card, share.paid && styles.paidRow]}>
      <View className="flex-row items-center gap-3">
        <View style={[styles.avatar, share.paid ? styles.avatarPaid : styles.avatarWaiting]}>
          <AppText variant="body" weight="bold" tone={share.paid ? 'onPrimary' : 'volt'} align="center">
            {pick(share.initials)}
          </AppText>
        </View>
        <View className="flex-1">
          <AppText variant="bodyLg" weight="bold" tone="strong">
            {share.owner ? `${pick(share.name)} (${s.split.you})` : pick(share.name)}
          </AppText>
          <AppText variant="numeric" weight="mono" tone="soft">
            {money(share.amount)} {s.common.currency}
          </AppText>
        </View>
        {share.paid ? (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="check-circle" size={18} color={colors.volt.DEFAULT} />
            <AppText variant="bodySm" weight="bold" tone="volt">
              {share.coveredByOwner ? s.split.covered : s.split.paid}
            </AppText>
          </View>
        ) : (
          <View className="flex-row items-center gap-1.5">
            <PingDot size={6} color={colors.error.DEFAULT} />
            <AppText variant="bodySm" weight="bold" tone="errorSoft">
              {s.split.waiting}
            </AppText>
          </View>
        )}
      </View>
      {!share.paid && live && (
        <View style={styles.rowActions}>
          <PressableScale onPress={onSend} className="flex-row items-center gap-1.5 rounded-sm bg-volt px-3 py-2">
            <MaterialIcons name="send" size={16} color={colors.onPrimary} />
            <AppText variant="bodySm" weight="bold" tone="onPrimary">
              {s.split.sendLink}
            </AppText>
          </PressableScale>
          <PressableScale onPress={onPreview} className="flex-row items-center gap-1.5 rounded-sm border border-line/40 px-3 py-2">
            <MaterialIcons name="visibility" size={16} color={colors.ink.soft} />
            <AppText variant="bodySm" weight="bold" tone="soft">
              {s.split.previewLink}
            </AppText>
          </PressableScale>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  center: { alignItems: 'center', gap: 10, paddingVertical: 22 },
  ok: { borderColor: 'rgba(202,243,0,0.35)' },
  clock: { fontSize: 48, lineHeight: 58, letterSpacing: 2 },
  track: { alignSelf: 'stretch', height: 8, borderRadius: 4, backgroundColor: colors.surface.highest, overflow: 'hidden', alignItems: 'flex-start' },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.volt.DEFAULT },
  paidRow: { borderColor: 'rgba(202,243,0,0.25)' },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarPaid: { backgroundColor: colors.volt.DEFAULT },
  avatarWaiting: { backgroundColor: colors.surface.high, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.volt.DEFAULT },
  rowActions: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
});
