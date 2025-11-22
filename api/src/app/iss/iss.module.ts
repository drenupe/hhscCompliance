/* eslint-disable @nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssProvider } from './entities/iss-provider.entity';
import { IssStaffLog } from './entities/iss-staff-log.entity';

import { IssService } from './iss.service';
import { IssController } from './iss.controller';

import { ConsumersModule } from '../consumers/consumers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IssProvider, IssStaffLog]),
    ConsumersModule, // 👈 this makes ConsumersService visible here
  ],
  providers: [IssService],
  controllers: [IssController],
  exports: [IssService],
})
export class IssModule {}
