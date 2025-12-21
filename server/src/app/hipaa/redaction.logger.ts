// api/src/app/hipaa/redaction.logger.ts
import pino from 'pino';
export const redactedLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body', 'res.body', '*.password', '*.token', '*.ssn', '*.dob'],
    remove: true,
  },
});