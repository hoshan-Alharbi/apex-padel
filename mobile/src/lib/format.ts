import type { Lang } from '@/i18n';

/** Calendar day in local time, "YYYY-MM-DD". */
export type DateKey = string;

// Gregorian names as used in Saudi apps. Digits stay Latin, like the rest of the UI.
const WEEKDAYS: Record<Lang, string[]> = {
  ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
const MONTHS: Record<Lang, string[]> = {
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
/** Calendar column headers, Sunday first (the Saudi week). */
const WEEKDAY_INITIALS: Record<Lang, string[]> = {
  ar: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};
const DAY_WORDS: Record<Lang, { today: string; tonight: string; tomorrow: string }> = {
  ar: { today: 'اليوم', tonight: 'الليلة', tomorrow: 'بكرة' },
  en: { today: 'Today', tonight: 'Tonight', tomorrow: 'Tomorrow' },
};
const MERIDIEM: Record<Lang, [string, string]> = { ar: ['ص', 'م'], en: ['AM', 'PM'] };

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(d: Date): DateKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Local midnight of a DateKey. */
export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: DateKey, days: number): DateKey {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

/** `count` consecutive days starting at `from`. */
export function nextDays(from: DateKey, count: number): DateKey[] {
  return Array.from({ length: count }, (_, i) => addDays(from, i));
}

export function weekdayName(key: DateKey, lang: Lang): string {
  return WEEKDAYS[lang][fromDateKey(key).getDay()];
}

export function weekdayInitials(lang: Lang): string[] {
  return WEEKDAY_INITIALS[lang];
}

/** 0 = Sunday. */
export function weekdayIndex(key: DateKey): number {
  return fromDateKey(key).getDay();
}

export function monthName(key: DateKey, lang: Lang): string {
  return MONTHS[lang][fromDateKey(key).getMonth()];
}

export function dayOfMonth(key: DateKey): number {
  return fromDateKey(key).getDate();
}

/** Minutes from the booking day's midnight. Values ≥ 1440 are after midnight (late slots). */
export function clockTime(minutes: number, lang: Lang): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${pad(m % 60)} ${MERIDIEM[lang][h24 < 12 ? 0 : 1]}`;
}

/** "9:00 م – 11:00 م" */
export function timeRange(start: number, durationMin: number, lang: Lang): string {
  return `${clockTime(start, lang)} – ${clockTime(start + durationMin, lang)}`;
}

/** "HH:mm" (24h) → minutes. */
export function parseClock(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** "اليوم" / "بكرة" / "الخميس 24 أكتوبر". `start` turns today's evening into "الليلة". */
export function dayLabel(key: DateKey, today: DateKey, lang: Lang, start?: number): string {
  const words = DAY_WORDS[lang];
  if (key === today) return start !== undefined && start >= 18 * 60 ? words.tonight : words.today;
  if (key === addDays(today, 1)) return words.tomorrow;
  return `${weekdayName(key, lang)} ${dayOfMonth(key)} ${monthName(key, lang)}`;
}

/** Full date: "الخميس 24 أكتوبر 2026". */
export function longDate(key: DateKey, lang: Lang): string {
  return `${weekdayName(key, lang)} ${dayOfMonth(key)} ${monthName(key, lang)} ${fromDateKey(key).getFullYear()}`;
}

/** Riyal amounts: whole numbers stay whole, otherwise two decimals. */
export function money(amount: number): string {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}
