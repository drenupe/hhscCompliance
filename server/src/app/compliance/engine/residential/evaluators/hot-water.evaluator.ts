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
const SUBCATEGORY = 'HOT_WATER';

const READING_PRESENT_RULE_CODE = '565.17(c)-HOT_WATER_READING_PRESENT';
const MAX_TEMP_RULE_CODE = '565.17(c)-HOT_WATER_MAX_120';

type HotWaterEvaluationResult = {
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message: string | null;
};

@Injectable()
export class HotWaterComplianceEvaluator {
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

  private missingReading(): HotWaterEvaluationResult {
    return {
      status: 'UNKNOWN',
      severity: 'MED',
      message: 'Hot water temperature reading has not been documented.',
    };
  }

  private cannotVerifyMaxTemperature(): HotWaterEvaluationResult {
    return {
      status: 'UNKNOWN',
      severity: 'HIGH',
      message: 'Hot water temperature compliance cannot be verified.',
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
      'home-environment',
      'hot-water',
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

    const readingPresent = this.missingReading();
    const maxTemperature = this.cannotVerifyMaxTemperature();

    const r1 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: READING_PRESENT_RULE_CODE,
      ...readingPresent,
    });

    const r2 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: MAX_TEMP_RULE_CODE,
      ...maxTemperature,
    });

    return {
      locationId,
      module: MODULE,
      subcategory: SUBCATEGORY,
      wrote: [
        {
          id: r1.id,
          ruleCode: r1.ruleCode,
          status: r1.status,
          severity: r1.severity,
        },
        {
          id: r2.id,
          ruleCode: r2.ruleCode,
          status: r2.status,
          severity: r2.severity,
        },
      ],
    };
  }
}