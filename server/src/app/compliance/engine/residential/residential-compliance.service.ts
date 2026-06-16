import { Injectable } from '@nestjs/common';

import { EmergencyPlansComplianceEvaluator } from './evaluators/emergency-plans.evaluator';
import { FireDrillsComplianceEvaluator } from './evaluators/fire-drills.evaluator';
import { FourPersonComplianceEvaluator } from './evaluators/four-person.evaluator';
import { HomeEnvironmentComplianceEvaluator } from './evaluators/home-environment.evaluator';
import { HotWaterComplianceEvaluator } from './evaluators/hot-water.evaluator';
import { InfectionControlComplianceEvaluator } from './evaluators/infection-control.evaluator';
import { LifeSafetyComplianceEvaluator } from './evaluators/life-safety.evaluator';
import { MedicationComplianceEvaluator } from './evaluators/medication.evaluator';
import { NursingComplianceEvaluator } from './evaluators/nursing.evaluator';

type EvalResult = {
  locationId: string;
  module: string;
  subcategory: string;
  wrote: Array<{
    id: string;
    ruleCode: string;
    status: string;
    severity: string;
  }>;
};

@Injectable()
export class ResidentialComplianceService {
  constructor(
    private readonly fireDrills: FireDrillsComplianceEvaluator,
    private readonly emergencyPlans: EmergencyPlansComplianceEvaluator,
    private readonly hotWater: HotWaterComplianceEvaluator,
    private readonly homeEnvironment: HomeEnvironmentComplianceEvaluator,
    private readonly lifeSafety: LifeSafetyComplianceEvaluator,
    private readonly medication: MedicationComplianceEvaluator,
    private readonly nursing: NursingComplianceEvaluator,
    private readonly infectionControl: InfectionControlComplianceEvaluator,
    private readonly fourPerson: FourPersonComplianceEvaluator,
  ) {}

  async evaluate(locationId: string): Promise<EvalResult[]> {
    const results: EvalResult[] = [];

    results.push(await this.fireDrills.evaluate(locationId));
    results.push(await this.emergencyPlans.evaluate(locationId));
    results.push(await this.hotWater.evaluate(locationId));
    results.push(await this.homeEnvironment.evaluate(locationId));
    results.push(await this.lifeSafety.evaluate(locationId));
    results.push(await this.medication.evaluate(locationId));
    results.push(await this.nursing.evaluate(locationId));
    results.push(await this.infectionControl.evaluate(locationId));
    results.push(await this.fourPerson.evaluate(locationId));

    return results;
  }
}