import { Injectable } from '@nestjs/common';

import { ExecutiveDashboardView } from '../types/executive.types';

@Injectable()
export class ExecutiveDashboardService {
  getDashboard(): ExecutiveDashboardView {
    return {
      providerName: 'McCaskill HCS Services',

      agencyHealth: {
        title: 'Agency Health',
        value: 96,
        status: 'HEALTHY',
        trend: 'IMPROVING',
        change: 4,
      },

      surveyReadiness: {
        title: 'Survey Readiness',
        value: 94,
        status: 'HEALTHY',
        trend: 'IMPROVING',
        change: 6,
      },

      providerScore: {
        title: 'Provider Score',
        value: 95,
        status: 'HEALTHY',
        trend: 'STABLE',
        change: 0,
      },

      staffReadiness: {
        title: 'Staff Readiness',
        value: 91,
        status: 'ATTENTION',
        trend: 'IMPROVING',
        change: 2,
      },

      billingHealth: {
        title: 'Billing Health',
        value: 98,
        status: 'HEALTHY',
        trend: 'STABLE',
        change: 1,
      },

      capCompletion: {
        title: 'CAP Completion',
        value: 82,
        status: 'ATTENTION',
        trend: 'IMPROVING',
        change: 8,
      },

      risks: [
        {
          id: 'risk-1',
          title: 'Residential Documentation',
          summary:
            'Fire drill documentation remains the largest survey exposure.',
          severity: 'ATTENTION',
          routeCommands: ['/dashboard', 'modules', 'RESIDENTIAL'],
        },
        {
          id: 'risk-2',
          title: 'Nursing Reviews',
          summary:
            'Clinical assessments approaching expiration.',
          severity: 'AT_RISK',
          routeCommands: ['/dashboard', 'modules', 'NURSING'],
        },
      ],
    };
  }
}