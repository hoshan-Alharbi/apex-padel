import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';

/** Small muted caps label above a control group ("SELECT DATE", "DURATION"). */
export function SectionLabel({ children, end }: { children: string; end?: ReactNode }) {
  return (
    <View className="mb-2.5 flex-row items-center justify-between">
      <AppText variant="badge" weight="bold" tone="muted" uppercase>
        {children}
      </AppText>
      {end}
    </View>
  );
}

/** Section heading ("Arena Amenities") with an optional end action. */
export function SectionTitle({ children, end }: { children: string; end?: ReactNode }) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <AppText variant="headline" weight="bold" tone="ink">
        {children}
      </AppText>
      {end}
    </View>
  );
}
