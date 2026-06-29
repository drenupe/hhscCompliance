import { Injectable } from '@nestjs/common';

import { ExecutiveDashboardService } from './services/executive-dashboard.service';

@Injectable()
export class ExecutiveService {
  constructor(
    private readonly dashboard: ExecutiveDashboardService,
  ) {}

  dashboardView() {
    return this.dashboard.getDashboard();
  }
}