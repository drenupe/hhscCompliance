// apps/api/src/typeorm-cli.datasource.ts  (or wherever your CLI DS lives)
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { config } from 'dotenv';

// Load the first env file we find (api → apps/api → repo root)
const candidates = [
  'api/.env.local',
  `api/.env.${process.env.NODE_ENV}.local`,
  `api/.env.${process.env.NODE_ENV}`,
  'api/.env',
  'apps/api/.env.local',
  `apps/api/.env.${process.env.NODE_ENV}.local`,
  `apps/api/.env.${process.env.NODE_ENV}`,
  'apps/api/.env',
  `.env.${process.env.NODE_ENV}.local`,
  `.env.${process.env.NODE_ENV}`,
  '.env',
];

for (const rel of candidates) {
  const file = resolve(process.cwd(), rel);
  if (existsSync(file)) {
    config({ path: file });
    break;
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is required for migrations. Check your env files.');
}

// SSL handling
const sslFlag = String(process.env.DB_SSL ?? '').toLowerCase();
const urlWantsSsl = /[?&]sslmode=(require|verify-ca|verify-full)/i.test(url);
const sslOn = urlWantsSsl || ['1', 'true', 'require', 'yes'].includes(sslFlag);

const ca = (process.env.PG_CA_CERT ?? '').replace(/\\n/g, '\n').trim();
const ssl = sslOn ? (ca ? { ca } : { rejectUnauthorized: false }) : false;

const root = process.cwd();
const entities = [
  resolve(root, 'api/src/app/**/*.entity.{ts,js}'),
  resolve(root, 'apps/api/src/app/**/*.entity.{ts,js}'),
];
const migrations = [
  resolve(root, 'api/migrations/*.{ts,js}'),
  resolve(root, 'apps/api/src/migrations/*.{ts,js}'),
];

export default new DataSource({
  type: 'postgres',
  url,
  ssl,
  entities,
  migrations,
  migrationsTableName: 'typeorm_migrations',
  // Never use synchronize for CLI migrations
  synchronize: false,
  logging: false,
});
