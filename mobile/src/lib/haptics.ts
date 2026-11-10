import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS !== 'web';

// Fire-and-forget: a failed haptic must never break an interaction.
const run = (fn: () => Promise<void>) => {
  if (enabled) fn().catch(() => {});
};

export const haptics = {
  /** Selection changes: tabs, chips, slots. */
  select: () => run(() => Haptics.selectionAsync()),
  /** Light press on buttons and cards. */
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** Strong moment: the racket hitting the ball, confirming a booking. */
  impact: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};
