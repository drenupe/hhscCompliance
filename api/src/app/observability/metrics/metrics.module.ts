// api/src/app/observability/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsInterceptor } from './metrics.interceptor';
import { MetricsService } from './metrics.service';

@Module({
  providers: [MetricsService, MetricsInterceptor],
  controllers: [MetricsController],
  exports: [MetricsService, MetricsInterceptor],
})
export class MetricsModule {}
