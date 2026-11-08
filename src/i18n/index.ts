import { I18nManager } from 'react-native';

import { ar, en, type Strings } from './strings';

export type Lang = 'ar' | 'en';
export type Localized = Record<Lang, string>;
export type PluralForms = { one: string; two: string; few: string; many: string };

// Layout direction is owned by React Native (device / per-app language in Expo Go),
// so the UI language follows it. An in-app switch is planned for part 0.4.
const lang: Lang = I18nManager.isRTL ? 'ar' : 'en';
const strings: Strings = lang === 'ar' ? ar : en;

function format(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

// Arabic needs dual and 3–10 forms; English only uses one/many.
function pluralForm(n: number): keyof PluralForms {
  if (n === 1) return 'one';
  if (n === 2) return 'two';
  if (n >= 3 && n <= 10) return 'few';
  return 'many';
}

const i18n = {
  lang,
  isRTL: lang === 'ar',
  s: strings,
  format,
  plural: (forms: PluralForms, n: number) => format(forms[pluralForm(n)], { n }),
  pick: (value: Localized) => value[lang],
};

export type I18n = typeof i18n;

export function useI18n(): I18n {
  return i18n;
}
