// api/src/app/observability/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  readonly registry = new Registry();

  readonly httpRequests = new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status'] as const,
    registers: [this.registry],
  });

  readonly httpDuration = new Histogram({
    name: 'http_request_duration_ms',
    help: 'HTTP request duration (ms)',
    labelNames: ['method', 'route', 'status'] as const,
    buckets: [5, 10, 25, 50, 100, 200, 500, 1000, 2000],
    registers: [this.registry],
  });

  readonly authLogin = new Counter({
    name: 'auth_login_total',
    help: 'Login attempts',
    labelNames: ['result'] as const, // success|failure
    registers: [this.registry],
  });

  readonly refreshRotations = new Counter({
    name: 'refresh_rotate_total',
    help: 'Refresh rotations',
    labelNames: ['result'] as const, // rotated|reused|invalid
    registers: [this.registry],
  });

  constructor() {
    this.registry.setDefaultLabels({ app: 'api', env: process.env.NODE_ENV || 'development' });
    collectDefaultMetrics({ register: this.registry, prefix: 'api_' });
  }

  observeHttp(method: string, route: string, status: number, ms: number) {
    const labels = { method, route, status: String(status) } as const;
    this.httpRequests.inc(labels);
    this.httpDuration.observe(labels, ms);
  }

  incLogin(result: 'success' | 'failure') {
    this.authLogin.inc({ result });
  }

  incRefresh(result: 'rotated' | 'reused' | 'invalid') {
    this.refreshRotations.inc({ result });
  }

  async render(): Promise<string> {
    return await this.registry.metrics();
  }
}
