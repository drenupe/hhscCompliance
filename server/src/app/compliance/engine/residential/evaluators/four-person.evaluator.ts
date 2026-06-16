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
const SUBCATEGORY = 'FOUR_PERSON';

const CAPACITY_RULE_CODE = '565.17-FOUR_PERSON_CAPACITY';
const APPROVAL_RULE_CODE = '565.17-FOUR_PERSON_APPROVAL';
const DOCUMENTATION_RULE_CODE = '565.17-FOUR_PERSON_DOCUMENTATION';

type EvaluationResult = {
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message: string | null;
};

@Injectable()
export class FourPersonComplianceEvaluator {
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
      'four-person',
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
      ruleCode: CAPACITY_RULE_CODE,
      ...this.unknown('Four-person residence capacity compliance cannot be verified.', 'HIGH'),
    });

    const r2 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: APPROVAL_RULE_CODE,
      ...this.unknown('Four-person residence approval documentation cannot be verified.', 'HIGH'),
    });

    const r3 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: DOCUMENTATION_RULE_CODE,
      ...this.unknown('Four-person residence documentation cannot be verified.', 'MED'),
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