/// <reference types="jest" />
import { useI18n } from '@/i18n';
import { ar, en } from '@/i18n/strings';

const keysOf = (obj: object, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) => (typeof v === 'object' ? keysOf(v, `${prefix}${k}.`) : [`${prefix}${k}`]));

describe('strings', () => {
  it('English has exactly the same keys as Arabic', () => {
    expect(keysOf(en).sort()).toEqual(keysOf(ar).sort());
  });
});

describe('i18n helpers', () => {
  const { format, plural } = useI18n();

  it('formats placeholders', () => {
    expect(format('أندية في {city}', { city: 'جدة' })).toBe('أندية في جدة');
  });

  it('uses Arabic plural forms', () => {
    expect(plural(ar.home.clubCount, 1)).toBe('نادي واحد');
    expect(plural(ar.home.clubCount, 2)).toBe('ناديين');
    expect(plural(ar.home.clubCount, 3)).toBe('3 أندية');
    expect(plural(ar.home.clubCount, 11)).toBe('11 نادي');
  });
});
