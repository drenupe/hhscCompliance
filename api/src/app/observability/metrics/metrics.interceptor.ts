// api/src/app/observability/metrics/metrics.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from './metrics.service';

function sanitizeRoute(path?: string) {
  if (!path) return 'unknown';
  // collapse ids/uuids to :id for cardinality control
  return path
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, ':id')
    .replace(/\b\d+\b/g, ':id');
}

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<any>();
    const res = http.getResponse<any>();

    const method = req?.method || 'GET';
    const route = sanitizeRoute((req?.route?.path || req?.path || '/').toString());
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.metrics.observeHttp(method, route, res.statusCode || 200, ms);
        },
        error: () => {
          const ms = Date.now() - start;
          this.metrics.observeHttp(method, route, res.statusCode || 500, ms);
        },
      }),
    );
  }
}
