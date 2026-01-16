import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderEntity } from './provider.entity';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { AuditModule } from '../audit/audit.module';
import { ResidentialLocationsModule } from '../residential/residential-locations.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProviderEntity]), AuditModule, ResidentialLocationsModule],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
