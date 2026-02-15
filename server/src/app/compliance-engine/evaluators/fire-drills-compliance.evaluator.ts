import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FireDrillEntity } from '../../fire-drills/fire-drill.entity';
import { ComplianceResultsService } from '../../compliance/compliance-results.service';
import { ProviderEntity } from '../../providers/provider.entity';

type Status = 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';
type Severity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

@Injectable()
export class FireDrillsComplianceEvaluator {
  constructor(
    @InjectRepository(FireDrillEntity)
    private readonly drills: Repository<FireDrillEntity>,
    @InjectRepository(ProviderEntity)
    private readonly providers: Repository<ProviderEntity>,
    private readonly compliance: ComplianceResultsService,
  ) {}

  private async resolveProviderId(): Promise<string> {
    const where: any = {};
    const cols = this.providers.metadata.columns.map((c) => c.propertyName);
    if (cols.includes('deletedAt')) where.deletedAt = null;

    const p = await this.providers.findOne({ where, order: { createdAt: 'ASC' } as any });
    if (!p) throw new Error('No Provider exists yet. Create Provider first.');
    return (p as any).id;
  }

  async evaluate(locationId: string) {
    const providerId = await this.resolveProviderId();

    const last30 = daysAgo(30);
    const last90 = daysAgo(90);

    const recent = await this.drills.find({
      where: { locationId } as any,
      order: { dateDrillConducted: 'DESC', updatedAt: 'DESC' } as any,
      take: 500,
    });

    const inLast30 = recent.filter((d) => new Date(d.dateDrillConducted) >= last30);
    const inLast90 = recent.filter((d) => new Date(d.dateDrillConducted) >= last90);

    // ---- A) Monthly presence (last 30 days baseline) ----
    let monthlyStatus: Status = 'COMPLIANT';
    let monthlySeverity: Severity = 'LOW';
    let monthlyMsg: string | null = `Fire drills in last 30 days: ${inLast30.length}.`;

    if (recent.length === 0) {
      monthlyStatus = 'NON_COMPLIANT';
      monthlySeverity = 'CRITICAL';
      monthlyMsg = 'No fire drill records found for this location.';
    } else if (inLast30.length === 0) {
      monthlyStatus = 'NON_COMPLIANT';
      monthlySeverity = 'HIGH';
      monthlyMsg = 'No fire drill recorded in the last 30 days.';
    }

    // ---- B) Shift rotation (last 90 days baseline) ----
    let shiftStatus: Status = 'COMPLIANT';
    let shiftSeverity: Severity = 'LOW';
    let shiftMsg: string | null = null;

    if (inLast90.length === 0) {
      shiftStatus = 'UNKNOWN';
      shiftSeverity = 'MED';
      shiftMsg = 'No fire drills recorded in the last 90 days to evaluate shift rotation.';
    } else {
      const shifts = uniq(inLast90.map((d) => d.shift).filter(Boolean));
      const hasNight = shifts.includes('NIGHT');
      const hasTwoShifts = shifts.length >= 2;

      if (!hasNight && !hasTwoShifts) {
        shiftStatus = 'NON_COMPLIANT';
        shiftSeverity = 'MED';
        shiftMsg = `Shift coverage insufficient (found: ${shifts.join(', ') || 'none'}).`;
      } else if (!hasNight) {
        shiftStatus = 'NON_COMPLIANT';
        shiftSeverity = 'MED';
        shiftMsg = `Missing NIGHT drill in last 90 days (found: ${shifts.join(', ')}).`;
      } else if (!hasTwoShifts) {
        shiftStatus = 'NON_COMPLIANT';
        shiftSeverity = 'MED';
        shiftMsg = `Need at least 2 unique shifts in last 90 days (found: ${shifts.join(', ')}).`;
      } else {
        shiftMsg = `Shift coverage OK (found: ${shifts.join(', ')}).`;
      }
    }

    const routeCommands = ['/', 'compliance', 'residential', 'location', locationId, 'emergency', 'fire-drills'];
    const qp = { locationId, module: 'RESIDENTIAL', subcategory: 'FIRE_DRILLS' };

    const r1 = await this.compliance.upsertSystemResult({
      providerId,
      locationId,
      entityType: 'RESIDENTIAL',
      entityId: locationId,
      module: 'RESIDENTIAL',
      subcategory: 'FIRE_DRILLS',
      ruleCode: '565.23(e)-MONTHLY',
      status: monthlyStatus,
      severity: monthlySeverity,
      message: monthlyMsg,
      routeCommands,
      queryParams: qp,
      lastCheckedAt: new Date(),
    });

    const r2 = await this.compliance.upsertSystemResult({
      providerId,
      locationId,
      entityType: 'RESIDENTIAL',
      entityId: locationId,
      module: 'RESIDENTIAL',
      subcategory: 'FIRE_DRILLS',
      ruleCode: '565.23(e)-SHIFT_ROTATION',
      status: shiftStatus,
      severity: shiftSeverity,
      message: shiftMsg,
      routeCommands,
      queryParams: qp,
      lastCheckedAt: new Date(),
    });

    return {
      locationId,
      module: 'RESIDENTIAL',
      subcategory: 'FIRE_DRILLS',
      wrote: [
        { id: r1.id, ruleCode: r1.ruleCode, status: r1.status, severity: r1.severity },
        { id: r2.id, ruleCode: r2.ruleCode, status: r2.status, severity: r2.severity },
      ],
    };
  }
}
