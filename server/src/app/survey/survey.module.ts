import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComplianceResultEntity } from '../compliance/entities/compliance-result.entity';
import { SecurityModule } from '../security/security.module';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplianceResultEntity]),
    SecurityModule,
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}