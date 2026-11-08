import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { GlowSpot } from '@/components/effects/GlowSpot';
import type { IconName } from '@/components/IconButton';
import { SectionLabel } from '@/components/SectionTitle';
import { TabScreen } from '@/components/TabScreen';
import { Toggle } from '@/components/Toggle';
import { displayStatus } from '@/features/bookings/selectors';
import { LogoMark } from '@/features/splash/LogoMark';
import { useI18n } from '@/i18n';
import { haptics } from '@/lib/haptics';
import { useNow } from '@/lib/useNow';
import { useBookings } from '@/state/bookings';
import { useFavorites } from '@/state/favorites';
import { colors } from '@/theme';

import { DemoSheet } from './DemoSheet';

const PLAYER_LEVEL = '3.5';
/** Matches played before the bookings this demo knows about. */
const HISTORY_MATCHES = 24;

/** Mock profile, stats and cosmetic settings. Long-press the logo for demo mode. */
export function AccountScreen() {
  const { s, format } = useI18n();
  const { bookings } = useBookings();
  const { ids } = useFavorites();
  const [notify, setNotify] = useState(true);
  const [demo, setDemo] = useState(false);

  const now = useNow(60000);
  const played = bookings.filter((b) => displayStatus(b, now) === 'completed');
  const matches = HISTORY_MATCHES + played.length;
  const hours = Math.round((HISTORY_MATCHES * 90 + played.reduce((m, b) => m + b.duration, 0)) / 60);

  return (
    <TabScreen title={s.account.title}>
      <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.profile}>
        <GlowSpot size={160} blur={40} color={colors.volt.DEFAULT} opacity={0.12} style={styles.spot} />
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <AppText weight="bold" tone="volt" style={styles.initial}>
              {s.user.firstName.slice(0, 1)}
            </AppText>
          </View>
        </View>
        <View className="flex-1 gap-0.5">
          <AppText variant="headline" weight="bold" tone="strong">
            {s.user.fullName}
          </AppText>
          <AppText variant="numeric" weight="mono" tone="soft">
            {/* LTR isolate: keeps "+966 …" in order inside Arabic text. */}
            {`⁦${s.user.phone}⁩`}
          </AppText>
          <AppText variant="bodySm" tone="volt">
            {format(s.account.member, { level: PLAYER_LEVEL })}
          </AppText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(400)} className="flex-row gap-2.5">
        <Stat value={matches} label={s.account.stats.matches} />
        <Stat value={hours} label={s.account.stats.hours} />
        <Stat value={ids.size} label={s.account.stats.favorites} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).duration(400)}>
        <SectionLabel>{s.account.settings}</SectionLabel>
        <View style={styles.list}>
          <Row icon="language" title={s.account.language} hint={s.account.languageHint} value={s.account.languageValue} />
          <Row icon="notifications-none" title={s.account.notifications} end={<Toggle value={notify} onChange={setNotify} accessibilityLabel={s.account.notifications} />} />
          <Row icon="credit-card" title={s.account.paymentMethods} value={s.account.paymentMethodsValue} />
          <Row icon="support-agent" title={s.account.help} />
          <Row icon="policy" title={s.account.terms} last />
        </View>
      </Animated.View>

      <Pressable
        onLongPress={() => {
          haptics.impact();
          setDemo(true);
        }}
        delayLongPress={600}
        style={styles.footer}
        accessibilityLabel="Apex Padel"
      >
        <LogoMark size={36} />
        <AppText variant="bodySm" tone="muted">
          {format(s.account.version, { v: Constants.expoConfig?.version ?? '1.0.0' })}
        </AppText>
      </Pressable>

      <DemoSheet open={demo} onClose={() => setDemo(false)} />
    </TabScreen>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <AppText weight="mono" tone="strong" align="center" style={styles.statValue}>
        {value}
      </AppText>
      <AppText variant="bodySm" tone="soft" align="center" numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

function Row({ icon, title, hint, value, end, last = false }: { icon: IconName; title: string; hint?: string; value?: string; end?: ReactNode; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowLine]}>
      <View style={styles.rowIcon}>
        <MaterialIcons name={icon} size={20} color={colors.cyan.DEFAULT} />
      </View>
      <View className="flex-1">
        <AppText variant="body" weight="medium" tone="ink">
          {title}
        </AppText>
        {hint ? (
          <AppText variant="bodySm" tone="muted">
            {hint}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="bodySm" tone="soft">
          {value}
        </AppText>
      ) : null}
      {end}
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface.DEFAULT,
    borderWidth: 1,
    borderColor: 'rgba(202,243,0,0.25)',
  },
  spot: { end: -60, top: -60 },
  avatarRing: { width: 68, height: 68, borderRadius: 34, padding: 3, borderWidth: 2, borderColor: 'rgba(202,243,0,0.5)' },
  avatar: { flex: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.highest },
  initial: { fontSize: 26, lineHeight: 34 },
  stat: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: colors.surface.low, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 2 },
  statValue: { fontSize: 22, lineHeight: 28 },
  list: { borderRadius: 16, backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingHorizontal: 14, paddingVertical: 10 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.high },
  footer: { alignItems: 'center', gap: 8, paddingVertical: 12 },
});
