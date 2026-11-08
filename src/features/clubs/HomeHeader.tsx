import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Glass, type GlassTarget } from '@/components/effects/Glass';
import { PressableScale } from '@/components/PressableScale';
import type { CityId } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

export const HEADER_HEIGHT = 56;
const PADDING_X = 16;
const PIN_SIZE = 20;

/** Screen point (physical px) of the location pin: where the opening's logo lands. */
export function useHeaderPinCenter() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isRTL } = useI18n();
  const x = PADDING_X + PIN_SIZE / 2;
  return { x: isRTL ? width - x : x, y: insets.top + HEADER_HEIGHT / 2 };
}

type Props = { city: CityId; onCityPress: () => void; blurTarget: GlassTarget };

/** Sticky frosted top bar: `bg-surface/90 backdrop-blur-md border-b outline-variant/30`, h-14. */
export function HomeHeader({ city, onCityPress, blurTarget }: Props) {
  const { s, format } = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <Glass target={blurTarget} tint="rgba(14,19,29,0.9)" intensity={40} style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <PressableScale
          onPress={onCityPress}
          scaleTo={0.95}
          haptic="select"
          accessibilityRole="button"
          accessibilityLabel={s.home.chooseCity}
          className="flex-row items-center gap-1.5"
        >
          <MaterialIcons name="location-on" size={PIN_SIZE} color={colors.volt.DEFAULT} />
          <View>
            <AppText variant="bodySm" tone="muted" style={{ lineHeight: 15 }}>
              {s.home.brandLine}
            </AppText>
            <View className="flex-row items-center gap-1">
              <AppText variant="headline" weight="bold" tone="ink">
                {format(s.home.cityLine, { city: s.cities[city] })}
              </AppText>
              <MaterialIcons name="expand-more" size={16} color={colors.ink.soft} />
            </View>
          </View>
        </PressableScale>

        <View className="flex-row items-center gap-2.5">
          <PressableScale
            scaleTo={0.95}
            accessibilityRole="button"
            accessibilityLabel={s.home.notifications}
            className="h-9 w-9 items-center justify-center rounded-full bg-surface"
          >
            <MaterialIcons name="notifications-none" size={20} color={colors.ink.DEFAULT} />
            <View style={styles.dot} />
          </PressableScale>
          <PressableScale scaleTo={0.95} accessibilityRole="button" accessibilityLabel={s.home.profile} style={styles.avatarRing}>
            <View style={styles.avatar}>
              <AppText variant="action" weight="bold" tone="volt" align="center">
                {s.user.firstName.slice(0, 1)}
              </AppText>
            </View>
          </PressableScale>
        </View>
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(68,73,50,0.3)',
  },
  row: {
    height: HEADER_HEIGHT,
    paddingHorizontal: PADDING_X,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    position: 'absolute',
    top: 6,
    end: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.volt.DEFAULT,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  avatarRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 2,
    borderWidth: 2,
    borderColor: 'rgba(202,243,0,0.4)',
  },
  avatar: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.highest,
  },
});
