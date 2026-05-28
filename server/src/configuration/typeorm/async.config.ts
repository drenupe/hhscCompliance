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
      cfg.get('env') ?? cfg.get('NODE_ENV') ?? 'development'
    ).toLowerCase();

    const urlFromCfg = String(cfg.get<string>('database.url') ?? '').trim();
    const urlFromEnv = String(cfg.get<string>('DATABASE_URL') ?? '').trim();

    const url = urlFromCfg.length > 0 ? urlFromCfg : urlFromEnv;
    const useUrl = url.length > 0;

    const sslFromUrl = /[?&]sslmode=require/i.test(url);
    const sslFromEnv =
      /^true$/i.test(String(cfg.get('DB_SSL') ?? '')) ||
      nodeEnv === 'staging' ||
      nodeEnv === 'production';

    const sslOn = Boolean(sslFromUrl || sslFromEnv);

    const caInline =
      cfg.get<string>('database.caCert') ?? cfg.get<string>('PG_CA_CERT');

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

    const discrete = {
      host: cfg.get<string>('database.host') ?? cfg.get<string>('DB_HOST') ?? 'localhost',
      port: parseInt(
        String(cfg.get('database.port') ?? cfg.get('DB_PORT') ?? '5432'),
        10
      ),
      username:
        cfg.get<string>('database.user') ?? cfg.get<string>('DB_USER') ?? 'postgres',
      password:
        cfg.get<string>('database.pass') ?? cfg.get<string>('DB_PASS') ?? 'postgres',
      database:
        cfg.get<string>('database.name') ?? cfg.get<string>('DB_NAME') ?? 'postgres',
    };

    console.log(
      `[DB] env=${nodeEnv} mode=${useUrl ? 'url' : 'discrete'} sslOn=${sslOn} host=${
        useUrl ? '(from url)' : String(discrete.host)
      }`
    );

    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      ssl: sslConfig,

      extra: {
        keepAlive: true,
        connectionTimeoutMillis: 10_000,
        statement_timeout: 30_000,
        query_timeout: 30_000,
      },

      migrations: [resolve(process.cwd(), 'dist/api/migrations/*.js')],

      ...(useUrl ? { url } : discrete),
    };

    return options;
  },
};