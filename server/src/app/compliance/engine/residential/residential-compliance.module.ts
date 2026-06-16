import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FireDrillEntity } from '../../../fire-drills/fire-drill.entity';
import { ProviderEntity } from '../../../providers/provider.entity';

import { ComplianceResultsModule } from '../../compliance-results.module';

import { ResidentialComplianceService } from './residential-compliance.service';

import { EmergencyPlansComplianceEvaluator } from './evaluators/emergency-plans.evaluator';
import { FireDrillsComplianceEvaluator } from './evaluators/fire-drills.evaluator';
import { FourPersonComplianceEvaluator } from './evaluators/four-person.evaluator';
import { HomeEnvironmentComplianceEvaluator } from './evaluators/home-environment.evaluator';
import { HotWaterComplianceEvaluator } from './evaluators/hot-water.evaluator';
import { InfectionControlComplianceEvaluator } from './evaluators/infection-control.evaluator';
import { LifeSafetyComplianceEvaluator } from './evaluators/life-safety.evaluator';
import { MedicationComplianceEvaluator } from './evaluators/medication.evaluator';
import { NursingComplianceEvaluator } from './evaluators/nursing.evaluator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FireDrillEntity,
      ProviderEntity,
    ]),
    ComplianceResultsModule,
  ],
  providers: [
    ResidentialComplianceService,
    FireDrillsComplianceEvaluator,
    EmergencyPlansComplianceEvaluator,
    HotWaterComplianceEvaluator,
    HomeEnvironmentComplianceEvaluator,
    LifeSafetyComplianceEvaluator,
    MedicationComplianceEvaluator,
    NursingComplianceEvaluator,
    InfectionControlComplianceEvaluator,
    FourPersonComplianceEvaluator,
  ],
  exports: [
    ResidentialComplianceService,
  ],
})
export class ResidentialComplianceModule {}