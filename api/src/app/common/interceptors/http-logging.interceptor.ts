// api/src/app/common/interceptors/http-logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { appLogger } from '../logging/pino.logger';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = process.hrtime.bigint();
    const req = context.switchToHttp().getRequest<any>();
    const { method } = req;
    const url = req.originalUrl || req.url;
    const requestId = req.id || req.headers['x-request-id'];

    appLogger.info({ requestId, method, url }, 'req:start');

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse<any>();
          const ms = Number(process.hrtime.bigint() - start) / 1e6;
          appLogger.info(
            { requestId, method, url, status: res.statusCode, ms: +ms.toFixed(1) },
            'req:end',
          );
        },
        error: (err) => {
          const res = context.switchToHttp().getResponse<any>();
          const ms = Number(process.hrtime.bigint() - start) / 1e6;
          const status = res?.statusCode ?? err?.status ?? 500;
          appLogger.error(
            {
              requestId,
              method,
              url,
              status,
              ms: +ms.toFixed(1),
              err: { name: err?.name, message: err?.message },
            },
            'req:error',
          );
        },
      }),
    );
  }
}
