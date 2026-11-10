import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Linking, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import type { IconName } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import type { Club } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

type Props = { club: Club; onShare: () => void };

/** Name, rating, distance, address and the three quick actions (directions, call, share). */
export function ClubInfo({ club, onShare }: Props) {
  const { s, pick, format } = useI18n();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${club.name.en}, ${club.address.en}`)}`;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-1.5">
          <AppText weight="bold" tone="strong" style={styles.name} numberOfLines={2}>
            {pick(club.name)}
          </AppText>
          <MaterialIcons name="verified" size={22} color={colors.cyan.DEFAULT} />
        </View>
        {club.rating >= 4.8 && (
          <View style={styles.premium}>
            <AppText variant="badge" weight="bold" tone="volt" uppercase>
              {s.club.premium}
            </AppText>
          </View>
        )}
      </View>

      <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="star" size={16} color={colors.volt.DEFAULT} />
          <AppText variant="numeric" weight="mono" tone="volt">
            {club.rating.toFixed(1)}
          </AppText>
          <AppText variant="bodySm" tone="soft">
            {format(s.club.reviews, { n: club.reviews })}
          </AppText>
        </View>
        <AppText variant="bodySm" tone="muted">
          •
        </AppText>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="near-me" size={15} color={colors.ink.soft} />
          <AppText variant="bodySm" tone="soft">
            {format(s.club.away, { km: club.distanceKm })}
          </AppText>
        </View>
      </View>

      <View className="flex-row items-start gap-1.5">
        <MaterialIcons name="location-on" size={18} color={colors.ink.muted} style={styles.pin} />
        <AppText variant="bodyLg" tone="soft" className="flex-1">
          {pick(club.address)}
        </AppText>
      </View>

      <View className="mt-1 flex-row gap-2.5">
        <ActionTile icon="directions" label={s.club.directions} onPress={() => Linking.openURL(mapsUrl)} />
        <ActionTile icon="call" label={s.club.call} onPress={() => Linking.openURL(`tel:${club.phone.replace(/\s/g, '')}`)} />
        <ActionTile icon="ios-share" label={s.common.share} onPress={onShare} />
      </View>
    </View>
  );
}

function ActionTile({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <View className="flex-1">
      <PressableScale onPress={onPress} accessibilityRole="button" style={styles.tile}>
        <MaterialIcons name={icon} size={24} color={colors.cyan.DEFAULT} />
        <AppText variant="bodySm" weight="medium" tone="ink" align="center">
          {label}
        </AppText>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 24, lineHeight: 32, flexShrink: 1 },
  premium: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, borderWidth: 1, borderColor: colors.volt.DEFAULT },
  pin: { marginTop: 3 },
  tile: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surface.DEFAULT,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
