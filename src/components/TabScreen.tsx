import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { ScreenBlurTarget } from '@/components/effects/Glass';
import { useTabBarSpace } from '@/components/navigation/TabBar';
import { colors } from '@/theme';

type Props = { title: string; subtitle?: string; end?: ReactNode; children: ReactNode };

/** Layout for the Bookings / Favorites / Account tabs: big title, scroll, room for the tab bar. */
export function TabScreen({ title, subtitle, end, children }: Props) {
  const insets = useSafeAreaInsets();
  const bottomSpace = useTabBarSpace();
  return (
    <ScreenBlurTarget style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: bottomSpace, paddingHorizontal: 16, gap: 20 }}
      >
        <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-end justify-between gap-3">
          <View className="flex-1">
            <AppText variant="hero" weight="bold" tone="strong">
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="bodySm" tone="muted" className="mt-0.5">
                {subtitle}
              </AppText>
            ) : null}
          </View>
          {end}
        </Animated.View>
        {children}
      </ScrollView>
    </ScreenBlurTarget>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
