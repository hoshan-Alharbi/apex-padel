import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { Sheet } from '@/components/Sheet';
import { clubOf } from '@/features/bookings/selectors';
import { useI18n } from '@/i18n';
import { useBookings } from '@/state/bookings';
import { colors } from '@/theme';

/** Seconds left after "expire soon", so the refund scenario can be filmed quickly. */
const FAST_EXPIRE_MS = 10_000;

/**
 * Hidden demo controls (long-press the logo in Account): mark partners as paid, or make a
 * split's countdown end in seconds. For filming the split-bill scenarios.
 */
export function DemoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s, pick, format } = useI18n();
  const { bookings, payShare, setDeadlineIn } = useBookings();
  const live = bookings.filter((b) => b.status === 'awaitingPartners' && b.split);

  return (
    <Sheet open={open} onClose={onClose}>
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialIcons name="movie-filter" size={22} color={colors.volt.DEFAULT} />
        <View className="flex-1">
          <AppText variant="headline" weight="bold" tone="strong">
            {s.account.demoTitle}
          </AppText>
          <AppText variant="bodySm" tone="soft">
            {s.account.demoBody}
          </AppText>
        </View>
      </View>

      {live.length === 0 ? (
        <AppText variant="body" tone="muted" align="center" style={{ paddingVertical: 24 }}>
          {s.account.demoEmpty}
        </AppText>
      ) : (
        <View className="gap-4">
          {live.map((b) => (
            <View key={b.id} className="gap-2 rounded-lg border border-ink-strong/10 bg-surface p-3">
              <AppText variant="body" weight="bold" tone="ink">
                {pick(clubOf(b)!.name)} • {b.code}
              </AppText>
              <View className="flex-row flex-wrap gap-2">
                {b.split!.shares
                  .filter((x) => !x.paid)
                  .map((x) => (
                    <PressableScale key={x.id} onPress={() => payShare(b.id, x.id)} className="flex-row items-center gap-1 rounded-sm bg-volt px-3 py-2">
                      <MaterialIcons name="check" size={16} color={colors.onPrimary} />
                      <AppText variant="bodySm" weight="bold" tone="onPrimary">
                        {format(s.account.demoMarkPaid, { name: pick(x.name) })}
                      </AppText>
                    </PressableScale>
                  ))}
                <PressableScale onPress={() => setDeadlineIn(b.id, FAST_EXPIRE_MS)} className="flex-row items-center gap-1 rounded-sm border border-crimson/50 px-3 py-2">
                  <MaterialIcons name="timer" size={16} color={colors.crimson.DEFAULT} />
                  <AppText variant="bodySm" weight="bold" tone="crimson">
                    {s.account.demoFastExpire}
                  </AppText>
                </PressableScale>
              </View>
            </View>
          ))}
        </View>
      )}
    </Sheet>
  );
}
