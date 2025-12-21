import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleCatalog, RaciAssignment, RoleCatalog } from './raci.entities';
import { RaciService } from './raci.service';
import { RaciController } from './raci.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoleCatalog, ModuleCatalog, RaciAssignment])],
  providers: [RaciService],
  controllers: [RaciController],
  exports: [RaciService],
})
export class RaciModule {}
