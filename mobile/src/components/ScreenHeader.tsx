import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  /** Actions at the end edge (share, temperature chip…). */
  end?: ReactNode;
  /** Defaults to going back; screens opened first (deep link) fall back to Home. */
  onBack?: () => void;
};

export const SCREEN_HEADER_HEIGHT = 64;

/** Stack screen header from the reference: round back button, title + subtitle, end actions. */
export function ScreenHeader({ title, subtitle, end, onBack }: Props) {
  const { s, isRTL } = useI18n();
  const insets = useSafeAreaInsets();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <IconButton icon={isRTL ? 'arrow-forward' : 'arrow-back'} onPress={back} accessibilityLabel={s.common.back} />
        <View className="flex-1">
          <AppText variant="headline" weight="bold" tone="strong" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="bodySm" tone="soft" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {end}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: 'rgba(68,73,50,0.3)' },
  row: { height: SCREEN_HEADER_HEIGHT, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
});
