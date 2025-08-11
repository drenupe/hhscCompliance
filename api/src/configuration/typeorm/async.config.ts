// apps/api/src/config/typeorm/async.config.ts
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (cfg: ConfigService) => {
    const nodeEnv = cfg.get<string>('NODE_ENV') ?? 'development';
    const url = cfg.get<string>('DATABASE_URL') ?? '';
    const dbSslEnv = (cfg.get<string>('DB_SSL') ?? '').toLowerCase() === 'true';
    const sslOn = dbSslEnv || url.toLowerCase().includes('sslmode=require');

    const caFromEnv = cfg.get<string>('PG_CA_CERT'); // may be undefined
    const baseSsl =
      caFromEnv && caFromEnv.trim().length > 0
        ? { ca: caFromEnv.replace(/\\n/g, '\n') }
        : { rejectUnauthorized: false };

    return {
      type: 'postgres' as const,
      url,
      autoLoadEntities: true,
      synchronize: nodeEnv !== 'production',
      ssl: sslOn ? baseSsl : false,
      extra: {
        ...(sslOn ? { ssl: baseSsl } : {}),
        keepAlive: true,
        connectionTimeoutMillis: 10_000,
        idle_in_transaction_session_timeout: 30_000,
      },
    };
  },
};
