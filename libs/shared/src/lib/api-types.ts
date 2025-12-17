// libs/shared/src/lib/api-types.ts

export type ISODate = string; // 'YYYY-MM-DD'
export type ISODateTime = string; // server timestamp string
export type TimeHHMM = string; // 'HH:mm'
export type RatioString = string; // '2:5'

/**
 * JSONB / Angular form-safe JSON typing
 *
 * Why `undefined` is included:
 * - Optional properties in TS are `T | undefined`
 * - Angular forms often omit keys until touched
 * - JSON stringify drops `undefined` anyway, but TS must allow it
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface JsonBlob {
  [key: string]: JsonValue;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}
