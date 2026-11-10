import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurTargetView } from 'expo-blur';
import { Image } from 'expo-image';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Glass, useGlassTarget } from '@/components/effects/Glass';
import { PressableScale } from '@/components/PressableScale';
import type { Club } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

import { startingPrice } from './filter';

type IconName = ComponentProps<typeof MaterialIcons>['name'];
const GLASS_TINT = 'rgba(23,28,38,0.9)'; // surface-container-low/90

type Props = { club: Club; onPress?: () => void; onBook?: () => void };

/** Reference club `<article>`: photo with glass badges, then name/price, amenity chips and next slots. */
export function ClubCard({ club, onPress, onBook }: Props) {
  const { s, pick, lang } = useI18n();
  const photoRef = useGlassTarget();
  const { price } = startingPrice(club);

  return (
    <PressableScale onPress={onPress} scaleTo={0.98} style={styles.card}>
      <View style={styles.photo}>
        <BlurTargetView ref={photoRef} style={StyleSheet.absoluteFill}>
          <Image source={club.image} contentFit="cover" transition={250} style={StyleSheet.absoluteFill} />
        </BlurTargetView>

        <View style={styles.badges}>
          {club.badges.map((b, i) => (
            <Glass key={i} target={photoRef} tint={GLASS_TINT} style={styles.badge}>
              {b.icon && (
                <MaterialIcons name={b.icon as IconName} size={14} color={b.tone === 'cyan' ? colors.cyan.soft : colors.volt.DEFAULT} />
              )}
              <AppText variant="badge" weight="bold" tone={b.tone === 'cyan' ? 'cyanSoft' : 'volt'} style={styles.badgeText}>
                {pick(b.label)}
              </AppText>
            </Glass>
          ))}
        </View>

        <Glass target={photoRef} tint={GLASS_TINT} style={styles.rating}>
          <MaterialIcons name="star-border" size={16} color={colors.volt.DEFAULT} />
          <AppText variant="numeric" weight="mono" tone="ink">
            {club.rating.toFixed(1)}
          </AppText>
          <AppText tone="muted" style={styles.reviews}>
            ({club.reviews})
          </AppText>
        </Glass>
      </View>

      <View className="gap-3 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <AppText variant="headline" weight="bold" tone="ink" numberOfLines={1}>
              {pick(club.name)}
            </AppText>
            <View className="mt-0.5 flex-row items-center gap-1">
              <MaterialIcons name="location-on" size={15} color={colors.ink.muted} />
              <AppText variant="bodySm" tone="soft">
                {pick(club.district)}
                {s.common.listSeparator}
                {s.cities[club.city]}
              </AppText>
            </View>
          </View>
          {/* text-right block: "240 SAR" over "/ hour"; "From" sits inline before the price. */}
          <View style={styles.priceCol}>
            <View className="flex-row items-baseline gap-1">
              <AppText variant="bodySm" tone="muted">
                {s.home.startsFrom}
              </AppText>
              <AppText weight="mono" tone="volt" style={styles.price}>
                {price}
              </AppText>
              <AppText weight={lang === 'en' ? 'mono' : 'bold'} tone="volt" style={styles.currency}>
                {s.common.currency}
              </AppText>
            </View>
            <AppText variant="bodySm" tone="muted" align="end" numberOfLines={1} style={styles.perHour}>
              {s.home.perHour}
            </AppText>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-1.5">
          {club.amenities.map((a, i) => (
            <View key={i} className="rounded-xs bg-surface px-2 py-0.5">
              <AppText tone="soft" style={styles.amenity}>
                {pick(a)}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.slotsRow}>
          <View className="flex-row items-center gap-1.5">
            <AppText variant="bodySm" tone="muted">
              {s.home.next}
            </AppText>
            {club.nextSlots.map((t, i) => (
              <View key={t} style={[styles.slot, i === 0 ? styles.slotFirst : styles.slotIdle]}>
                <AppText weight="mono" tone={i === 0 ? 'volt' : 'soft'} style={styles.slotText}>
                  {t}
                </AppText>
              </View>
            ))}
          </View>
          <PressableScale onPress={onBook} scaleTo={0.95} className="rounded-sm border border-line/40 bg-surface px-3.5 py-1.5">
            <AppText weight="bold" tone="ink" style={styles.bookText}>
              {s.home.bookSlot}
            </AppText>
          </PressableScale>
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: colors.card,
  },
  photo: { height: 176 },
  badges: { position: 'absolute', top: 12, start: 12, flexDirection: 'row', gap: 6 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rating: {
    position: 'absolute',
    top: 12,
    end: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  // Android over-measures letter-spaced text, leaving empty space inside the pill. The
  // reference tracking is 0.88px; dropping it is visually negligible and keeps the pill tight.
  badgeText: { letterSpacing: 0 },
  reviews: { fontSize: 12, lineHeight: 16 },
  // Stretch (not flex-end): Android under-measures end-aligned text in a content-sized column.
  priceCol: { flexShrink: 0, alignItems: 'stretch' },
  perHour: { alignSelf: 'stretch' },
  price: { fontSize: 18, lineHeight: 24 },
  currency: { fontSize: 18, lineHeight: 24 },
  amenity: { fontSize: 12, lineHeight: 16 },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  slot: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, backgroundColor: colors.recessed },
  slotFirst: { borderColor: 'rgba(202,243,0,0.4)' },
  slotIdle: { borderColor: 'rgba(68,73,50,0.3)' },
  slotText: { fontSize: 12, lineHeight: 16 },
  bookText: { fontSize: 12, lineHeight: 16 },
});
