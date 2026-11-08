import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';

import type { Booking, Duration, Extras, PaymentMethod } from '@/data/types';
import { createShares, expireSplit, payRemaining, payShare, SPLIT_WINDOW_MS } from '@/features/booking/split';

import { seedBookings } from './bookingsSeed';

/** "Pay at the club" requests get confirmed by the club after this long (simulated). */
export const PENDING_CONFIRM_MS = 8000;

/** What the user picked on the booking screen, carried to checkout. */
export type BookingDraft = {
  clubId: string;
  courtId: string;
  date: string;
  start: number;
  duration: Duration;
  extras: Extras;
  total: number;
};

type Action = { type: 'add'; booking: Booking } | { type: 'update'; id: string; change: (b: Booking) => Booking };

function reducer(state: Booking[], action: Action): Booking[] {
  switch (action.type) {
    case 'add':
      return [action.booking, ...state];
    case 'update':
      return state.map((b) => (b.id === action.id ? action.change(b) : b));
  }
}

type BookingsValue = {
  bookings: Booking[];
  getBooking: (id: string) => Booking | undefined;
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft | null) => void;
  /** Turns the draft into a booking. `splitPlayers` > 1 starts a split (owner pays their share). */
  checkout: (draft: BookingDraft, method: PaymentMethod, splitPlayers: number) => Booking;
  payShare: (bookingId: string, shareId: string) => void;
  payRemaining: (bookingId: string) => void;
  /** Demo mode: move a split booking's deadline to `ms` from now. */
  setDeadlineIn: (bookingId: string, ms: number) => void;
};

const BookingsContext = createContext<BookingsValue | null>(null);

const newCode = () => `AP-${1000 + Math.floor(Math.random() * 9000)}`;

// In memory only (UI-only phase): resets to the seed on app restart.
export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, dispatch] = useReducer(reducer, undefined, () => seedBookings(new Date()));
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  // Simulated server side: the club confirms "pay at club" requests, and split deadlines expire.
  useEffect(() => {
    const timers = bookings.flatMap((b) => {
      if (b.status === 'pending') {
        const wait = Math.max(0, b.createdAt + PENDING_CONFIRM_MS - Date.now());
        return [setTimeout(() => dispatch({ type: 'update', id: b.id, change: (x) => (x.status === 'pending' ? { ...x, status: 'confirmed' } : x) }), wait)];
      }
      if (b.status === 'awaitingPartners' && b.split) {
        const wait = Math.max(0, b.split.deadline - Date.now());
        return [setTimeout(() => dispatch({ type: 'update', id: b.id, change: (x) => expireSplit(x, Date.now()) }), wait)];
      }
      return [];
    });
    return () => timers.forEach(clearTimeout);
  }, [bookings]);

  const checkout = useCallback((d: BookingDraft, method: PaymentMethod, splitPlayers: number): Booking => {
    const now = Date.now();
    const split = splitPlayers > 1 && method !== 'venue';
    const booking: Booking = {
      id: `bk-${now}`,
      code: newCode(),
      clubId: d.clubId,
      courtId: d.courtId,
      date: d.date,
      start: d.start,
      duration: d.duration,
      extras: d.extras,
      total: d.total,
      method,
      status: method === 'venue' ? 'pending' : split ? 'awaitingPartners' : 'confirmed',
      split: split ? { shares: createShares(d.total, splitPlayers), deadline: now + SPLIT_WINDOW_MS } : undefined,
      createdAt: now,
    };
    dispatch({ type: 'add', booking });
    return booking;
  }, []);

  const value = useMemo<BookingsValue>(
    () => ({
      bookings,
      getBooking: (id) => bookings.find((b) => b.id === id),
      draft,
      setDraft,
      checkout,
      payShare: (id, shareId) => dispatch({ type: 'update', id, change: (b) => payShare(b, shareId) }),
      payRemaining: (id) => dispatch({ type: 'update', id, change: payRemaining }),
      setDeadlineIn: (id, ms) =>
        dispatch({ type: 'update', id, change: (b) => (b.split ? { ...b, split: { ...b.split, deadline: Date.now() + ms } } : b) }),
    }),
    [bookings, draft, checkout],
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings(): BookingsValue {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used inside BookingsProvider');
  return ctx;
}
