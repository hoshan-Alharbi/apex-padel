import type { CityId, Club, ClubFeature, Duration } from '@/data/types';

export type ClubFilter = 'all' | ClubFeature;
export const CLUB_FILTERS: ClubFilter[] = ['all', 'ac', 'indoor', 'outdoor'];

/** Lowest bookable price — what the card shows as "starts from". */
export function startingPrice(club: Club): { price: number; duration: Duration } {
  const [duration, price] = (Object.entries(club.prices) as [string, number][])
    .map(([d, p]) => [Number(d) as Duration, p] as const)
    .reduce((min, cur) => (cur[1] < min[1] ? cur : min));
  return { price, duration };
}

function normalize(text: string) {
  // Fold Arabic letter variants so "الصداره" matches "الصدارة".
  return text
    .toLowerCase()
    .replace(/[إأآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

export function filterClubs(
  clubs: Club[],
  { city, filter, query }: { city: CityId; filter: ClubFilter; query: string },
): Club[] {
  const q = normalize(query);
  return clubs.filter((club) => {
    if (club.city !== city) return false;
    if (filter !== 'all' && !club.features.includes(filter)) return false;
    if (!q) return true;
    const haystack = [club.name.ar, club.name.en, club.district.ar, club.district.en].map(normalize);
    return haystack.some((h) => h.includes(q));
  });
}
