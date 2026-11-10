import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PingDot } from '@/components/effects/Dots';
import { GlowSpot } from '@/components/effects/GlowSpot';
import { PressableScale } from '@/components/PressableScale';
import type { Booking } from '@/data/types';
import { clubOf, courtOf } from '@/features/bookings/selectors';
import { useI18n } from '@/i18n';
import { clockTime, dayLabel, money, toDateKey } from '@/lib/format';
import { colors } from '@/theme';

type Props = { booking: Booking; onPress?: () => void };

/**
 * Reference "Open Match" bento, same visual recipe, showing the user's next (split) booking:
 * `rounded-2xl p-4 bg-gradient-to-br from-surface-container-high via-surface-container
 * to-surface-container-low border outline-variant/40 kinetic-volt-glow` + a blurred volt spot.
 */
export function NextBookingBanner({ booking, onPress }: Props) {
  const { s, pick, plural, format, isRTL, lang } = useI18n();
  const club = clubOf(booking);
  const court = courtOf(booking);
  if (!club || !court) return null;

  const shares = booking.split?.shares;
  const paidInitials = shares ? shares.filter((x) => x.paid).map((x) => pick(x.initials)) : [s.user.firstName.slice(0, 1)];
  const pendingShares = shares ? shares.filter((x) => !x.paid).length : 0;
  // Partners' share (the owner's may carry the remainder halalas).
  const pricePerPlayer = shares ? shares[shares.length - 1].amount : booking.total;
  const when = `${dayLabel(booking.date, toDateKey(new Date()), lang, booking.start)} • ${clockTime(booking.start, lang)}`;

  return (
    <View style={styles.shadow}>
      <View style={styles.card}>
        <LinearGradient
          colors={[colors.surface.high, colors.surface.DEFAULT, colors.surface.low]}
          start={{ x: isRTL ? 1 : 0, y: 0 }}
          end={{ x: isRTL ? 0 : 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* -right-10 -bottom-10 w-36 h-36 bg-primary-container/10 blur-2xl */}
        <GlowSpot size={144} blur={40} color={colors.volt.DEFAULT} opacity={0.1} style={styles.spot} />

        <View className="mb-2.5 flex-row items-center justify-between gap-2">
          <View className="flex-row items-center gap-2">
            <View style={styles.cyanBadge}>
              <AppText variant="badge" weight="bold" tone="cyanSoft" uppercase>
                {s.home.bannerBadge}
              </AppText>
            </View>
            <AppText variant="numeric" weight="mono" tone="volt">
              {when}
            </AppText>
          </View>
          {pendingShares > 0 && (
            <View style={styles.alertBadge}>
              <PingDot size={6} color={colors.error.DEFAULT} />
              <AppText variant="badge" weight="bold" tone="errorSoft">
                {plural(s.home.bannerAlert, pendingShares)}
              </AppText>
            </View>
          )}
        </View>

        <View className="mb-3.5">
          <AppText variant="headline" weight="bold" tone="ink">
            {pick(club.name)} • {pick(court.name)}
          </AppText>
          <View className="mt-1 flex-row items-center gap-3">
            <AppText variant="bodySm" tone="soft">
              {format(s.home.bannerDuration, { min: booking.duration })}
            </AppText>
            <AppText variant="bodySm" tone="soft">
              •
            </AppText>
            <View className="flex-row items-baseline gap-1">
              <AppText variant="numeric" weight="mono" tone="ink">
                {money(pricePerPlayer)}
              </AppText>
              <AppText variant="bodySm" weight="bold" tone="ink">
                {s.common.currency}
              </AppText>
              <AppText variant="bodySm" tone="muted">
                {shares ? s.home.perPlayer : ''}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View className="flex-row items-center">
            {paidInitials.map((initials, i) => (
              <View key={i} style={[styles.avatar, i > 0 && styles.overlap]}>
                <AppText variant="bodySm" weight="bold" tone="strong" align="center">
                  {initials}
                </AppText>
              </View>
            ))}
            {pendingShares > 0 && (
              <View style={[styles.avatar, styles.overlap, styles.pending]}>
                <AppText variant="bodySm" weight="mono" tone="volt" align="center">
                  {/* LRM marks keep "+1" from flipping to "1+" inside RTL text. */}
                  {`‎+${pendingShares}‎`}
                </AppText>
              </View>
            )}
          </View>
          <PressableScale onPress={onPress} scaleTo={0.95} className="flex-row items-center gap-1 rounded-md bg-volt px-4 py-2">
            <AppText variant="action" weight="bold" tone="onPrimary">
              {s.home.bannerCta}
            </AppText>
            <MaterialIcons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color={colors.onPrimary} />
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // The glow lives on an unclipped wrapper so `overflow: hidden` on the card can't cut it.
  shadow: { borderRadius: 16, boxShadow: '0px 0px 24px -2px rgba(202,243,0,0.35)' },
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(68,73,50,0.4)',
  },
  spot: { end: -80, bottom: -80 },
  cyanBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,227,253,0.4)',
    backgroundColor: 'rgba(0,227,253,0.2)',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.error.container,
    backgroundColor: 'rgba(147,0,10,0.4)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(68,73,50,0.3)',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.highest,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  overlap: { marginStart: -8 },
  pending: {
    borderStyle: 'dashed',
    borderColor: colors.volt.DEFAULT,
    backgroundColor: colors.surface.DEFAULT,
  },
});
