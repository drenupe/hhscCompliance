// apps/api/src/config/typeorm/development.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const sslOn =
  (process.env.DB_SSL ?? '').toLowerCase() === 'true' ||
  (process.env.DATABASE_URL ?? '').toLowerCase().includes('sslmode=require');

const baseSsl =
  process.env.PG_CA_CERT && process.env.PG_CA_CERT.trim().length > 0
    ? { ca: process.env.PG_CA_CERT.replace(/\\n/g, '\n') }
    : { rejectUnauthorized: false };

export default {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,

  // Safe for local dev, but keep false in prod configs
  synchronize: true,

  ssl: sslOn ? baseSsl : false,
  extra: sslOn ? { ssl: baseSsl } : undefined,
} as TypeOrmModuleOptions;
