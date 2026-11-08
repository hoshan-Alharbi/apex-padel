import { CLUBS } from '@/data/clubs';
import type { Booking, Club, Court } from '@/data/types';
import { fromDateKey } from '@/lib/format';

/** What a booking card shows: the stored status plus time-derived "completed" and "refunded". */
export type DisplayStatus = Booking['status'] | 'completed' | 'refunded';

export function startsAt(b: Pick<Booking, 'date' | 'start'>): number {
  return fromDateKey(b.date).getTime() + b.start * 60000;
}

export function endsAt(b: Pick<Booking, 'date' | 'start' | 'duration'>): number {
  return startsAt(b) + b.duration * 60000;
}

export function displayStatus(b: Booking, now: number): DisplayStatus {
  if (b.status === 'cancelled') return b.refunded ? 'refunded' : 'cancelled';
  if (endsAt(b) <= now && b.status === 'confirmed') return 'completed';
  return b.status;
}

const isActive = (b: Booking, now: number) => b.status !== 'cancelled' && endsAt(b) > now;

/** Not finished and not cancelled, soonest first. */
export function upcomingBookings(bookings: Booking[], now: number): Booking[] {
  return bookings.filter((b) => isActive(b, now)).sort((a, b) => startsAt(a) - startsAt(b));
}

/** Finished or cancelled, most recent first. */
export function pastBookings(bookings: Booking[], now: number): Booking[] {
  return bookings.filter((b) => !isActive(b, now)).sort((a, b) => startsAt(b) - startsAt(a));
}

export function clubOf(b: Pick<Booking, 'clubId'>): Club | undefined {
  return CLUBS.find((c) => c.id === b.clubId);
}

export function courtOf(b: Pick<Booking, 'clubId' | 'courtId'>): Court | undefined {
  return clubOf(b)?.courts.find((c) => c.id === b.courtId);
}

/** Players on the booking: split shares, or just the owner. */
export function playerCount(b: Booking): number {
  return b.split?.shares.length ?? 1;
}
