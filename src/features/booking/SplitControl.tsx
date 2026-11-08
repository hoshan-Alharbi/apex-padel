import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { Toggle } from '@/components/Toggle';
import { useI18n } from '@/i18n';
import { money } from '@/lib/format';
import { colors } from '@/theme';

import { SPLIT_PLAYER_OPTIONS, splitAmounts } from './split';

type Props = {
  total: number;
  enabled: boolean;
  players: number;
  onToggle: (on: boolean) => void;
  onPlayers: (n: number) => void;
  /** "Pay at the club" is selected: splitting isn't possible. */
  blocked: boolean;
};

/** "Split with players" card: toggle, player count and the per-player share. */
export function SplitControl({ total, enabled, players, onToggle, onPlayers, blocked }: Props) {
  const { s, format, plural } = useI18n();
  const shares = splitAmounts(total, players);

  return (
    <View style={[styles.card, enabled && styles.cardOn]}>
      <View className="flex-row items-center gap-3">
        <View style={styles.icon}>
          <MaterialIcons name="call-split" size={20} color={colors.volt.DEFAULT} />
        </View>
        <View className="flex-1">
          <AppText variant="bodyLg" weight="bold" tone="strong">
            {s.checkout.split}
          </AppText>
          <AppText variant="bodySm" tone={enabled ? 'volt' : 'soft'}>
            {blocked ? s.checkout.splitOnlyOnline : enabled ? format(s.checkout.perPlayer, { amount: money(shares[shares.length - 1]) }) : s.checkout.splitSub}
          </AppText>
        </View>
        <Toggle value={enabled} onChange={onToggle} disabled={blocked} accessibilityLabel={s.checkout.split} />
      </View>

      {enabled && (
        <Animated.View entering={FadeInDown.duration(250)} exiting={FadeOut.duration(150)} style={styles.players}>
          <AppText variant="badge" weight="bold" tone="muted" uppercase>
            {s.checkout.players}
          </AppText>
          <View className="flex-row gap-2">
            {SPLIT_PLAYER_OPTIONS.map((n) => {
              const active = n === players;
              return (
                <View key={n} className="flex-1">
                  <PressableScale
                    haptic="select"
                    onPress={() => onPlayers(n)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    style={[styles.count, active ? styles.countOn : styles.countOff]}
                  >
                    <AppText variant="body" weight="bold" tone={active ? 'onPrimary' : 'soft'} align="center">
                      {plural(s.pass.playersValue, n)}
                    </AppText>
                  </PressableScale>
                </View>
              );
            })}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 16, backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cardOn: { borderColor: 'rgba(202,243,0,0.4)' },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(202,243,0,0.12)' },
  players: { marginTop: 14, paddingTop: 12, gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  count: { height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  countOn: { backgroundColor: colors.volt.DEFAULT },
  countOff: { backgroundColor: colors.recessed, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
});
