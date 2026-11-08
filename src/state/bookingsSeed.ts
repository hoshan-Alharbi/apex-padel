import type { Booking } from '@/data/types';
import { createShares } from '@/features/booking/split';
import { addDays, toDateKey } from '@/lib/format';

/**
 * Bookings the app starts with (in memory, UI-only phase), relative to `now` so the demo
 * always has one live split booking, one upcoming and two past ones.
 */
export function seedBookings(now: Date): Booking[] {
  const today = toDateKey(now);
  const created = now.getTime();
  // Tonight at 9 if there's still time, otherwise tomorrow night.
  const splitDate = now.getHours() < 20 ? today : addDays(today, 1);
  const shares = createShares(220, 4).map((s) => (s.id === 'share-1' || s.id === 'share-2' ? { ...s, paid: true } : s));

  return [
    {
      id: 'bk-seed-split',
      code: 'AP-4821',
      clubId: 'sadara',
      courtId: 'court-3',
      date: splitDate,
      start: 21 * 60,
      duration: 120,
      extras: { rackets: 0, balls: false, water: false },
      total: 220,
      method: 'mada',
      status: 'awaitingPartners',
      split: { shares, deadline: created + 45 * 60 * 1000 },
      createdAt: created - 15 * 60 * 1000,
    },
    {
      id: 'bk-seed-arena',
      code: 'AP-5307',
      clubId: 'arena',
      courtId: 'court-2',
      date: addDays(today, 3),
      start: 20 * 60,
      duration: 90,
      extras: { rackets: 2, balls: false, water: true },
      total: 288,
      method: 'applepay',
      status: 'confirmed',
      createdAt: created - 2 * 86400000,
    },
    {
      id: 'bk-seed-rimal',
      code: 'AP-3914',
      clubId: 'rimal',
      courtId: 'court-1',
      date: addDays(today, -5),
      start: 21 * 60,
      duration: 60,
      extras: { rackets: 0, balls: false, water: false },
      total: 100,
      method: 'venue',
      status: 'confirmed',
      createdAt: created - 7 * 86400000,
    },
    {
      id: 'bk-seed-sadara-past',
      code: 'AP-2276',
      clubId: 'sadara',
      courtId: 'court-1',
      date: addDays(today, -12),
      start: 22 * 60 + 30,
      duration: 90,
      extras: { rackets: 0, balls: true, water: true },
      total: 213,
      method: 'stcpay',
      status: 'confirmed',
      createdAt: created - 14 * 86400000,
    },
  ];
}
