// api/src/app/observability/metrics/metrics.controller.ts
import { Controller, Get, Headers, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  async getMetrics(@Headers('authorization') authz: string | undefined, @Res() res: Response) {
    const prod = process.env.NODE_ENV === 'production';
    const token = process.env.METRICS_TOKEN;

    if (prod && token) {
      const ok = authz === `Bearer ${token}`;
      if (!ok) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    res.setHeader('Content-Type', 'text/plain; version=0.0.4');
    res.send(await this.metrics.render());
  }
}
