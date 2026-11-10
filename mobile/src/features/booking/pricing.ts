import type { Club, Duration, Extras } from '@/data/types';

/** Add-on prices in SAR (VAT included). */
export const EXTRA_PRICES = { racket: 35, balls: 25, water: 18 } as const;
export const MAX_RACKETS = 4;
export const VAT_RATE = 0.15;

export const NO_EXTRAS: Extras = { rackets: 0, balls: false, water: false };

export function extrasTotal(extras: Extras): number {
  return extras.rackets * EXTRA_PRICES.racket + (extras.balls ? EXTRA_PRICES.balls : 0) + (extras.water ? EXTRA_PRICES.water : 0);
}

export function bookingTotal(club: Club, duration: Duration, extras: Extras): number {
  return club.prices[duration] + extrasTotal(extras);
}

/** VAT already inside a VAT-inclusive amount, rounded to halalas. */
export function vatIncluded(total: number): number {
  return Math.round((total * VAT_RATE * 100) / (1 + VAT_RATE)) / 100;
}
