/* eslint-disable @nx/enforce-module-boundaries */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IssService } from './iss.service';

import { CreateIssProviderDto } from './dto/create-iss-provider.dto';
import { CreateIssStaffLogDto } from './dto/create-iss-staff-log.dto';
import { UpdateIssStaffLogDto } from './dto/update-iss-staff-log.dto';

import { CreateConsumerDto } from '../consumers/dto/create-consumer.dto';

import { IssStaffLog } from './entities/iss-staff-log.entity';
import { Consumer } from '../consumers/entities/consumer.entity';

@Controller({
  path: 'iss',
  version: '1',
})
export class IssController {
  constructor(private readonly svc: IssService) {}

  /* =========================
   * PROVIDERS
   * ========================= */

  @Post('providers')
  createProvider(@Body() dto: CreateIssProviderDto) {
    return this.svc.createProvider(dto);
  }

  @Get('providers')
  listProviders() {
    return this.svc.findAllProviders();
  }

  /* =========================
   * CONSUMERS
   * ========================= */

  @Post('consumers')
  createConsumer(@Body() dto: CreateConsumerDto) {
    return this.svc.createConsumer(dto);
  }

  @Get('consumers')
  listConsumers(
    @Query('issProviderId', ParseIntPipe) issProviderId: number,
  ) {
    return this.svc.findConsumersByProvider(issProviderId);
  }

  /* =========================
   * STAFF LOGS (8615)
   * ========================= */

  @Post('staff-logs')
  createStaffLog(@Body() dto: CreateIssStaffLogDto): Promise<IssStaffLog> {
    return this.svc.createStaffLog(dto);
  }

  @Get('staff-logs/:consumerId')
  listStaffLogs(
    @Param('consumerId', ParseIntPipe) consumerId: number,
  ): Promise<IssStaffLog[]> {
    return this.svc.findStaffLogsForConsumer(consumerId);
  }

  // 🔄 Update existing staff log
  @Patch('staff-logs/:id')
  updateStaffLog(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIssStaffLogDto,
  ): Promise<IssStaffLog> {
    return this.svc.updateStaffLog(id, dto);
  }

  /* =========================
   * CONSUMER + LATEST / BY DATE
   * ========================= */

  // Most recent log (legacy endpoint, still useful)
  @Get('consumer/:id/latest-log')
  getConsumerWithLatestLog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ consumer: Consumer; latestLog: IssStaffLog | null }> {
    return this.svc.getConsumerWithLatestLog(id);
  }

  // ✅ Latest-or-template for a specific date
  // GET /api/v1/iss/consumer/1/log?date=2025-10-06
  @Get('consumer/:id/log')
  getConsumerLogForDate(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date?: string,
  ): Promise<{
    consumer: Consumer;
    log: IssStaffLog | null;
    defaultTemplate?: any;
  }> {
    return this.svc.getLogForConsumerAndDate(id, date);
  }

  /* =========================
   * LIST WEEKS FOR CONSUMER
   * ========================= */

  // GET /api/v1/iss/consumer/1/weeks?page=1&limit=52
  @Get('consumer/:id/weeks')
  listWeeksForConsumer(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    const page = pageRaw ? parseInt(pageRaw, 10) || 1 : 1;
    const limit = limitRaw ? parseInt(limitRaw, 10) || 52 : 52;

    return this.svc.listWeeksForConsumer(id, page, limit);
  }
}
