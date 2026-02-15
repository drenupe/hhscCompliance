import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FireDrillEntity } from './fire-drill.entity';
import { FireDrillsController } from './fire-drills.controller';
import { FireDrillsService } from './fire-drills.service';
import { ProviderEntity } from '../providers/provider.entity';
import { AuditModule } from '../audit/audit.module';

import { ComplianceEngineModule } from '../compliance-engine/compliance-engine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FireDrillEntity, ProviderEntity]),
    AuditModule,
    ComplianceEngineModule,
  ],
  controllers: [FireDrillsController],
  providers: [FireDrillsService],
  exports: [FireDrillsService],
})
export class FireDrillsModule {}
