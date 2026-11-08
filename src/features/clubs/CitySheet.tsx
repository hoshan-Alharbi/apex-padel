import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { Sheet } from '@/components/Sheet';
import { CITIES, CLUBS } from '@/data/clubs';
import type { CityId } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

type Props = {
  open: boolean;
  city: CityId;
  onSelect: (city: CityId) => void;
  onClose: () => void;
};

/** Bottom sheet for choosing the city. */
export function CitySheet({ open, city, onSelect, onClose }: Props) {
  const { s, plural } = useI18n();

  return (
    <Sheet open={open} onClose={onClose}>
      <AppText weight="bold" tone="strong" className="text-xl" style={{ marginBottom: 16 }}>
        {s.home.chooseCity}
      </AppText>
      <View className="gap-2">
        {CITIES.map((id) => {
          const selected = id === city;
          const count = CLUBS.filter((c) => c.city === id).length;
          return (
            <PressableScale
              key={id}
              haptic="select"
              onPress={() => onSelect(id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              className={`flex-row items-center rounded-lg border px-4 py-4 ${selected ? 'border-volt bg-volt/10' : 'border-ink-strong/10 bg-surface'}`}
            >
              <Ionicons name="location" size={18} color={selected ? colors.volt.DEFAULT : colors.ink.muted} />
              <View className="mx-3 flex-1">
                <AppText weight="semibold" tone={selected ? 'volt' : 'strong'} className="text-base">
                  {s.cities[id]}
                </AppText>
                <AppText tone="muted" className="text-xs">
                  {plural(s.home.clubCount, count)}
                </AppText>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={22} color={colors.volt.DEFAULT} />}
            </PressableScale>
          );
        })}
      </View>
    </Sheet>
  );
}
