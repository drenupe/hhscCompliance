import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: false, // NEVER true in production
  ssl: {
    rejectUnauthorized: false, // Render, Railway, Supabase, etc.
  },
  logging: true, // Optional: enable SQL logging for diagnostics
  migrationsRun: true, // Optional: run pending migrations on startup
} as TypeOrmModuleOptions;
