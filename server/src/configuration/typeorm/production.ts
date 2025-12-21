import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const nodeEnv = process.env.NODE_ENV ?? 'production';
const url = process.env.DATABASE_URL ?? '';
const sslOn =
  (process.env.DB_SSL ?? '').toLowerCase() === 'true' ||
  url.toLowerCase().includes('sslmode=require');

const baseSsl =
  process.env.PG_CA_CERT && process.env.PG_CA_CERT.trim().length > 0
    ? { ca: process.env.PG_CA_CERT.replace(/\\n/g, '\n') }
    : { rejectUnauthorized: false };

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url,
  autoLoadEntities: true,

  // Absolutely no schema sync in prod
  synchronize: false,

  // Prefer running migrations in your CI/CD step; leave false here
  migrationsRun: false,

  ssl: sslOn ? baseSsl : false,
  extra: {
    ...(sslOn ? { ssl: baseSsl } : {}),
    keepAlive: true,
    connectionTimeoutMillis: 10_000,
    idle_in_transaction_session_timeout: 30_000,
  },

  migrations: ['dist/apps/api/migrations/*.js'],

  // Minimal logging for perf/security
  logging: ['error'],
};

export default config;
