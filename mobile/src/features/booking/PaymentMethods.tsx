import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import type { PaymentMethod } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

export const PAYMENT_METHODS: PaymentMethod[] = ['mada', 'applepay', 'stcpay', 'venue'];

/** Brand-neutral mark for each method (no official logos in the repo). */
export function MethodMark({ method }: { method: PaymentMethod }) {
  if (method === 'mada') {
    return (
      <View style={[styles.mark, styles.madaMark]}>
        <AppText weight="mono" style={styles.madaText}>
          mada
        </AppText>
      </View>
    );
  }
  return (
    <View style={styles.mark}>
      {method === 'applepay' && <Ionicons name="logo-apple" size={20} color={colors.ink.strong} />}
      {method === 'stcpay' && <MaterialIcons name="phone-iphone" size={20} color="#B78CFF" />}
      {method === 'venue' && <MaterialIcons name="storefront" size={20} color={colors.cyan.DEFAULT} />}
    </View>
  );
}

type Props = { value: PaymentMethod; onChange: (m: PaymentMethod) => void; disabled?: PaymentMethod[] };

/** Radio list of payment methods. */
export function PaymentMethods({ value, onChange, disabled = [] }: Props) {
  const { s } = useI18n();
  return (
    <View className="gap-2">
      {PAYMENT_METHODS.map((m) => {
        const active = m === value;
        const off = disabled.includes(m);
        return (
          <PressableScale
            key={m}
            haptic={off ? 'none' : 'select'}
            disabled={off}
            onPress={() => onChange(m)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active, disabled: off }}
            style={[styles.row, active ? styles.active : styles.idle, off && styles.off]}
          >
            <MethodMark method={m} />
            <View className="flex-1">
              <AppText variant="bodyLg" weight="bold" tone="strong">
                {s.checkout.methods[m]}
              </AppText>
              <AppText variant="bodySm" tone="soft">
                {s.checkout.methodSubs[m]}
              </AppText>
            </View>
            <View style={[styles.radio, active && styles.radioOn]}>{active && <View style={styles.radioDot} />}</View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  active: { backgroundColor: 'rgba(202,243,0,0.06)', borderColor: colors.volt.DEFAULT },
  idle: { backgroundColor: colors.surface.DEFAULT, borderColor: 'rgba(255,255,255,0.08)' },
  off: { opacity: 0.4 },
  mark: { width: 48, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.high },
  madaMark: { backgroundColor: '#F2F4F7' },
  madaText: { fontSize: 13, lineHeight: 16, color: '#1D2939' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.ink.muted, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.volt.DEFAULT },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.volt.DEFAULT },
});
