import { type ReactNode, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { colors } from '@/theme';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Blocks closing by tapping outside or the back button (e.g. while a payment runs). */
  locked?: boolean;
};

/** Bottom sheet: slides up with a spring over a dimmed screen, slides down on close. */
export function Sheet({ open, onClose, children, locked = false }: Props) {
  const insets = useSafeAreaInsets();
  // Stays mounted after `open` turns false until the exit animation finishes.
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (open) {
      progress.set(withSpring(1, { damping: 20, stiffness: 200 }));
    } else {
      progress.set(
        withTiming(0, { duration: 220, easing: Easing.in(Easing.quad) }, (done) => {
          if (done) scheduleOnRN(setMounted, false);
        }),
      );
    }
  }, [open, progress]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [520, 0]) }],
  }));

  if (!mounted) return null;
  const close = locked ? () => {} : onClose;

  return (
    <Modal transparent visible statusBarTranslucent navigationBarTranslucent animationType="none" onRequestClose={close}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityRole="button" />
      </Animated.View>
      <Animated.View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 28 }, sheetStyle]}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(5,8,13,0.7)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surface.high,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
});
