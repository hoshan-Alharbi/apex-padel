import { type ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

/** Gap between the last scroll item and the bar. */
const CLEARANCE = 24;

/**
 * Scroll padding that keeps content clear of the bar. Pass `onHeight` to the BottomBar and
 * spread `paddingBottom` into the scroll content style: it follows the bar's real height.
 */
export function useBottomBarSpace() {
  const [height, setHeight] = useState(160);
  return { paddingBottom: height + CLEARANCE, onHeight: setHeight };
}

/** Sticky action bar at the bottom of stack screens (price + main action). */
export function BottomBar({ children, onHeight }: { children: ReactNode; onHeight?: (height: number) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View onLayout={(e) => onHeight?.(e.nativeEvent.layout.height)} style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: colors.surface.low,
    borderTopWidth: 1,
    borderTopColor: 'rgba(68,73,50,0.3)',
    boxShadow: '0px -8px 25px rgba(0,0,0,0.5)',
  },
});
