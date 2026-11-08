import type { Booking, SplitShare } from '@/data/types';
import type { Localized } from '@/i18n';

export const SPLIT_PLAYER_OPTIONS = [2, 3, 4] as const;
/** Partners have one hour to pay before the booking is cancelled and refunded. */
export const SPLIT_WINDOW_MS = 60 * 60 * 1000;

/** Partner names used for the shares (the owner is always the signed-in user). */
const PARTNERS: { name: Localized; initials: Localized }[] = [
  { name: { ar: 'طارق', en: 'Tariq' }, initials: { ar: 'ط', en: 'TA' } },
  { name: { ar: 'سلمان', en: 'Salman' }, initials: { ar: 'س', en: 'SA' } },
  { name: { ar: 'خالد', en: 'Khalid' }, initials: { ar: 'خ', en: 'KH' } },
];
const OWNER = { name: { ar: 'فهد', en: 'Fahad' }, initials: { ar: 'ف', en: 'FA' } };

/**
 * Equal shares in halalas. The remainder halalas go to the owner, so the shares always add up
 * to the total exactly. Index 0 is the owner.
 */
export function splitAmounts(total: number, players: number): number[] {
  const halalas = Math.round(total * 100);
  const base = Math.floor(halalas / players);
  const remainder = halalas - base * players;
  return Array.from({ length: players }, (_, i) => (i === 0 ? base + remainder : base) / 100);
}

/** Shares for a new split booking: the owner's share is paid at checkout. */
export function createShares(total: number, players: number): SplitShare[] {
  return splitAmounts(total, players).map((amount, i) => {
    const who = i === 0 ? OWNER : PARTNERS[i - 1];
    return { id: `share-${i}`, ...who, amount, paid: i === 0, owner: i === 0 };
  });
}

export function paidAmount(shares: SplitShare[]): number {
  return Math.round(shares.filter((s) => s.paid).reduce((sum, s) => sum + s.amount * 100, 0)) / 100;
}

export function unpaidShares(shares: SplitShare[]): SplitShare[] {
  return shares.filter((s) => !s.paid);
}

/** Marks a share paid; completes the booking when it was the last one. */
export function payShare(booking: Booking, shareId: string): Booking {
  if (!booking.split || booking.status !== 'awaitingPartners') return booking;
  const shares = booking.split.shares.map((s) => (s.id === shareId ? { ...s, paid: true } : s));
  const complete = shares.every((s) => s.paid);
  return { ...booking, status: complete ? 'confirmed' : booking.status, split: { ...booking.split, shares } };
}

/** The owner covers everyone still unpaid: the booking is confirmed. */
export function payRemaining(booking: Booking): Booking {
  if (!booking.split || booking.status !== 'awaitingPartners') return booking;
  const shares = booking.split.shares.map((s) => ({ ...s, paid: true, coveredByOwner: s.paid ? s.coveredByOwner : true }));
  return { ...booking, status: 'confirmed', split: { ...booking.split, shares } };
}

/** Deadline passed with unpaid shares: cancelled, and whoever paid gets refunded. */
export function expireSplit(booking: Booking, now: number): Booking {
  if (!booking.split || booking.status !== 'awaitingPartners' || now < booking.split.deadline) return booking;
  return { ...booking, status: 'cancelled', refunded: paidAmount(booking.split.shares) > 0 };
}
