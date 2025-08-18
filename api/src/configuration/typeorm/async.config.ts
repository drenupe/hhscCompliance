// apps/api/src/config/typeorm/async.config.ts
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService) => {
    // Prefer nested keys from configuration(), fall back to raw env keys
    const nodeEnv = (cfg.get<string>('env') ?? cfg.get<string>('NODE_ENV') ?? 'development').toLowerCase();
    const url = cfg.get<string>('database.url') ?? cfg.get<string>('DATABASE_URL') ?? '';

    const dbSslFlag = cfg.get<boolean>('database.ssl') ?? (String(cfg.get('DB_SSL') ?? '').toLowerCase() === 'true');
    const sslFromUrl = /[?&]sslmode=require/i.test(url);
    const sslOn = dbSslFlag || sslFromUrl;

    // Optional CA cert (PEM). Supports literal newlines or 
    
    const caFromNested = cfg.get<string>('database.caCert');
    const caFromEnv = cfg.get<string>('PG_CA_CERT');
    const ca = (caFromNested ?? caFromEnv)?.replace(/\n/g, '');
    const baseSsl = ca && ca.trim().length > 0 ? { ca } : { rejectUnauthorized: false };

    return {
      type: 'postgres' as const,
      url,
      autoLoadEntities: true,
      synchronize: nodeEnv !== 'production', // prefer migrations in prod
      ssl: sslOn ? baseSsl : false,
      extra: {
        ...(sslOn ? { ssl: baseSsl } : {}),
        keepAlive: true,
        connectionTimeoutMillis: 10_000,
        idle_in_transaction_session_timeout: 30_000,
      },
      // migrations: ['dist/apps/api/migrations/*.js'], // uncomment if using migrations
    };
  },
};