import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { DrawnCheck } from '@/components/effects/DrawnCheck';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PaymentOverlay } from '@/features/booking/PaymentOverlay';
import { useI18n } from '@/i18n';
import { dayLabel, money, timeRange, toDateKey } from '@/lib/format';
import { useBookings } from '@/state/bookings';
import { colors } from '@/theme';

import { clubOf, courtOf } from './selectors';

/** What a partner sees when they open the payment link: the invite, their share, pay. */
export function PayLinkScreen({ bookingId, shareId }: { bookingId: string; shareId: string }) {
  const { s, pick, format, lang } = useI18n();
  const { getBooking, payShare } = useBookings();
  const [paying, setPaying] = useState(false);
  const booking = getBooking(bookingId);
  const share = booking?.split?.shares.find((x) => x.id === shareId);
  const club = booking && clubOf(booking);
  const court = booking && courtOf(booking);

  if (!booking?.split || !share || !club || !court) {
    return (
      <View style={styles.root}>
        <ScreenHeader title={s.split.title} />
        <View style={styles.body}>
          <EmptyState icon="link-off" title={s.pay.expired} action={{ label: s.common.backHome, onPress: () => router.replace('/') }} />
        </View>
      </View>
    );
  }

  const owner = booking.split.shares.find((x) => x.owner)!;
  const expired = booking.status === 'cancelled';
  const when = `${dayLabel(booking.date, toDateKey(new Date()), lang, booking.start)} • ${timeRange(booking.start, booking.duration, lang)}`;

  return (
    <View style={styles.root}>
      <ScreenHeader title={s.split.title} subtitle={pick(club.name)} />
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: 48 }]}>
        <View style={styles.preview}>
          <MaterialIcons name="visibility" size={16} color={colors.cyan.DEFAULT} />
          <AppText variant="bodySm" weight="medium" tone="cyan" className="flex-1">
            {s.pay.previewNote}
          </AppText>
        </View>

        <Animated.View entering={FadeInDown.duration(450)} style={styles.card}>
          <View style={styles.photo}>
            <Image source={club.image} contentFit="cover" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(14,19,29,0)', colors.surface.DEFAULT]} style={StyleSheet.absoluteFill} />
          </View>
          <View style={styles.content}>
            <View className="flex-row items-center gap-3">
              <View style={styles.avatar}>
                <AppText variant="body" weight="bold" tone="onPrimary" align="center">
                  {pick(owner.initials)}
                </AppText>
              </View>
              <AppText variant="headline" weight="bold" tone="strong" className="flex-1">
                {format(s.pay.invite, { name: pick(owner.name) })}
              </AppText>
            </View>
            <View className="gap-1.5">
              <Fact icon="sports-tennis" text={`${pick(club.name)} • ${pick(court.name)}`} />
              <Fact icon="schedule" text={when} />
              <Fact icon="location-on" text={pick(club.address)} />
            </View>

            <View style={styles.amount}>
              <AppText variant="badge" weight="bold" tone="muted" uppercase>
                {s.pay.yourShare}
              </AppText>
              <View className="flex-row items-baseline gap-1.5">
                <AppText weight="mono" tone="volt" style={styles.big}>
                  {money(share.amount)}
                </AppText>
                <AppText variant="headline" weight="bold" tone="volt">
                  {s.common.currency}
                </AppText>
              </View>
            </View>

            {expired ? (
              <EmptyState icon="timer-off" title={s.pay.expired} body={s.pay.expiredBody} />
            ) : share.paid ? (
              <Animated.View entering={FadeIn.duration(300)} className="items-center gap-2 py-2">
                <DrawnCheck size={60} />
                <AppText variant="headline" weight="bold" tone="strong" align="center">
                  {s.pay.paidTitle}
                </AppText>
                <AppText variant="bodySm" tone="soft" align="center">
                  {s.pay.paidBody}
                </AppText>
              </Animated.View>
            ) : (
              <PrimaryButton label={format(s.pay.payNow, { amount: money(share.amount) })} icon="lock" onPress={() => setPaying(true)} />
            )}
          </View>
        </Animated.View>
      </ScrollView>

      <PaymentOverlay
        open={paying}
        method="mada"
        amount={share.amount}
        onDone={() => {
          setPaying(false);
          payShare(booking.id, share.id);
        }}
      />
    </View>
  );
}

function Fact({ icon, text }: { icon: 'sports-tennis' | 'schedule' | 'location-on'; text: string }) {
  return (
    <View className="flex-row items-start gap-2">
      <MaterialIcons name={icon} size={16} color={colors.cyan.DEFAULT} style={{ marginTop: 2 }} />
      <AppText variant="body" tone="soft" className="flex-1">
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,227,253,0.4)',
    backgroundColor: 'rgba(0,227,253,0.06)',
  },
  card: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  photo: { height: 150 },
  content: { padding: 18, gap: 18 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.volt.DEFAULT },
  amount: { alignItems: 'center', gap: 2, paddingVertical: 14, borderRadius: 14, backgroundColor: colors.recessed },
  big: { fontSize: 40, lineHeight: 50 },
});
