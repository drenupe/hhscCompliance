// api/src/configuration/configuration.ts
// Simple, Zod-free config for local dev.
// You can reintroduce strict Zod checks later for staging/prod.

export type AppConfig = ReturnType<typeof configuration>;

export const configuration = () => {
  const rawNodeEnv = (process.env.NODE_ENV ?? '').trim();
  const env = rawNodeEnv || 'development';

  const rawPort = Number(process.env.PORT ?? 3000);
  const port = Number.isNaN(rawPort) ? 3000 : rawPort;

  const apiPrefix = process.env.API_PREFIX || 'api';

  const corsOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const databaseUrl = process.env.DATABASE_URL ?? '';

  const sslFromUrl = /[?&]sslmode=require/i.test(databaseUrl);
  const dbSslFlag = String(process.env.DB_SSL ?? '').toLowerCase() === 'true';
  const databaseSsl = dbSslFlag || sslFromUrl;

  const pgCaCert = process.env.PG_CA_CERT;

  const accessTtl = process.env.JWT_EXPIRES_IN || '15m';
  const rawRefreshDays = Number(process.env.REFRESH_TTL_DAYS ?? 7);
  const refreshDays = Number.isNaN(rawRefreshDays) ? 7 : rawRefreshDays;
  const refreshTtl = `${refreshDays}d`;

  const jwtSecret =
    process.env.JWT_SECRET || 'dev_jwt_secret_change_me_in_real_envs';
  const jwtRefreshSecret =
    process.env.JWT_REFRESH_SECRET || jwtSecret;

  return {
    env,
    port,
    apiPrefix,
    cors: {
      origins: corsOrigins,
    },
    database: {
      url: databaseUrl,
      ssl: databaseSsl,
      caCert: pgCaCert,
    },
    auth: {
      jwtSecret,
      jwtRefreshSecret,
      accessTtl,
      refreshTtl,
    },
  } as const;
};
