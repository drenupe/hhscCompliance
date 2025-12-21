/* eslint-disable @nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Consumer } from './entities/consumer.entity';
import { ConsumersService } from './consumers.service';
import { ConsumersController } from './consumers.controller';
import { IssProvider } from '../iss/entities/iss-provider.entity'; // 👈 adjust path if needed

@Module({
  imports: [
    // 👇 Register both repositories used in ConsumersService
    TypeOrmModule.forFeature([Consumer, IssProvider]),
  ],
  providers: [ConsumersService],
  controllers: [ConsumersController],
  exports: [ConsumersService], // so IssModule can inject it
})
export class ConsumersModule {}
