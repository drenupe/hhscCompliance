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
const SUBCATEGORY = 'LIFE_SAFETY';

const SMOKE_DETECTORS_RULE_CODE = '565.17(b)-SMOKE_DETECTORS';
const FIRE_EXTINGUISHER_RULE_CODE = '565.17(b)-FIRE_EXTINGUISHER_ACCESSIBLE';
const EXITS_RULE_CODE = '565.17(b)-EXITS_UNOBSTRUCTED';

type EvaluationResult = {
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message: string | null;
};

@Injectable()
export class LifeSafetyComplianceEvaluator {
  constructor(
    @InjectRepository(ProviderEntity)
    private readonly providers: Repository<ProviderEntity>,
    private readonly compliance: ComplianceResultsService,
  ) {}

  private async resolveProviderId(): Promise<string> {
    const provider = await this.providers.findOne({
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
      'life-safety',
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
      ruleCode: SMOKE_DETECTORS_RULE_CODE,
      ...this.unknown('Smoke detector compliance cannot be verified.', 'HIGH'),
    });

    const r2 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: FIRE_EXTINGUISHER_RULE_CODE,
      ...this.unknown('Fire extinguisher accessibility cannot be verified.', 'HIGH'),
    });

    const r3 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: EXITS_RULE_CODE,
      ...this.unknown('Exit accessibility cannot be verified.', 'HIGH'),
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