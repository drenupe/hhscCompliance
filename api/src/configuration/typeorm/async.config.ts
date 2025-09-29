// api/src/configuration/typeorm/async.config.ts
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService): Promise<TypeOrmModuleOptions> => {
    const nodeEnv = String(cfg.get('NODE_ENV') ?? 'development').toLowerCase();

    // Prefer DATABASE_URL, with fallback to discrete params
    const url = cfg.get<string>('database.url') ?? cfg.get<string>('DATABASE_URL') ?? '';
    const useUrl = url.length > 0;

    // SSL logic: DB_SSL=true or URL contains sslmode=require
    const sslFlag =
      String(cfg.get('DB_SSL') ?? '').toLowerCase() === 'true' ||
      (useUrl && url.toLowerCase().includes('sslmode=require'));

    // CA certificate: PG_CA_CERT (inline content) or api/ca.pem
    let ca: string | undefined = cfg.get('PG_CA_CERT') ?? undefined;
    if (!ca) {
      const caPath = resolve(process.cwd(), 'api/ca.pem');
      if (existsSync(caPath)) {
        ca = readFileSync(caPath, 'utf8');
      }
    }
    const baseSsl =
      ca && ca.trim().length > 0
        ? { ca: ca.replace(/\\n/g, '\n') }
        : { rejectUnauthorized: false }; // render/vercel often need this

    const base: Partial<TypeOrmModuleOptions> = {
      type: 'postgres',
      autoLoadEntities: true,
      // safe default: sync in dev only
      synchronize: nodeEnv === 'development',
      // logging level by env
      logging: nodeEnv === 'production' ? ['error'] : ['error', 'warn'],
      // Node pg extras
      extra: {
        ...(sslFlag ? { ssl: baseSsl } : {}),
        keepAlive: true,
        connectionTimeoutMillis: 10_000,
        idle_in_transaction_session_timeout: 30_000,
      },
      // Migrations (when compiled)
      migrations: ['dist/api/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
    };

    const discrete = {
      host: cfg.get('database.host') ?? cfg.get('DB_HOST') ?? 'localhost',
      port: parseInt(String(cfg.get('database.port') ?? cfg.get('DB_PORT') ?? '5432'), 10),
      username: cfg.get('database.user') ?? cfg.get('DB_USER') ?? 'postgres',
      password: cfg.get('database.pass') ?? cfg.get('DB_PASS') ?? 'postgres',
      database: cfg.get('database.name') ?? cfg.get('DB_NAME') ?? 'postgres',
    };

    return {
      ...base,
      ...(useUrl ? { url } : discrete),
      ssl: sslFlag ? baseSsl : false,
    } as TypeOrmModuleOptions;
  },
};
