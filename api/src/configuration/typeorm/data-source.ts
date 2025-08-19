// api/src/configuration/typeorm/data-source.ts
import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'node:path';

const url = process.env.DATABASE_URL ?? '';
const sslOn =
  /[?&]sslmode=require/i.test(url) ||
  String(process.env.DB_SSL ?? '').toLowerCase() === 'true';
const ca = (process.env.PG_CA_CERT ?? '').replace(/\\n/g, '\n');
const baseSsl = ca ? { ca } : ({ rejectUnauthorized: false } as any);

// Resolve from repo root so it works in ESM/CJS/ts-node
const root = process.cwd();

export default new DataSource({
  type: 'postgres',
  url,
  ssl: sslOn ? baseSsl : false,
  entities: [path.resolve(root, 'api/src/app/**/*.entity.{ts,js}')],
  migrations: [path.resolve(root, 'api/migrations/*.{ts,js}')],
});
