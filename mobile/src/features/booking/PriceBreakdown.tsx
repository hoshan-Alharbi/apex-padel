import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import type { Club, Duration, Extras } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

import { extrasTotal, vatIncluded } from './pricing';

type Props = { club: Club; duration: Duration; extras: Extras; total: number; totalLabel?: string; footer?: ReactNode };

/** Court fee, extras, VAT (already included) and the total. */
export function PriceBreakdown({ club, duration, extras, total, totalLabel, footer }: Props) {
  const { s, format } = useI18n();
  const extra = extrasTotal(extras);

  return (
    <View>
      <Row label={format(s.checkout.courtFee, { min: duration })} value={club.prices[duration]} />
      {extra > 0 && <Row label={s.checkout.extrasFee} value={extra} />}
      <Row label={s.checkout.vat} value={vatIncluded(total)} muted />
      <View style={styles.divider} />
      <View className="flex-row items-end justify-between gap-3">
        <View className="flex-1">{footer}</View>
        <View className="items-end">
          <AppText variant="badge" weight="bold" tone="muted" uppercase>
            {totalLabel ?? s.checkout.total}
          </AppText>
          <AppText weight="mono" tone="strong" style={styles.total}>
            {total.toFixed(2)} {s.common.currency}
          </AppText>
        </View>
      </View>
    </View>
  );
}

function Row({ label, value, muted = false }: { label: string; value: number; muted?: boolean }) {
  const { s } = useI18n();
  return (
    <View className="flex-row items-center justify-between gap-3 py-1.5">
      <AppText variant="body" tone={muted ? 'muted' : 'soft'} className="flex-1">
        {label}
      </AppText>
      <AppText variant="numeric" weight="mono" tone={muted ? 'muted' : 'ink'}>
        {value.toFixed(2)} {s.common.currency}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: { height: 1, marginVertical: 12, backgroundColor: 'rgba(255,255,255,0.08)' },
  total: { fontSize: 20, lineHeight: 26, color: colors.ink.strong },
});
