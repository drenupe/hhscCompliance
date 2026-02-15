import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FireDrillEntity } from '../fire-drills/fire-drill.entity';
import { ProviderEntity } from '../providers/provider.entity';

import { FireDrillsComplianceEvaluator } from './evaluators/fire-drills-compliance.evaluator';
import { ComplianceResultsModule } from '../compliance/compliance-results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FireDrillEntity, ProviderEntity]),
    ComplianceResultsModule,
  ],
  providers: [FireDrillsComplianceEvaluator],
  exports: [FireDrillsComplianceEvaluator],
})
export class ComplianceEngineModule {}
