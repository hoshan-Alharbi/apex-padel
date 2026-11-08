import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import type { IconName } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import { colors } from '@/theme';

type Props = {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  /** Outlined secondary style instead of the volt fill. */
  variant?: 'primary' | 'secondary';
  /** Shorter button with a smaller label, for bars that share the row with a price. */
  compact?: boolean;
};

/** The reference's big action button: volt fill, 56px tall, volt glow; dims when disabled. */
export function PrimaryButton({ label, onPress, icon, disabled = false, loading = false, variant = 'primary', compact = false }: Props) {
  const primary = variant === 'primary';
  const inactive = disabled || loading;
  const ink = primary ? colors.onPrimary : colors.volt.DEFAULT;

  return (
    <View style={primary && !inactive ? styles.glow : undefined}>
      <PressableScale
        onPress={inactive ? undefined : onPress}
        disabled={inactive}
        haptic={inactive ? 'none' : 'tap'}
        accessibilityRole="button"
        accessibilityState={{ disabled: inactive }}
        style={[styles.button, compact && styles.compact, primary ? styles.primary : styles.secondary, inactive && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={ink} />
        ) : (
          <>
            <AppText variant="action" weight="bold" numberOfLines={1} style={{ color: ink, fontSize: compact ? 14 : 15 }}>
              {label}
            </AppText>
            {icon && <MaterialIcons name={icon} size={compact ? 18 : 20} color={ink} />}
          </>
        )}
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: { borderRadius: 16, boxShadow: '0px 0px 24px -2px rgba(202,243,0,0.35)' },
  button: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 20 },
  compact: { height: 50, paddingHorizontal: 14, gap: 6 },
  primary: { backgroundColor: colors.volt.DEFAULT },
  secondary: { borderWidth: 1, borderColor: 'rgba(202,243,0,0.4)', backgroundColor: colors.surface.DEFAULT },
  disabled: { opacity: 0.4 },
});
