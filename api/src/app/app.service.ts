// api/src/app/app.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async root() {
    return {
      status: 'ok',
      message: 'HHSC Compliance API live',
    };
  }

  async health() {
    try {
      // simple DB ping
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        db: 'up',
      };
    } catch (e) {
      return {
        status: 'degraded',
        db: 'down',
        error: (e as Error).message,
      };
    }
  }
}
