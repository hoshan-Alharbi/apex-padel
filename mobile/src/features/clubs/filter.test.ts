/// <reference types="jest" />
import { CLUBS } from '@/data/clubs';
import type { Club } from '@/data/types';

import { filterClubs, startingPrice } from './filter';

const club = (overrides: Partial<Club>): Club => ({ ...CLUBS[0], ...overrides });

describe('startingPrice', () => {
  it('returns the cheapest duration and its price', () => {
    expect(startingPrice(club({ prices: { 60: 100, 90: 140, 120: 180 } }))).toEqual({ price: 100, duration: 60 });
  });

  it('does not assume the shortest duration is the cheapest', () => {
    expect(startingPrice(club({ prices: { 60: 150, 90: 130, 120: 200 } }))).toEqual({ price: 130, duration: 90 });
  });
});

describe('filterClubs', () => {
  const base = { city: 'riyadh' as const, filter: 'all' as const, query: '' };

  it('keeps only clubs in the selected city', () => {
    const ids = filterClubs(CLUBS, base).map((c) => c.id);
    expect(ids).toEqual(['sadara', 'rimal', 'arena']);
  });

  it('filters by feature', () => {
    expect(filterClubs(CLUBS, { ...base, filter: 'outdoor' }).map((c) => c.id)).toEqual(['rimal']);
    expect(filterClubs(CLUBS, { ...base, filter: 'ac' }).map((c) => c.id)).toEqual(['sadara', 'arena']);
  });

  it('matches Arabic names regardless of hamza / taa marbuta spelling', () => {
    expect(filterClubs(CLUBS, { ...base, query: 'الصداره' }).map((c) => c.id)).toEqual(['sadara']);
    expect(filterClubs(CLUBS, { ...base, query: 'ارينا' }).map((c) => c.id)).toEqual(['arena']);
  });

  it('matches English names and districts case-insensitively', () => {
    expect(filterClubs(CLUBS, { ...base, query: 'MALQA' }).map((c) => c.id)).toEqual(['rimal']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterClubs(CLUBS, { ...base, query: 'zzz' })).toEqual([]);
    expect(filterClubs(CLUBS, { ...base, city: 'khobar', filter: 'outdoor' })).toEqual([]);
  });
});
