import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/AnimatedNumber';
import { AppText } from '@/components/AppText';
import { BottomBar, useBottomBarSpace } from '@/components/BottomBar';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionLabel } from '@/components/SectionTitle';
import { CLUBS } from '@/data/clubs';
import type { PaymentMethod } from '@/data/types';
import { useI18n } from '@/i18n';
import { dayLabel, money, timeRange, toDateKey } from '@/lib/format';
import { useBookings } from '@/state/bookings';
import { colors } from '@/theme';

import { PaymentOverlay } from './PaymentOverlay';
import { PaymentMethods } from './PaymentMethods';
import { PriceBreakdown } from './PriceBreakdown';
import { splitAmounts } from './split';
import { SplitControl } from './SplitControl';

const ENTER = (i: number) => FadeInDown.delay(60 * i).duration(400);

/** Review the draft, choose how to pay (optionally split), then pay or request. */
export function CheckoutScreen() {
  const { s, pick, format, lang } = useI18n();
  const { draft, checkout } = useBookings();
  const [method, setMethod] = useState<PaymentMethod>('mada');
  const [split, setSplit] = useState(false);
  const [players, setPlayers] = useState(4);
  const [paying, setPaying] = useState(false);
  const bar = useBottomBarSpace();

  const club = draft && CLUBS.find((c) => c.id === draft.clubId);
  const court = club?.courts.find((c) => c.id === draft?.courtId);
  if (!draft || !club || !court) {
    return (
      <View style={styles.root}>
        <ScreenHeader title={s.checkout.title} />
        <View style={styles.body}>
          <EmptyState icon="receipt-long" title={s.checkout.missing} action={{ label: s.common.backHome, onPress: () => router.replace('/') }} />
        </View>
      </View>
    );
  }

  const splitting = split && method !== 'venue';
  const dueNow = splitting ? splitAmounts(draft.total, players)[0] : draft.total;

  const finish = () => {
    const booking = checkout(draft, method, splitting ? players : 1);
    setPaying(false);
    router.dismissAll();
    router.push({ pathname: '/booking/[id]', params: { id: booking.id, fresh: '1' } });
  };

  const choose = (m: PaymentMethod) => {
    setMethod(m);
    if (m === 'venue') setSplit(false);
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title={s.checkout.title} subtitle={pick(club.name)} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: bar.paddingBottom }]}>
        <Animated.View entering={ENTER(0)}>
          <SectionLabel>{s.checkout.summary}</SectionLabel>
          <View style={[styles.card, styles.summary]}>
            <Image source={club.image} contentFit="cover" style={styles.thumb} />
            <View className="flex-1 gap-0.5">
              <AppText variant="bodyLg" weight="bold" tone="strong" numberOfLines={1}>
                {pick(club.name)}
              </AppText>
              <AppText variant="bodySm" tone="soft">
                {pick(court.name)} • {format(s.common.minutes, { min: draft.duration })}
              </AppText>
              <View className="mt-1 flex-row items-center gap-1.5">
                <MaterialIcons name="schedule" size={14} color={colors.volt.DEFAULT} />
                <AppText variant="bodySm" weight="bold" tone="volt">
                  {dayLabel(draft.date, toDateKey(new Date()), lang, draft.start)} • {timeRange(draft.start, draft.duration, lang)}
                </AppText>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={ENTER(1)}>
          <SectionLabel>{s.checkout.method}</SectionLabel>
          <PaymentMethods value={method} onChange={choose} />
        </Animated.View>

        <Animated.View entering={ENTER(2)}>
          <SplitControl total={draft.total} enabled={splitting} players={players} onToggle={setSplit} onPlayers={setPlayers} blocked={method === 'venue'} />
        </Animated.View>

        <Animated.View entering={ENTER(3)}>
          <SectionLabel>{s.checkout.breakdown}</SectionLabel>
          <View style={styles.card}>
            <PriceBreakdown club={club} duration={draft.duration} extras={draft.extras} total={draft.total} />
          </View>
          <View className="mt-3 flex-row items-center justify-center gap-1.5">
            <MaterialIcons name="lock" size={14} color={colors.ink.muted} />
            <AppText variant="bodySm" tone="muted">
              {s.checkout.secure}
            </AppText>
          </View>
        </Animated.View>
      </ScrollView>

      <BottomBar onHeight={bar.onHeight}>
        {splitting && (
          <View className="flex-row items-center justify-between">
            <AppText variant="bodySm" tone="soft">
              {s.checkout.yourShare}
            </AppText>
            <View className="flex-row items-baseline gap-1">
              <AnimatedNumber value={dueNow} weight="mono" tone="volt" variant="numeric" />
              <AppText variant="bodySm" weight="bold" tone="volt">
                {s.common.currency}
              </AppText>
            </View>
          </View>
        )}
        <PrimaryButton
          label={method === 'venue' ? s.checkout.request : format(s.checkout.pay, { amount: money(dueNow) })}
          icon={method === 'venue' ? 'send' : 'lock'}
          onPress={() => (method === 'venue' ? finish() : setPaying(true))}
        />
      </BottomBar>

      <PaymentOverlay open={paying} method={method} amount={dueNow} onDone={finish} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 24 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  thumb: { width: 72, height: 72, borderRadius: 12 },
});
