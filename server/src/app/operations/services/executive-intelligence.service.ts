import { Injectable } from '@nestjs/common';

import { OperationsExecutiveIntelligence } from '../types/operations.types';

@Injectable()
export class ExecutiveIntelligenceService {
  build(): OperationsExecutiveIntelligence {
    return {
      readinessTrend: 'Improving',
      providerHealthSummary:
        'Agency health is strong, but residential documentation and nursing follow-up remain the highest survey risks.',
      surveyRiskLevel: 'Medium',
      capCompletionRate: 82,
      billingRiskLevel: 'Low',
      staffReadinessRate: 91,
      metrics: [
        {
          label: 'Survey Readiness',
          value: '94%',
          detail: 'Up 6% from prior review',
          status: 'HEALTHY',
        },
        {
          label: 'CAP Completion',
          value: '82%',
          detail: '4 corrective actions remain open',
          status: 'ATTENTION',
        },
        {
          label: 'Billing Risk',
          value: 'Low',
          detail: 'ISS and residential documentation mostly complete',
          status: 'HEALTHY',
        },
        {
          label: 'Staff Readiness',
          value: '91%',
          detail: 'Training and credential checks mostly current',
          status: 'HEALTHY',
        },
      ],
      risks: [
        {
          id: 'risk-1',
          title: 'Residential documentation gaps',
          summary: 'Fire drill and emergency readiness items require follow-up.',
          level: 'Medium',
          routeCommands: ['/dashboard', 'modules', 'RESIDENTIAL'],
        },
        {
          id: 'risk-2',
          title: 'Nursing follow-up approaching deadline',
          summary: 'One nursing item is trending toward survey risk.',
          level: 'High',
          routeCommands: ['/dashboard', 'modules', 'NURSING'],
        },
      ],
    };
  }
}