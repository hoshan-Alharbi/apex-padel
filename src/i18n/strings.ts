// UI copy for both languages, one file per language. `ar` is the source of truth for keys.
import { ar } from './ar';

type Shape<T> = { [K in keyof T]: T[K] extends string ? string : Shape<T[K]> };
export type Strings = Shape<typeof ar>;

export { ar };
export { en } from './en';
