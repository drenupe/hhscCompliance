// apps/api/src/config/config.ts
import { z } from 'zod';

/** Validate + normalize env, then expose a nested config object */
const BaseEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
    PORT: z.coerce.number().default(3000),
    API_PREFIX: z.string().default('api'),
    CORS_ORIGIN: z.string().optional(), // CSV allowlist

    // Database: either DATABASE_URL or split DB_* fields
    DATABASE_URL: z.string().url().optional(),
    DB_HOST: z.string().optional(),
    DB_PORT: z.coerce.number().optional(),
    DB_USER: z.string().optional(),
    DB_PASS: z.string().optional(),
    DB_NAME: z.string().optional(),
    DB_SSL: z
      .union([z.string(), z.boolean()])
      .transform((v) => (typeof v === 'string' ? v.toLowerCase() === 'true' : !!v))
      .optional(),
    PG_CA_CERT: z.string().optional(), // optional PEM CA cert

    // Auth
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
    JWT_REFRESH_SECRET: z.string().min(32).optional(), // falls back to JWT_SECRET if omitted
    JWT_EXPIRES_IN: z.string().default('15m'), // e.g., "15m"
    REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(7),
  })
  .passthrough(); // allow extra keys like mailer creds, etc.

export const ConfigSchema = BaseEnvSchema
  .superRefine((env, ctx) => {
    const hasUrl = !!env.DATABASE_URL;
    const hasSplit = !!env.DB_HOST && !!env.DB_PORT && !!env.DB_USER && !!env.DB_PASS && !!env.DB_NAME;
    if (!hasUrl && !hasSplit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DATABASE_URL'],
        message: 'Provide DATABASE_URL or all of DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME',
      });
    }
  })
  .transform((env) => {
    // Consistent keys the app will use
    const ACCESS_TOKEN_TTL = env.JWT_EXPIRES_IN; // "15m"
    const REFRESH_TOKEN_TTL = `${env.REFRESH_TTL_DAYS}d`; // 7 -> "7d"
    const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET ?? env.JWT_SECRET;

    let DATABASE_URL = env.DATABASE_URL;
    if (!DATABASE_URL && env.DB_HOST) {
      const user = encodeURIComponent(env.DB_USER!);
      const pass = encodeURIComponent(env.DB_PASS!);
      const ssl = env.DB_SSL ? '?sslmode=require' : '';
      DATABASE_URL = `postgresql://${user}:${pass}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}${ssl}`;
    }

    return { ...env, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL, JWT_REFRESH_SECRET, DATABASE_URL };
  });

export type Env = z.infer<typeof ConfigSchema>;

export const configuration = () => {
  const e = ConfigSchema.parse(process.env);

  const corsOrigins = (e.CORS_ORIGIN ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const sslFromUrl = /[?&]sslmode=require/i.test(e.DATABASE_URL ?? '');
  const databaseSsl = e.DB_SSL || sslFromUrl;

  return {
    env: e.NODE_ENV,
    port: e.PORT,
    apiPrefix: e.API_PREFIX,
    cors: { origins: corsOrigins },
    database: {
      url: e.DATABASE_URL!, // always present after normalization
      ssl: databaseSsl,
      caCert: e.PG_CA_CERT, // optional PEM
    },
    auth: {
      jwtSecret: e.JWT_SECRET,
      jwtRefreshSecret: e.JWT_REFRESH_SECRET,
      accessTtl: e.ACCESS_TOKEN_TTL,   // "15m"
      refreshTtl: e.REFRESH_TOKEN_TTL, // "7d"
    },
  } as const;
};
export type AppConfig = ReturnType<typeof configuration>;