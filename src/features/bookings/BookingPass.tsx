import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import type { IconName } from '@/components/IconButton';
import type { Booking, Club, Court } from '@/data/types';
import { useI18n } from '@/i18n';
import { longDate, timeRange } from '@/lib/format';
import { colors } from '@/theme';

import { PassCode } from './PassCode';

type Props = { booking: Booking; club: Club; court: Court; void?: boolean };

/** The entry pass ("Official Apex Pass"): club, court, time, players, entry code and PIN. */
export function BookingPass({ booking, club, court, void: isVoid = false }: Props) {
  const { s, pick, plural, lang } = useI18n();
  const shares = booking.split?.shares;
  const names = shares ? shares.map((x) => pick(x.name)).join(lang === 'ar' ? '، ' : ', ') : s.user.firstName;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <AppText variant="badge" weight="bold" tone="cyan" uppercase>
              {s.pass.passLabel}
            </AppText>
            <AppText weight="bold" tone="strong" style={styles.club} numberOfLines={2}>
              {pick(club.name)}
            </AppText>
          </View>
          {club.features.includes('ac') && (
            <View style={styles.climate}>
              <MaterialIcons name="ac-unit" size={14} color={colors.cyan.DEFAULT} />
              <AppText variant="badge" weight="bold" tone="cyan">
                {s.filters.ac}
              </AppText>
            </View>
          )}
        </View>
        <View className="mt-1.5 flex-row items-center gap-1.5">
          <MaterialIcons name="sports-tennis" size={16} color={colors.volt.DEFAULT} />
          <AppText variant="bodyLg" weight="medium" tone="ink">
            {pick(court.name)} ({s.filters[court.feature]})
          </AppText>
        </View>
      </View>

      <View style={styles.facts}>
        <View className="flex-1 gap-1">
          <AppText variant="badge" weight="bold" tone="muted" uppercase>
            {s.pass.dateTime}
          </AppText>
          <AppText variant="body" weight="bold" tone="strong">
            {longDate(booking.date, lang)}
          </AppText>
          <AppText variant="numeric" weight="mono" tone="volt">
            {timeRange(booking.start, booking.duration, lang)}
          </AppText>
        </View>
        <View className="flex-1 gap-1">
          <AppText variant="badge" weight="bold" tone="muted" uppercase>
            {s.pass.players}
          </AppText>
          <AppText variant="body" weight="bold" tone="strong">
            {shares ? plural(s.pass.playersValue, shares.length) : s.pass.privateBooking}
          </AppText>
          <AppText variant="bodySm" tone="soft" numberOfLines={2}>
            {names}
          </AppText>
        </View>
      </View>

      <Perforation />

      <View style={styles.codeArea}>
        <PassCode seed={booking.code} dimmed={isVoid} />
        <AppText variant="bodySm" tone="soft" align="center" className="mt-6">
          {s.pass.pinLabel}
        </AppText>
        <View style={styles.pin}>
          <MaterialIcons name="vpn-key" size={16} color={colors.cyan.DEFAULT} />
          <AppText weight="mono" tone="strong" style={styles.pinText}>
            {booking.code}
          </AppText>
        </View>
      </View>

      <View style={styles.footer}>
        {club.facilities.slice(0, 2).map((f) => (
          <View key={f.label.en} className="flex-row items-center gap-1.5">
            <MaterialIcons name={f.icon as IconName} size={16} color={colors.cyan.DEFAULT} />
            <AppText variant="bodySm" tone="soft">
              {pick(f.label)}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const DASHES = 40;

/** Dashed tear line with half-circle notches cut into both edges. Dashes are views: Android ignores one-sided dashed borders. */
function Perforation() {
  return (
    <View style={styles.perf}>
      <View style={[styles.notch, styles.notchStart]} />
      <View style={styles.dashes}>
        {Array.from({ length: DASHES }, (_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>
      <View style={[styles.notch, styles.notchEnd]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  top: { padding: 18, backgroundColor: colors.surface.high },
  club: { fontSize: 22, lineHeight: 30, marginTop: 2 },
  climate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: 'rgba(0,227,253,0.3)',
  },
  facts: { flexDirection: 'row', gap: 16, padding: 18 },
  perf: { height: 20, flexDirection: 'row', alignItems: 'center' },
  dashes: { flex: 1, flexDirection: 'row', gap: 5, overflow: 'hidden', marginHorizontal: 6 },
  dash: { width: 8, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.14)' },
  notch: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.bg },
  notchStart: { marginStart: -10 },
  notchEnd: { marginEnd: -10 },
  codeArea: { paddingTop: 12, paddingBottom: 18, alignItems: 'center' },
  pin: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pinText: { fontSize: 20, lineHeight: 26, letterSpacing: 3 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: colors.surface.low,
  },
});
