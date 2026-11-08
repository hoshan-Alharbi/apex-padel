import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/AppText';
import { DrawnCheck } from '@/components/effects/DrawnCheck';
import type { PaymentMethod } from '@/data/types';
import { useI18n } from '@/i18n';
import { money } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { colors } from '@/theme';

/** Simulated gateway timings (no real payment in the UI-only phase). */
const PROCESSING_MS = 1600;
const SUCCESS_HOLD_MS = 1100;
const FADE_MS = 200;

type Props = { open: boolean; method: PaymentMethod; amount: number; onDone: () => void };

/**
 * Fake payment gateway, centred on screen: a spinner while "processing", then a drawn check,
 * then hands over to the result. Blocks touches and the back button while it runs.
 */
export function PaymentOverlay({ open, method, amount, onDone }: Props) {
  const { s } = useI18n();
  const [phase, setPhase] = useState<'processing' | 'paid'>('processing');
  // Stays mounted after `open` turns false until the fade-out finishes.
  const [mounted, setMounted] = useState(open);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setMounted(true);
      setPhase('processing');
    }
  }

  const shown = useSharedValue(0);
  useEffect(() => {
    if (open) {
      shown.set(withTiming(1, { duration: FADE_MS, easing: Easing.out(Easing.cubic) }));
      const t1 = setTimeout(() => {
        setPhase('paid');
        haptics.success();
      }, PROCESSING_MS);
      const t2 = setTimeout(onDone, PROCESSING_MS + SUCCESS_HOLD_MS);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    shown.set(
      withTiming(0, { duration: FADE_MS }, (done) => {
        if (done) scheduleOnRN(setMounted, false);
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs per opening
  }, [open]);

  const backdrop = useAnimatedStyle(() => ({ opacity: shown.value }));
  const card = useAnimatedStyle(() => ({ opacity: shown.value, transform: [{ scale: 0.94 + 0.06 * shown.value }] }));

  if (!mounted) return null;
  return (
    <Modal transparent visible statusBarTranslucent navigationBarTranslucent animationType="none" onRequestClose={() => {}}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdrop]} />
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View style={[styles.card, card]}>
          <View style={styles.icon}>{phase === 'processing' ? <ActivityIndicator size="large" color={colors.volt.DEFAULT} /> : <DrawnCheck size={72} />}</View>
          <Animated.View key={phase} entering={FadeIn.duration(180)} className="items-center gap-1">
            <AppText variant="headline" weight="bold" tone="strong" align="center">
              {phase === 'processing' ? s.checkout.processing : s.checkout.paid}
            </AppText>
            <AppText variant="body" tone="soft" align="center">
              {s.checkout.methods[method]} • {money(amount)} {s.common.currency}
            </AppText>
            {phase === 'processing' && (
              <AppText variant="bodySm" tone="muted" align="center" className="mt-1">
                {s.checkout.processingSub}
              </AppText>
            )}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(5,8,13,0.78)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  card: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    gap: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: colors.surface.high,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  icon: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
});
