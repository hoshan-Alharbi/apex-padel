import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PingDot, PulseDot } from '@/components/effects/Dots';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

import type { DisplayStatus } from './selectors';

const LOOK: Record<DisplayStatus, { fg: string; bg: string; border: string }> = {
  confirmed: { fg: colors.volt.DEFAULT, bg: 'rgba(202,243,0,0.1)', border: 'rgba(202,243,0,0.5)' },
  pending: { fg: colors.cyan.DEFAULT, bg: 'rgba(0,227,253,0.1)', border: 'rgba(0,227,253,0.4)' },
  awaitingPartners: { fg: colors.error.DEFAULT, bg: 'rgba(147,0,10,0.35)', border: colors.error.container },
  cancelled: { fg: colors.ink.muted, bg: colors.surface.high, border: 'rgba(255,255,255,0.08)' },
  refunded: { fg: colors.ink.soft, bg: colors.surface.high, border: 'rgba(255,255,255,0.08)' },
  completed: { fg: colors.ink.soft, bg: colors.surface.high, border: 'rgba(255,255,255,0.08)' },
};

/** Booking state pill. Waiting states pulse so they read as "live". */
export function StatusBadge({ status }: { status: DisplayStatus }) {
  const { s } = useI18n();
  const look = LOOK[status];
  return (
    <View style={[styles.badge, { backgroundColor: look.bg, borderColor: look.border }]}>
      {status === 'pending' && <PulseDot size={6} color={look.fg} />}
      {status === 'awaitingPartners' && <PingDot size={6} color={look.fg} />}
      <AppText variant="badge" weight="bold" uppercase style={{ color: look.fg, letterSpacing: 0 }}>
        {s.status[status]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, borderWidth: 1 },
});
