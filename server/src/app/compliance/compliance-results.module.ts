import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComplianceResultsController } from './compliance-results.controller';
import { ProviderEntity } from '../providers/provider.entity';
import { AuditModule } from '../audit/audit.module';
import { ComplianceResultsService } from './compliance-results.service';
import { ComplianceResultEntity } from './entities/compliance-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceResultEntity, ProviderEntity]), AuditModule],
  controllers: [ComplianceResultsController],
  providers: [ComplianceResultsService],
  exports: [ComplianceResultsService],
})
export class ComplianceResultsModule {}
