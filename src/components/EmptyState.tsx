import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import type { IconName } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import { colors } from '@/theme';

type Props = { icon: IconName; title: string; body?: string; action?: { label: string; onPress: () => void } };

/** Dashed empty-state card: icon, title, hint and an optional outlined action. */
export function EmptyState({ icon, title, body, action }: Props) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.empty}>
      <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-surface">
        <MaterialIcons name={icon} size={24} color={colors.ink.muted} />
      </View>
      <AppText variant="headline" weight="bold" tone="ink" align="center">
        {title}
      </AppText>
      {body ? (
        <AppText variant="bodySm" tone="muted" align="center" className="mt-1">
          {body}
        </AppText>
      ) : null}
      {action && (
        <PressableScale onPress={action.onPress} className="mt-5 rounded-full border border-volt/40 px-5 py-2.5">
          <AppText variant="action" weight="bold" tone="volt">
            {action.label}
          </AppText>
        </PressableScale>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.15)',
  },
});
