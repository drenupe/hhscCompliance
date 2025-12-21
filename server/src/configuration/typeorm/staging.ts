import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const nodeEnv = process.env.NODE_ENV ?? 'staging';
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

  // Never sync in staging; run migrations automatically on boot
  synchronize: false,
  migrationsRun: true,

  // TLS in both places (pg quirk)
  ssl: sslOn ? baseSsl : false,
  extra: {
    ...(sslOn ? { ssl: baseSsl } : {}),
    keepAlive: true,
    connectionTimeoutMillis: 10_000,
    idle_in_transaction_session_timeout: 30_000,
  },

  // Migrations compiled to dist when building
  migrations: ['dist/apps/api/migrations/*.js'],

  // Quieter logs on staging
  logging: ['error', 'warn'],
};

export default config;
