import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceEngineModule } from '../compliance/engine/compliance-engine.module';
import { ComplianceResultEntity } from '../compliance/entities/compliance-result.entity';
import { ComplianceRecheckService } from './services/compliance-recheck.service';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      ComplianceResultEntity,
    ]),
    ComplianceEngineModule,
  ],
  providers: [
    ComplianceRecheckService,
  ],
  exports: [
    ComplianceRecheckService,
  ],
})
export class ComplianceRecheckModule {}