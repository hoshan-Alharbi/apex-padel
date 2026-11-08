import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import type { IconName } from '@/components/IconButton';
import { PressableScale } from '@/components/PressableScale';
import { SectionTitle } from '@/components/SectionTitle';
import type { Club, Court, Review } from '@/data/types';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

/** Two-column grid of facility tiles. */
export function Amenities({ club }: { club: Club }) {
  const { s, pick } = useI18n();
  return (
    <View>
      <SectionTitle>{s.club.amenities}</SectionTitle>
      <View className="flex-row flex-wrap" style={styles.grid}>
        {club.facilities.map((f) => (
          <View key={f.label.en} style={styles.cell}>
            <View style={styles.facility}>
              <MaterialIcons name={f.icon as IconName} size={20} color={colors.cyan.DEFAULT} />
              <AppText variant="bodySm" weight="medium" tone="ink" className="flex-1" numberOfLines={2}>
                {pick(f.label)}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

type CourtsProps = { club: Club; selected: Court; onSelect: (court: Court) => void };

/** Court chips and the selected court's spec card. */
export function Courts({ club, selected, onSelect }: CourtsProps) {
  const { s, pick, format } = useI18n();
  const { specs } = club;

  return (
    <View>
      <SectionTitle
        end={
          <AppText variant="badge" weight="bold" tone="volt" uppercase>
            {s.club.liveStatus}
          </AppText>
        }
      >
        {s.club.courts}
      </SectionTitle>

      <View style={styles.chipGap}>
        <CourtChips courts={club.courts} selectedId={selected.id} onSelect={onSelect} />
      </View>

      <Animated.View key={selected.id} entering={FadeIn.duration(250)} style={styles.specCard}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <AppText variant="badge" weight="bold" tone="cyan" uppercase>
              {s.club.featured}
            </AppText>
            <AppText variant="headline" weight="bold" tone="strong" className="mt-1">
              {format(s.club.specsTitle, { court: pick(selected.name) })}
            </AppText>
          </View>
          <View style={styles.featureTag}>
            <AppText variant="numeric" weight="mono" tone="volt">
              {s.filters[selected.feature]}
            </AppText>
          </View>
        </View>

        <View className="mt-4 flex-row gap-2">
          <SpecBox label={s.club.lighting} value={`${specs.lux} ${s.club.lux}`} hint={s.club.broadcast} />
          <SpecBox label={s.club.surface} value={pick(specs.surface)} text />
          <SpecBox label={s.club.height} value={format(s.club.meters, { n: specs.heightM })} hint={s.club.clearance} />
        </View>

        <View style={styles.recording}>
          <View className="flex-1 flex-row items-center gap-2">
            <MaterialIcons name="videocam" size={18} color={colors.cyan.DEFAULT} />
            <AppText variant="bodySm" tone="ink" className="flex-1">
              {s.club.recording}
            </AppText>
          </View>
          <AppText variant="bodySm" weight="bold" tone={specs.recording ? 'cyan' : 'muted'}>
            {specs.recording ? s.club.included : s.club.notIncluded}
          </AppText>
        </View>
      </Animated.View>
    </View>
  );
}

/** Horizontal court selector (club page and booking screen). Bleeds to the screen edges. */
export function CourtChips({ courts, selectedId, onSelect }: { courts: Court[]; selectedId: string; onSelect: (court: Court) => void }) {
  const { s, pick } = useI18n();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipRail}>
      {courts.map((court) => {
        const active = court.id === selectedId;
        return (
          <PressableScale
            key={court.id}
            haptic="select"
            onPress={() => onSelect(court)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
          >
            {active && <View style={styles.chipDot} />}
            <AppText variant="bodyLg" weight={active ? 'bold' : 'medium'} tone={active ? 'onPrimary' : 'soft'}>
              {pick(court.name)} ({s.filters[court.feature]})
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

/** `text` for words (Space Mono has no Arabic glyphs); numbers stay mono. */
function SpecBox({ label, value, hint, text = false }: { label: string; value: string; hint?: string; text?: boolean }) {
  return (
    <View style={styles.specBox}>
      <AppText variant="bodySm" tone="soft" align="center">
        {label}
      </AppText>
      <AppText variant={text ? 'bodySm' : 'numeric'} weight={text ? 'bold' : 'mono'} tone="strong" align="center" className="mt-1">
        {value}
      </AppText>
      {hint && (
        <AppText tone="muted" align="center" style={styles.hint}>
          {hint}
        </AppText>
      )}
    </View>
  );
}

/** First reviews + total count. */
export function Reviews({ club }: { club: Club }) {
  const { s, format } = useI18n();
  return (
    <View>
      <SectionTitle
        end={
          <AppText variant="bodySm" weight="bold" tone="volt">
            {format(s.club.seeAll, { n: club.reviews })}
          </AppText>
        }
      >
        {s.club.reviewsTitle}
      </SectionTitle>
      <View className="gap-3">
        {club.testimonials.map((r) => (
          <ReviewCard key={r.name.en} review={r} />
        ))}
      </View>
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { pick } = useI18n();
  return (
    <View style={styles.card}>
      <View className="flex-row items-center gap-3">
        <View style={styles.avatar}>
          <AppText variant="bodySm" weight="bold" tone="strong" align="center">
            {pick(review.initials)}
          </AppText>
        </View>
        <View className="flex-1">
          <AppText variant="body" weight="bold" tone="strong">
            {pick(review.name)}
          </AppText>
          <AppText variant="bodySm" tone="muted">
            {pick(review.when)}
          </AppText>
        </View>
        <View className="flex-row">
          {Array.from({ length: 5 }, (_, i) => (
            <MaterialIcons key={i} name={i < review.rating ? 'star' : 'star-border'} size={14} color={colors.volt.DEFAULT} />
          ))}
        </View>
      </View>
      <AppText variant="body" tone="soft" className="mt-3">
        “{pick(review.text)}”
      </AppText>
    </View>
  );
}

export function CancellationPolicy() {
  const { s } = useI18n();
  return (
    <View style={[styles.card, styles.policy]}>
      <MaterialIcons name="info-outline" size={20} color={colors.ink.soft} />
      <View className="flex-1 gap-1">
        <AppText variant="body" weight="bold" tone="ink">
          {s.club.policyTitle}
        </AppText>
        <AppText variant="bodySm" tone="soft">
          {s.club.policyBody}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { marginHorizontal: -5 },
  cell: { width: '50%', padding: 5 },
  facility: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface.DEFAULT,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipRail: { marginHorizontal: -16 },
  chipGap: { marginBottom: 14 },
  // Vertical padding leaves room for the active chip's glow.
  chips: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 16, borderRadius: 999 },
  chipActive: { backgroundColor: colors.volt.DEFAULT, boxShadow: '0px 0px 24px -2px rgba(202,243,0,0.35)' },
  chipIdle: { backgroundColor: colors.surface.DEFAULT, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  chipDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.onPrimary },
  specCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(202,243,0,0.5)',
    backgroundColor: colors.recessed,
  },
  specBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: colors.surface.low,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  hint: { fontSize: 10, lineHeight: 14, marginTop: 2 },
  recording: {
    marginTop: 14,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface.DEFAULT,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.highest,
  },
  policy: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.surface.low },
});
