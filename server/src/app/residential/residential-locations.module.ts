import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResidentialLocationEntity } from './residential-location.entity';
import { ResidentialLocationsService } from './residential-locations.service';
import { ResidentialLocationsController } from './residential-locations.controller';

import { ProviderEntity } from '../providers/provider.entity';
import { AuditModule } from '../audit/audit.module';
import { ComplianceResultEntity } from '../compliance/entities/compliance-result.entity';

// ✅ NEW: compliance storage entity (Phase 2)

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResidentialLocationEntity,
      ProviderEntity,
      ComplianceResultEntity, // ✅ enables @InjectRepository(ComplianceResultEntity)
    ]),
    AuditModule,
  ],
  controllers: [ResidentialLocationsController],
  providers: [ResidentialLocationsService],
  exports: [ResidentialLocationsService],
})
export class ResidentialLocationsModule {}
