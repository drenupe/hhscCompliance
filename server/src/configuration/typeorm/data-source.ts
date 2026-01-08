// api/src/configuration/typeorm/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path, { resolve as resolvePath } from 'node:path';
import { config as dotenvConfig } from 'dotenv';

// Load env from api/.env (and let ConfigModule also see it)
dotenvConfig({ path: resolvePath(process.cwd(), 'server/.env') });

const root = process.cwd();
const url = process.env.DATABASE_URL ?? '';

const sslOn =
  /[?&]sslmode=require/i.test(url) ||
  String(process.env.DB_SSL ?? '').toLowerCase() === 'true';

const caEnv = process.env.PG_CA_CERT ?? '';
const ca = caEnv.replace(/\\n/g, '\n').trim();
const baseSsl: any = ca ? { ca } : { rejectUnauthorized: false };

export default new DataSource({
  type: 'postgres',
  url,
  ssl: sslOn ? baseSsl : false,

  // Use entities from the *source* when running with ts-node
  entities: [path.resolve(root, 'apps/server/src/app/**/*.entity.{ts,js}')],

  // Raw TS migrations when running via ts-node (your script uses TS_NODE_PROJECT)
  migrations: [path.resolve(root, 'server/migrations/*.{ts,js}')],

  // Optional logging while debugging migrations
  // logging: ['error', 'warn', 'schema', 'migration'],
});
