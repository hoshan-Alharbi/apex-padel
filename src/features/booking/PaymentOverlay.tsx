import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, ZoomIn } from 'react-native-reanimated';

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
  // Each opening starts again at "processing" (state adjusted during render, not in an effect).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setPhase('processing');
  }

  useEffect(() => {
    if (!open) return;
    const t1 = setTimeout(() => {
      setPhase('paid');
      haptics.success();
    }, PROCESSING_MS);
    const t2 = setTimeout(onDone, PROCESSING_MS + SUCCESS_HOLD_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs per opening
  }, [open]);

  // Entering animations (not a shared value): they belong to the views, so they still run when
  // the Modal's content mounts a frame later on Android.
  if (!open) return null;
  return (
    <Modal transparent visible statusBarTranslucent navigationBarTranslucent animationType="none" onRequestClose={() => {}}>
      <Animated.View entering={FadeIn.duration(FADE_MS)} style={[StyleSheet.absoluteFill, styles.backdrop]} />
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View entering={ZoomIn.duration(260).easing(Easing.out(Easing.cubic))} style={styles.card}>
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
