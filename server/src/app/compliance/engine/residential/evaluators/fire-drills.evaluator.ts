import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { ComplianceResultsService } from '../../../compliance-results.service';
import {
  ComplianceSeverity,
  ComplianceStatus,
} from '../../../entities/compliance-result.entity';
import { FireDrillEntity } from '../../../../fire-drills/fire-drill.entity';
import { ProviderEntity } from '../../../../providers/provider.entity';

const MODULE = 'RESIDENTIAL';
const SUBCATEGORY = 'FIRE_DRILLS';

const MONTHLY_RULE_CODE = '565.23(e)-MONTHLY';
const SHIFT_ROTATION_RULE_CODE = '565.23(e)-SHIFT_ROTATION';

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

type FireDrillEvaluationResult = {
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message: string | null;
};

@Injectable()
export class FireDrillsComplianceEvaluator {
  constructor(
    @InjectRepository(FireDrillEntity)
    private readonly drills: Repository<FireDrillEntity>,

    @InjectRepository(ProviderEntity)
    private readonly providers: Repository<ProviderEntity>,

    private readonly compliance: ComplianceResultsService,
  ) { }

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
      throw new BadRequestException(
        'No Provider exists yet. Create Provider first.',
      );
    }

    return (provider as any).id;
  }

  private evaluateMonthlyPresence(drills: FireDrillEntity[]): FireDrillEvaluationResult {
    const last30 = daysAgo(30);
    const inLast30 = drills.filter(
      (d) => new Date(d.dateDrillConducted) >= last30,
    );

    if (drills.length === 0) {
      return {
        status: 'NON_COMPLIANT',
        severity: 'CRITICAL',
        message: 'No fire drill records found for this location.',
      };
    }

    if (inLast30.length === 0) {
      return {
        status: 'NON_COMPLIANT',
        severity: 'HIGH',
        message: 'No fire drill recorded in the last 30 days.',
      };
    }

    return {
      status: 'COMPLIANT',
      severity: 'LOW',
      message: `Fire drills in last 30 days: ${inLast30.length}.`,
    };
  }

  private evaluateShiftRotation(drills: FireDrillEntity[]): FireDrillEvaluationResult {
    const last90 = daysAgo(90);
    const inLast90 = drills.filter(
      (d) => new Date(d.dateDrillConducted) >= last90,
    );

    if (inLast90.length === 0) {
      return {
        status: 'UNKNOWN',
        severity: 'MED',
        message: 'No fire drills recorded in the last 90 days to evaluate shift rotation.',
      };
    }

    const shifts = unique(
      inLast90
        .map((d) => String(d.shift ?? '').trim().toUpperCase())
        .filter(Boolean),
    );

    const hasNight = shifts.includes('NIGHT');
    const hasTwoShifts = shifts.length >= 2;
    const found = shifts.join(', ') || 'none';

    if (!hasNight && !hasTwoShifts) {
      return {
        status: 'NON_COMPLIANT',
        severity: 'MED',
        message: `Shift coverage insufficient. Found: ${found}.`,
      };
    }

    if (!hasNight) {
      return {
        status: 'NON_COMPLIANT',
        severity: 'MED',
        message: `Missing NIGHT drill in last 90 days. Found: ${found}.`,
      };
    }

    if (!hasTwoShifts) {
      return {
        status: 'NON_COMPLIANT',
        severity: 'MED',
        message: `Need at least 2 unique shifts in last 90 days. Found: ${found}.`,
      };
    }

    return {
      status: 'COMPLIANT',
      severity: 'LOW',
      message: `Shift coverage OK. Found: ${found}.`,
    };
  }

  async evaluate(locationId: string) {
    const providerId = await this.resolveProviderId();

    const drills = await this.drills.find({
      where: { locationId } as any,
      order: {
        dateDrillConducted: 'DESC',
        updatedAt: 'DESC',
      } as any,
      take: 500,
    });

    const routeCommands = [
      '/',
      'compliance',
      'residential',
      'location',
      locationId,
      'emergency',
      'fire-drills',
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

    const monthly = this.evaluateMonthlyPresence(drills);
    const shiftRotation = this.evaluateShiftRotation(drills);

    const r1 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: MONTHLY_RULE_CODE,
      ...monthly,
    });

    const r2 = await this.compliance.upsertSystemResult({
      ...baseResult,
      ruleCode: SHIFT_ROTATION_RULE_CODE,
      ...shiftRotation,
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