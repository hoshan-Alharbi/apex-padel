/// <reference types="jest" />
import { CLUBS } from '@/data/clubs';
import type { Booking } from '@/data/types';
import { addDays, clockTime, dayLabel, nextDays, timeRange } from '@/lib/format';

import { bookingTotal, EXTRA_PRICES, extrasTotal, NO_EXTRAS, vatIncluded } from './pricing';
import { CLOSE_MIN, generateSlots, groupByPeriod, OPEN_MIN, periodOf, withOwnBookings } from './slots';
import { createShares, expireSplit, payRemaining, payShare, splitAmounts } from './split';

describe('format', () => {
  it('formats 12h clock times in both languages, wrapping past midnight', () => {
    expect(clockTime(21 * 60, 'ar')).toBe('9:00 م');
    expect(clockTime(21 * 60 + 30, 'en')).toBe('9:30 PM');
    expect(clockTime(24 * 60 + 30, 'en')).toBe('12:30 AM');
    expect(clockTime(12 * 60, 'en')).toBe('12:00 PM');
    expect(timeRange(23 * 60 + 30, 90, 'en')).toBe('11:30 PM – 1:00 AM');
  });

  it('builds consecutive days across month ends', () => {
    expect(nextDays('2026-01-30', 3)).toEqual(['2026-01-30', '2026-01-31', '2026-02-01']);
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('labels today, tonight and tomorrow', () => {
    expect(dayLabel('2026-11-08', '2026-11-08', 'ar')).toBe('اليوم');
    expect(dayLabel('2026-11-08', '2026-11-08', 'ar', 21 * 60)).toBe('الليلة');
    expect(dayLabel('2026-11-09', '2026-11-08', 'en')).toBe('Tomorrow');
  });
});

describe('slots', () => {
  const query = { clubId: 'sadara', courtId: 'court-1', date: '2026-11-10', duration: 90 as const };

  it('is deterministic for the same court, date and duration', () => {
    expect(generateSlots(query)).toEqual(generateSlots(query));
  });

  it('runs back to back inside opening hours', () => {
    for (const duration of [60, 90, 120] as const) {
      const slots = generateSlots({ ...query, duration });
      expect(slots[0].start).toBe(OPEN_MIN);
      slots.forEach((s, i) => {
        expect(s.start + duration).toBeLessThanOrEqual(CLOSE_MIN);
        if (i > 0) expect(s.start - slots[i - 1].start).toBe(duration);
      });
    }
  });

  it('marks some slots booked but not all', () => {
    const all = nextDays('2026-11-10', 14).flatMap((date) => generateSlots({ ...query, date, duration: 60 }));
    const booked = all.filter((s) => s.booked).length;
    expect(booked).toBeGreaterThan(0);
    expect(booked).toBeLessThan(all.length);
  });

  it('hides starts that already passed today', () => {
    const slots = generateSlots({ ...query, nowMin: 20 * 60 });
    expect(slots.every((s) => s.start > 20 * 60)).toBe(true);
  });

  it("blocks slots that overlap the user's own bookings", () => {
    const free = generateSlots({ ...query, duration: 60 }).map((s) => ({ ...s, booked: false }));
    const marked = withOwnBookings(free, 60, [{ start: 18 * 60 + 30, duration: 90 }]);
    expect(marked.filter((s) => s.booked).map((s) => s.start)).toEqual([18 * 60, 19 * 60]);
  });

  it('groups by period in order', () => {
    expect(periodOf(16 * 60)).toBe('afternoon');
    expect(periodOf(20 * 60)).toBe('evening');
    expect(periodOf(24 * 60)).toBe('late');
    expect(groupByPeriod(generateSlots({ ...query, duration: 60 })).map((g) => g.period)).toEqual(['afternoon', 'evening', 'late']);
  });
});

describe('pricing', () => {
  const club = CLUBS.find((c) => c.id === 'sadara')!;

  it('adds extras to the duration price', () => {
    const extras = { rackets: 2, balls: true, water: false };
    expect(extrasTotal(extras)).toBe(2 * EXTRA_PRICES.racket + EXTRA_PRICES.balls);
    expect(bookingTotal(club, 90, extras)).toBe(club.prices[90] + extrasTotal(extras));
    expect(bookingTotal(club, 60, NO_EXTRAS)).toBe(club.prices[60]);
  });

  it('extracts the 15% VAT from an inclusive price', () => {
    expect(vatIncluded(115)).toBe(15);
    expect(vatIncluded(240)).toBe(31.3);
  });
});

describe('split bill', () => {
  it('shares always add up to the total, remainder on the owner', () => {
    for (const total of [100, 213, 245, 288, 99.99]) {
      for (const players of [2, 3, 4]) {
        const shares = splitAmounts(total, players);
        expect(Math.round(shares.reduce((a, b) => a + b, 0) * 100)).toBe(Math.round(total * 100));
        expect(shares[0]).toBeGreaterThanOrEqual(shares[1]);
      }
    }
    expect(splitAmounts(100, 3)).toEqual([33.34, 33.33, 33.33]);
  });

  const booking = (): Booking => ({
    id: 'b',
    code: 'AP-1',
    clubId: 'sadara',
    courtId: 'court-1',
    date: '2026-11-10',
    start: 20 * 60,
    duration: 90,
    extras: NO_EXTRAS,
    total: 240,
    method: 'mada',
    status: 'awaitingPartners',
    split: { shares: createShares(240, 3), deadline: 1000 },
    createdAt: 0,
  });

  it('only the owner has paid at checkout', () => {
    expect(booking().split!.shares.map((s) => s.paid)).toEqual([true, false, false]);
  });

  it('confirms when the last partner pays', () => {
    const one = payShare(booking(), 'share-1');
    expect(one.status).toBe('awaitingPartners');
    expect(payShare(one, 'share-2').status).toBe('confirmed');
  });

  it('owner paying the rest confirms and marks covered shares', () => {
    const done = payRemaining(booking());
    expect(done.status).toBe('confirmed');
    expect(done.split!.shares.filter((s) => s.coveredByOwner).map((s) => s.id)).toEqual(['share-1', 'share-2']);
  });

  it('expires after the deadline: cancelled and refunded', () => {
    expect(expireSplit(booking(), 999).status).toBe('awaitingPartners');
    const expired = expireSplit(booking(), 1000);
    expect(expired.status).toBe('cancelled');
    expect(expired.refunded).toBe(true);
  });

  it('does not expire a completed split', () => {
    expect(expireSplit(payRemaining(booking()), 5000).status).toBe('confirmed');
  });
});
