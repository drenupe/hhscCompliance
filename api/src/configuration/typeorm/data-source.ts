import 'reflect-metadata';
import { DataSource } from 'typeorm';

// This mirrors async.config.ts defaults
const nodeEnv = process.env.NODE_ENV ?? 'development';
const url = process.env.DATABASE_URL ?? '';
const sslOn =
  (process.env.DB_SSL ?? '').toLowerCase() === 'true' ||
  url.toLowerCase().includes('sslmode=require');

const ca =
  process.env.PG_CA_CERT && process.env.PG_CA_CERT.trim().length > 0
    ? process.env.PG_CA_CERT.replace(/\\n/g, '\n')
    : undefined;

export default new DataSource({
  type: 'postgres',
  ...(url ? { url } : {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'postgres',
    database: process.env.DB_NAME ?? 'postgres',
  }),
  ssl: sslOn ? (ca ? { ca } : { rejectUnauthorized: false }) : false,
  entities: ['dist/api/**/*.entity.js'],
  migrations: ['dist/api/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  logging: nodeEnv === 'production' ? ['error'] : ['error', 'warn'],
});
