import { Injectable } from '@nestjs/common';

import { ComplianceResultsService } from '../compliance/compliance-results.service';
import { FireDrillsService } from '../fire-drills/fire-drills.service';

type EngineActor = { id?: string; email?: string; roles?: string[] };
type EngineMeta = { ip?: string; userAgent?: string; requestId?: string };

type EvalResult = {
  locationId: string;
  module: string;
  subcategory: string;
  wrote: Array<{ id: string; ruleCode: string; status: string; severity: string }>;
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

@Injectable()
export class ComplianceEngineService {
  constructor(
    private readonly compliance: ComplianceResultsService,
    private readonly fireDrills: FireDrillsService,
  ) {}

  /**
   * ✅ Enterprise “system actor”
   * Use these for evaluator writes so audit shows system-generated updates.
   */
  private systemActor(): EngineActor {
    return { id: 'system', email: 'system@hhsc-compliance.local', roles: ['SYSTEM'] };
  }

  private systemMeta(): EngineMeta {
    return { ip: '127.0.0.1', userAgent: 'compliance-engine', requestId: 'engine' };
  }

  /**
   * ✅ One call to evaluate everything for a location.
   * Add more evaluators here over time.
   */
  async evaluateLocation(locationId: string): Promise<{ locationId: string; results: EvalResult[] }> {
    const results: EvalResult[] = [];

    // Fire Drills (Form 4719)
    results.push(await this.evaluateFireDrills(locationId));

    // TODO later:
    // results.push(await this.evaluateResidentialHome(locationId));
    // results.push(await this.evaluateHotWater(locationId));
    // results.push(await this.evaluateLifeSafety(locationId));
    // results.push(await this.evaluateMedication(locationId));
    // ...

    return { locationId, results };
  }

  /**
   * ✅ Fire Drills evaluator (Form 4719)
   * Writes 2 rules by default:
   * - MONTHLY presence
   * - SHIFT rotation baseline
   *
   * This is the “brain” of your module now.
   */
  async evaluateFireDrills(locationId: string): Promise<EvalResult> {
    const actor = this.systemActor();
    const meta = this.systemMeta();

    // We read drills via your service (which returns DTOs)
    const drills = await this.fireDrills.list(locationId);

    const last30 = daysAgo(30);
    const last90 = daysAgo(90);

    // drills[] are DTOs: dateDrillConducted, shift, ...
    const inLast30 = drills.filter((d: any) => new Date(d.dateDrillConducted) >= last30);
    const inLast90 = drills.filter((d: any) => new Date(d.dateDrillConducted) >= last90);

    // A) Monthly presence
    let monthlyStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN' = 'COMPLIANT';
    let monthlySeverity: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL' = 'LOW';
    let monthlyMessage: string | null = `Fire drills in last 30 days: ${inLast30.length}.`;

    if (drills.length === 0) {
      monthlyStatus = 'NON_COMPLIANT';
      monthlySeverity = 'CRITICAL';
      monthlyMessage = 'No fire drill records found for this location.';
    } else if (inLast30.length === 0) {
      monthlyStatus = 'NON_COMPLIANT';
      monthlySeverity = 'HIGH';
      monthlyMessage = 'No fire drill recorded in the last 30 days.';
    }

    // B) Shift rotation baseline (simple and safe)
    let shiftStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN' = 'COMPLIANT';
    let shiftSeverity: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL' = 'LOW';
    let shiftMessage: string | null = null;

    if (inLast90.length === 0) {
      shiftStatus = 'UNKNOWN';
      shiftSeverity = 'MED';
      shiftMessage = 'No fire drills recorded in the last 90 days to evaluate shift rotation.';
    } else {
      const shifts = uniq(
        inLast90
          .map((d: any) => String(d.shift ?? '').trim().toUpperCase())
          .filter(Boolean),
      );
      const hasNight = shifts.includes('NIGHT');
      const hasTwoShifts = shifts.length >= 2;

      if (!hasNight && !hasTwoShifts) {
        shiftStatus = 'NON_COMPLIANT';
        shiftSeverity = 'MED';
        shiftMessage = `Shift coverage insufficient (found: ${shifts.join(', ') || 'none'}).`;
      } else if (!hasNight) {
        shiftStatus = 'NON_COMPLIANT';
        shiftSeverity = 'MED';
        shiftMessage = `Missing NIGHT drill in last 90 days (found: ${shifts.join(', ')}).`;
      } else if (!hasTwoShifts) {
        shiftStatus = 'NON_COMPLIANT';
        shiftSeverity = 'MED';
        shiftMessage = `Need at least 2 unique shifts in last 90 days (found: ${shifts.join(', ')}).`;
      } else {
        shiftMessage = `Shift coverage OK (found: ${shifts.join(', ')}).`;
      }
    }

    // Deep-link destination (your nested route)
    const routeCommands = ['/', 'compliance', 'residential', 'location', locationId, 'emergency', 'fire-drills'];
    const queryParams = { locationId, module: 'RESIDENTIAL', subcategory: 'FIRE_DRILLS' };

    // Write results (engine primitive)
    const r1 = await this.compliance.upsertResult(
      {
        locationId,
        entityType: 'RESIDENTIAL',
        entityId: locationId,
        module: 'RESIDENTIAL',
        subcategory: 'FIRE_DRILLS',

        ruleCode: '565.23(e)-MONTHLY',
        status: monthlyStatus,
        severity: monthlySeverity,
        message: monthlyMessage,

        routeCommands,
        queryParams,
        lastCheckedAt: new Date(),
      },
      actor,
      meta,
    );

    const r2 = await this.compliance.upsertResult(
      {
        locationId,
        entityType: 'RESIDENTIAL',
        entityId: locationId,
        module: 'RESIDENTIAL',
        subcategory: 'FIRE_DRILLS',

        ruleCode: '565.23(e)-SHIFT_ROTATION',
        status: shiftStatus,
        severity: shiftSeverity,
        message: shiftMessage,

        routeCommands,
        queryParams,
        lastCheckedAt: new Date(),
      },
      actor,
      meta,
    );

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
