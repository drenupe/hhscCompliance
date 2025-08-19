// api/src/app/hipaa/interceptors/phi-redact.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

// Extremely conservative example – customize for your schemas
const REDACT_KEYS = new Set(['password', 'token', 'ssn', 'dob', 'mrn', 'medicalRecordNumber']);

function redactDeep(value: any): any {
  if (Array.isArray(value)) return value.map(redactDeep);
  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = REDACT_KEYS.has(k) ? '[REDACTED]' : redactDeep(v);
    }
    return out;
  }
  return value;
}

@Injectable()
export class PhiRedactInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => redactDeep(data)));
  }
}