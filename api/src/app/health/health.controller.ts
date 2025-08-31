// api/src/app/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private hc: HealthCheckService, private db: TypeOrmHealthIndicator) {}

  @Get('liveness')
  liveness() { return { status: 'ok' }; }

  @Get('readiness')
  @HealthCheck()
  readiness() { return this.hc.check([() => this.db.pingCheck('database')]); }
}