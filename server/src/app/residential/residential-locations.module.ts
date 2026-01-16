import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResidentialLocationEntity } from './residential-location.entity';
import { ResidentialLocationsService } from './residential-locations.service';
import { ResidentialLocationsController } from './residential-locations.controller';
import { ProviderEntity } from '../providers/provider.entity';

import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([ResidentialLocationEntity, ProviderEntity]), AuditModule,],
  controllers: [ResidentialLocationsController],
  providers: [ResidentialLocationsService],
  exports: [ResidentialLocationsService],
})
export class ResidentialLocationsModule {}
