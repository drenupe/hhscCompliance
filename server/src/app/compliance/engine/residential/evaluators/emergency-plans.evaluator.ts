import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ComplianceResultsService } from '../../../compliance-results.service';
import {
  ComplianceSeverity,
  ComplianceStatus,
} from '../../../entities/compliance-result.entity';
import { ProviderEntity } from '../../../../providers/provider.entity';

const MODULE = 'RESIDENTIAL';
const SUBCATEGORY = 'EMERGENCY_PLANS';

const PLAN_EXISTS_RULE_CODE = '565.23(b)(5)-PLAN_EXISTS';
const PLAN_ACCESSIBLE_RULE_CODE = '565.23(b)(5)-PLAN_ACCESSIBLE';
const DRILL_DOCUMENTATION_RULE_CODE = '565.23(b)(5)-DRILL_DOCUMENTATION';

type EmergencyPlanEvaluationResult = {
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message: string | null;
};

@Injectable()
export class EmergencyPlansComplianceEvaluator {
  constructor(
    @InjectRepository(ProviderEntity)
    private readonly providers: Repository<ProviderEntity>,

    private readonly compliance: ComplianceResultsService,
  ) {}

  private async resolveProviderId(): Promise<string> {
    const where: Record<string, unknown> = {};

    const columns = this.providers.metadata.columns.map((c) => c.propertyName);
    if (columns.includes('deletedAt')) {
      where.deletedAt = null;
    }

    const provider = await this.providers.findOne({
      where: where as any,
      order: { createdAt: 'ASC' } as any,
    });

    if (!provider) {
      throw new BadRequestException('No Provider exists yet. Create Provider first.');
    }

    return (provider as any).id;
  }

  private missingPlan(): EmergencyPlanEvaluationResult {
    return {
      status: 'NON_COMPLIANT',
      severity: 'CRITICAL',
      message: 'Emergency plan is not on file for this location.',
    };
  }

  private planNotAccessible(): EmergencyPlanEvaluationResult {
    return {
      status: 'NON_COMPLIANT',
      severity: 'HIGH',
      message: 'Emergency plan accessibility has not been verified for staff.',
    };
  }

  private missingDrillDocumentation(): EmergencyPlanEvaluationResult {
    return {
      status: 'NON_COMPLIANT',
      severity: 'CRITICAL',
      message: 'Missing emergency drill documentation.',
    };
  }

  async evaluate(locationId: string) {
    const providerId = await this.resolveProviderId();

    const routeCommands = [
      '/',
      'compliance',
      'residential',
      'location',
      locationId,
      'emergency',
      'plans',
    ];

    const queryParams = {
      locationId,
      module: MODULE,
      subcategory: SUBCATEGORY,
    };

    const baseResult = {
      providerId,
      locationId,
      entityType: 'RESIDENTIAL' as const,
      entityId: locationId,
      module: MODULE,
      subcategory: SUBCATEGORY,
      routeCommands,
      queryParams,
      lastCheckedAt: new Date(),
    };

    const planExists = this.missingPlan();
    const planAccessible = this.planNotAccessible();
    const drillDocumentation = this.missingDrillDocumentation();

    const r1 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: PLAN_EXISTS_RULE_CODE,
      ...planExists,
    });

    const r2 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: PLAN_ACCESSIBLE_RULE_CODE,
      ...planAccessible,
    });

    const r3 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: DRILL_DOCUMENTATION_RULE_CODE,
      ...drillDocumentation,
    });

    return {
      locationId,
      module: MODULE,
      subcategory: SUBCATEGORY,
      wrote: [
        { id: r1.id, ruleCode: r1.ruleCode, status: r1.status, severity: r1.severity },
        { id: r2.id, ruleCode: r2.ruleCode, status: r2.status, severity: r2.severity },
        { id: r3.id, ruleCode: r3.ruleCode, status: r3.status, severity: r3.severity },
      ],
    };
  }
}