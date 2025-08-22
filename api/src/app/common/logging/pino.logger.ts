// api/src/app/common/logging/pino.logger.ts
import pino, { LoggerOptions } from 'pino';

function buildTransport() {
  const wantPretty =
    (process.env.PINO_PRETTY || '').toLowerCase() === 'true' &&
    process.env.NODE_ENV !== 'production';

  if (!wantPretty) return undefined;

  try {
    // Ensure the module is installed/resolvable
    require.resolve('pino-pretty');
    return {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    };
  } catch {
    // Don’t crash if not installed; just fall back to JSON
    // You could console.warn here if you like.
    return undefined;
  }
}

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'res.headers["set-cookie"]',
      'user.passwordHash',
      '*.token',
      '*.refreshToken',
    ],
    remove: true,
  },
  transport: buildTransport(),
};

export const appLogger = pino(options);
