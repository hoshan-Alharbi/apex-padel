import { View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { colors } from '@/theme';

/** Loading placeholder with the same footprint as ClubCard. */
export function ClubCardSkeleton() {
  return (
    <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: colors.card }}>
      <Skeleton style={{ height: 176, borderRadius: 0 }} />
      <View className="gap-3 p-4">
        <View className="flex-row justify-between">
          <View className="gap-2">
            <Skeleton style={{ height: 18, width: 170 }} />
            <Skeleton style={{ height: 12, width: 110 }} />
          </View>
          <Skeleton style={{ height: 24, width: 70 }} />
        </View>
        <View className="flex-row gap-1.5">
          <Skeleton style={{ height: 20, width: 120, borderRadius: 4 }} />
          <Skeleton style={{ height: 20, width: 80, borderRadius: 4 }} />
        </View>
        <View className="flex-row justify-between pt-2">
          <Skeleton style={{ height: 26, width: 160, borderRadius: 4 }} />
          <Skeleton style={{ height: 28, width: 80, borderRadius: 8 }} />
        </View>
      </View>
    </View>
  );
}
