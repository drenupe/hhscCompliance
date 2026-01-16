// api/src/app/audit/interceptors/audit.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs/operators';

import { AuditService, toAuditAction } from '../audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly audit: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest<any>();
    const started = Date.now();

    // If you set @SetMetadata('audit:entity', 'Provider') on handlers, we’ll use it.
    // Otherwise we fall back to controller class name.
    const entityType =
      this.reflector.get<string>('audit:entity', ctx.getHandler()) ??
      this.reflector.get<string>('audit:entity', ctx.getClass()) ??
      ctx.getClass()?.name ??
      'unknown';

    const rawAction = this.reflector.get<string>('audit:action', ctx.getHandler());
    const action = toAuditAction(rawAction);

    // Optional: you can also set @SetMetadata('audit:idParam', 'id')
    // to pull entityId from req.params[idParam]
    const idParam =
      this.reflector.get<string>('audit:idParam', ctx.getHandler()) ??
      this.reflector.get<string>('audit:idParam', ctx.getClass()) ??
      'id';

    const entityId: string | null = req?.params?.[idParam] ?? null;

    return next.handle().pipe(
      tap(() => {
        void this.audit.log({
          entityType,
          entityId,
          action,

          actorUserId: req.user?.sub ?? null,
          actorEmail: req.user?.email ?? null,
          actorRoles: req.user?.roles ?? null,

          ip: req.ip ?? null,
          userAgent: req.headers?.['user-agent'] ?? null,
          requestId: req.headers?.['x-request-id'] ?? null,

          // Keep your “event” fields here:
          meta: {
            ts: new Date().toISOString(),
            method: req.method,
            path: req.route?.path || req.url,
            durationMs: Date.now() - started,
          },
        });
      }),
    );
  }
}
