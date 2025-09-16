// api/src/app/_shared/db-types.ts
import type { ColumnType } from 'typeorm';

const IS_TEST = process.env.NODE_ENV === 'test';

// Cross-DB column types
export const IP_ADDR: ColumnType = IS_TEST ? 'text' : 'inet';
export const JSON_ANY: ColumnType = IS_TEST ? 'simple-json' : 'jsonb';
// Use generic names so TypeORM picks the right native type
export const TSTZ: ColumnType = IS_TEST ? 'datetime' : ('timestamptz' as any);

// Cross-DB default NOW expression
export const NOW_SQL = 'CURRENT_TIMESTAMP';