// apps/api/src/config/typeorm/async.config.ts
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TlsOptions } from 'node:tls';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService): Promise<TypeOrmModuleOptions> => {
    const nodeEnv = String(
      cfg.get('env') ?? cfg.get('NODE_ENV') ?? 'development',
    ).toLowerCase();

    const url =
      cfg.get<string>('database.url') ??
      cfg.get<string>('DATABASE_URL') ??
      '';

    const useUrl = url.length > 0;

    // SSL toggle from config/env or sslmode=require in the URL
    const dbSslFlag =
      (cfg.get<boolean>('database.ssl') as boolean | undefined) ??
      /^true$/i.test(String(cfg.get('DB_SSL') ?? ''));
    const sslFromUrl = /[?&]sslmode=require/i.test(url);
    const sslOn = Boolean(dbSslFlag || sslFromUrl);

    // CA: inline or file path
    const caInline =
      cfg.get<string>('database.caCert') ??
      cfg.get<string>('PG_CA_CERT');
    const caPath =
      cfg.get<string>('database.caCertPath') ??
      cfg.get<string>('PG_CA_CERT_PATH');

    let caPem: string | undefined;
    if (caInline) {
      caPem = caInline.replace(/\\n/g, '\n').trim();
    } else if (caPath && existsSync(caPath)) {
      caPem = readFileSync(caPath, 'utf8');
    }

    const sslConfig: boolean | TlsOptions = sslOn
      ? caPem
        ? { rejectUnauthorized: true, ca: caPem }
        : { rejectUnauthorized: false }
      : false;

    const base: TypeOrmModuleOptions = {
      type: 'postgres',
      autoLoadEntities: true,

      // ✅ Important: use migrations only (no runtime schema sync)
      synchronize: false,

      ssl: sslConfig,
      extra: {
        ...(sslOn ? { ssl: sslConfig } : {}),
        keepAlive: true,
        connectionTimeoutMillis: 10_000,
        statement_timeout: 30_000,
        query_timeout: 30_000,
      },

      // For programmatic migration runs (if you ever call dataSource.runMigrations())
      migrations: [resolve(process.cwd(), 'dist/api/migrations/*.js')],
    };

    const discrete = {
      host: cfg.get('database.host') ?? cfg.get('DB_HOST') ?? 'localhost',
      port: parseInt(
        String(cfg.get('database.port') ?? cfg.get('DB_PORT') ?? '5432'),
        10,
      ),
      username: cfg.get('database.user') ?? cfg.get('DB_USER') ?? 'postgres',
      password: cfg.get('database.pass') ?? cfg.get('DB_PASS') ?? 'postgres',
      database: cfg.get('database.name') ?? cfg.get('DB_NAME') ?? 'postgres',
    };

    return {
      ...base,
      ...(useUrl ? { url } : discrete),
    };
  },
};
