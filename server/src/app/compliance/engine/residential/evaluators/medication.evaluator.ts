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
const SUBCATEGORY = 'MEDICATION';

const MAR_REVIEW_RULE_CODE = '565.31-MAR_REVIEW';
const MED_DELEGATION_RULE_CODE = '565.31-MEDICATION_DELEGATION';
const MED_STORAGE_RULE_CODE = '565.31-MEDICATION_STORAGE';
const MED_ERRORS_RULE_CODE = '565.31-MEDICATION_ERRORS';

type EvaluationResult = {
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message: string | null;
};

@Injectable()
export class MedicationComplianceEvaluator {
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
      'medication',
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
      ruleCode: MAR_REVIEW_RULE_CODE,
      ...this.unknown('Medication administration record review cannot be verified.', 'HIGH'),
    });

    const r2 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: MED_DELEGATION_RULE_CODE,
      ...this.unknown('Medication delegation documentation cannot be verified.', 'HIGH'),
    });

    const r3 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: MED_STORAGE_RULE_CODE,
      ...this.unknown('Medication storage compliance cannot be verified.', 'MED'),
    });

    const r4 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: MED_ERRORS_RULE_CODE,
      ...this.unknown('Medication error documentation cannot be verified.', 'HIGH'),
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