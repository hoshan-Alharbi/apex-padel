import { View } from 'react-native';

import { HomeScreen } from '@/features/clubs/HomeScreen';
import { useMarkOpeningReady, useRevealed } from '@/state/opening';
import { colors } from '@/theme';

/**
 * Home mounts behind the opening overlay, and the opening waits for its first layout before
 * playing: mounting Home mid-animation would freeze frames.
 */
export default function HomeRoute() {
  const revealed = useRevealed();
  const markReady = useMarkOpeningReady();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} onLayout={revealed ? markReady : undefined}>
      {revealed && <HomeScreen />}
    </View>
  );
}
