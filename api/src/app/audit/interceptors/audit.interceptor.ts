// api/src/app/audit/interceptors/audit.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs/operators';
import { AuditService } from '../audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private audit: AuditService, private reflector: Reflector) {}
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest<any>();
    const started = Date.now();
    return next.handle().pipe(
      tap(() => this.audit.log({
        ts: new Date().toISOString(),
        actorId: req.user?.sub ?? 'anonymous',
        method: req.method,
        path: req.route?.path || req.url,
        ip: req.ip,
        ua: req.headers['user-agent'],
        action: this.reflector.get<string>('audit:action', ctx.getHandler()) ?? 'unknown',
        durationMs: Date.now() - started,
      })),
    );
  }
}