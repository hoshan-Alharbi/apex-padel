import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { useI18n } from '@/i18n';
import { haptics } from '@/lib/haptics';
import { useFavorites } from '@/state/favorites';
import { colors } from '@/theme';

type Props = { clubId: string };

/** Heart that pops with a spring and a ring burst when a club is saved. */
export function FavoriteButton({ clubId }: Props) {
  const { s } = useI18n();
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(clubId);
  const scale = useSharedValue(1);
  const ring = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ring.value === 0 ? 0 : 1 - ring.value,
    transform: [{ scale: 0.6 + ring.value * 0.9 }],
  }));

  const onPress = () => {
    scale.set(withSequence(withTiming(0.7, { duration: 90 }), withSpring(1, { damping: 7, stiffness: 320 })));
    if (!saved) {
      ring.set(0);
      ring.set(
        withTiming(1, { duration: 450 }, () => {
          ring.set(0);
        }),
      );
    }
    haptics.tap();
    toggle(clubId);
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={saved ? s.home.removeFavorite : s.home.addFavorite}
      style={styles.button}
    >
      <Animated.View pointerEvents="none" style={[styles.ring, ringStyle]} />
      <Animated.View style={heartStyle}>
        <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? colors.crimson.DEFAULT : colors.ink.strong} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,19,29,0.65)',
  },
  ring: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.crimson.DEFAULT,
  },
});
