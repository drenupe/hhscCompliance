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
const SUBCATEGORY = 'NURSING';

const RN_ASSESSMENT_RULE_CODE = '565.31-RN_ASSESSMENT';
const RN_DELEGATION_RULE_CODE = '565.31-RN_DELEGATION';
const NURSING_MONITORING_RULE_CODE = '565.31-NURSING_MONITORING';
const STAFF_TRAINING_RULE_CODE = '565.31-STAFF_TRAINING';

type EvaluationResult = {
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message: string | null;
};

@Injectable()
export class NursingComplianceEvaluator {
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

  private unknown(message: string, severity: ComplianceSeverity): EvaluationResult {
    return {
      status: 'UNKNOWN',
      severity,
      message,
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
      'nursing',
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

    const r1 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: RN_ASSESSMENT_RULE_CODE,
      ...this.unknown('RN assessment documentation cannot be verified.', 'HIGH'),
    });

    const r2 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: RN_DELEGATION_RULE_CODE,
      ...this.unknown('RN delegation documentation cannot be verified.', 'HIGH'),
    });

    const r3 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: NURSING_MONITORING_RULE_CODE,
      ...this.unknown('Nursing monitoring documentation cannot be verified.', 'MED'),
    });

    const r4 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: STAFF_TRAINING_RULE_CODE,
      ...this.unknown('Staff nursing-related training documentation cannot be verified.', 'MED'),
    });

    return {
      locationId,
      module: MODULE,
      subcategory: SUBCATEGORY,
      wrote: [
        { id: r1.id, ruleCode: r1.ruleCode, status: r1.status, severity: r1.severity },
        { id: r2.id, ruleCode: r2.ruleCode, status: r2.status, severity: r2.severity },
        { id: r3.id, ruleCode: r3.ruleCode, status: r3.status, severity: r3.severity },
        { id: r4.id, ruleCode: r4.ruleCode, status: r4.status, severity: r4.severity },
      ],
    };
  }
}