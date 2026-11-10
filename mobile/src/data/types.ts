import type { ImageSource } from 'expo-image';

import type { Localized } from '@/i18n';

export type CityId = 'riyadh' | 'jeddah' | 'khobar';
export type ClubFeature = 'ac' | 'indoor' | 'outdoor';
export type Duration = 60 | 90 | 120;

export type Court = {
  id: string;
  name: Localized;
  feature: Exclude<ClubFeature, 'ac'>;
};

/** Glass badge on the club photo. `icon` is a MaterialIcons name. */
export type ClubBadge = { icon?: string; label: Localized; tone: 'cyan' | 'volt' };

export type Club = {
  id: string;
  name: Localized;
  district: Localized;
  city: CityId;
  image: ImageSource;
  rating: number;
  reviews: number;
  distanceKm: number;
  features: ClubFeature[];
  badges: ClubBadge[];
  amenities: Localized[];
  /** Today's next free start times, 24h "HH:mm". The first one is highlighted. */
  nextSlots: string[];
  courts: Court[];
  address: Localized;
  /** Fictional number (555 range). */
  phone: string;
  facilities: Facility[];
  specs: CourtSpecs;
  testimonials: Review[];
  /** Price per booking in SAR, VAT included. */
  prices: Record<Duration, number>;
};

export type Facility = { icon: string; label: Localized };

/** Court standard shown on the club page (shared by the club's courts). */
export type CourtSpecs = { lux: number; surface: Localized; heightM: number; recording: boolean };

export type Review = { name: Localized; initials: Localized; rating: number; when: Localized; text: Localized };

/** Booking add-ons. */
export type Extras = { rackets: number; balls: boolean; water: boolean };

export type PaymentMethod = 'mada' | 'applepay' | 'stcpay' | 'venue';
export type BookingStatus = 'confirmed' | 'pending' | 'awaitingPartners' | 'cancelled';

export type SplitShare = {
  id: string;
  name: Localized;
  initials: Localized;
  amount: number;
  paid: boolean;
  owner: boolean;
  /** Paid by the owner on the partner's behalf ("pay the rest"). */
  coveredByOwner?: boolean;
};

export type Booking = {
  id: string;
  /** Short code shown on the pass, e.g. "AP-4821". */
  code: string;
  clubId: string;
  courtId: string;
  /** "YYYY-MM-DD", local. */
  date: string;
  /** Minutes from the date's midnight (≥ 1440 = after midnight). */
  start: number;
  duration: Duration;
  extras: Extras;
  /** SAR, VAT included. */
  total: number;
  method: PaymentMethod;
  status: BookingStatus;
  split?: { shares: SplitShare[]; deadline: number };
  /** Cancelled split where someone had paid: their money is on its way back. */
  refunded?: boolean;
  createdAt: number;
};
