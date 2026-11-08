import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { colors } from '@/theme';

export type IconName = ComponentProps<typeof MaterialIcons>['name'];

type Props = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  /** Translucent dark fill, for buttons sitting on photos. */
  overlay?: boolean;
  color?: string;
  size?: number;
};

/** Round 40px icon button (reference header actions: back, share, favorite). */
export function IconButton({ icon, onPress, accessibilityLabel, overlay = false, color = colors.ink.DEFAULT, size = 22 }: Props) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.92} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      <View style={[styles.button, overlay ? styles.overlay : styles.solid]}>
        <MaterialIcons name={icon} size={size} color={color} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  solid: { backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  overlay: { backgroundColor: 'rgba(14,19,29,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
});
