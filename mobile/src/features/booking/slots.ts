import type { Duration } from '@/data/types';
import type { DateKey } from '@/lib/format';

/** Opening hours in minutes from the day's midnight: 4 PM to 2 AM. */
export const OPEN_MIN = 16 * 60;
export const CLOSE_MIN = 26 * 60;
export const DURATIONS: Duration[] = [60, 90, 120];
/** Share of slots shown as already booked. */
const BOOKED_PERCENT = 35;

export type Period = 'afternoon' | 'evening' | 'late';
export const PERIODS: Period[] = ['afternoon', 'evening', 'late'];

export type Slot = { start: number; period: Period; booked: boolean };

export function periodOf(start: number): Period {
  if (start < 19 * 60) return 'afternoon';
  if (start < 23 * 60) return 'evening';
  return 'late';
}

/** FNV-1a: a small stable hash so the same court/date/time is always booked or always free. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

type SlotQuery = {
  clubId: string;
  courtId: string;
  date: DateKey;
  duration: Duration;
  /** Minutes since midnight now, when `date` is today: earlier starts are hidden. */
  nowMin?: number;
};

/**
 * Back-to-back sessions of the chosen length between opening and closing time. Deterministic:
 * the same query always returns the same slots and the same booked ones.
 */
export function generateSlots({ clubId, courtId, date, duration, nowMin }: SlotQuery): Slot[] {
  const slots: Slot[] = [];
  for (let start = OPEN_MIN; start + duration <= CLOSE_MIN; start += duration) {
    if (nowMin !== undefined && start <= nowMin) continue;
    const booked = hash(`${clubId}|${courtId}|${date}|${start}|${duration}`) % 100 < BOOKED_PERCENT;
    slots.push({ start, period: periodOf(start), booked });
  }
  return slots;
}

/** Marks slots that overlap the user's own active bookings on the same court and date as booked. */
export function withOwnBookings(slots: Slot[], duration: Duration, own: { start: number; duration: number }[]): Slot[] {
  return slots.map((slot) =>
    !slot.booked && own.some((b) => slot.start < b.start + b.duration && b.start < slot.start + duration) ? { ...slot, booked: true } : slot,
  );
}

export function groupByPeriod(slots: Slot[]): { period: Period; slots: Slot[] }[] {
  return PERIODS.map((period) => ({ period, slots: slots.filter((s) => s.period === period) })).filter((g) => g.slots.length > 0);
}
