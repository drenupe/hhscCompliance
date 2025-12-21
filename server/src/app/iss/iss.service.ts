/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IssProvider } from './entities/iss-provider.entity';
import { IssStaffLog } from './entities/iss-staff-log.entity';

import { CreateIssProviderDto } from './dto/create-iss-provider.dto';
import { CreateIssStaffLogDto } from './dto/create-iss-staff-log.dto';
import { UpdateIssStaffLogDto } from './dto/update-iss-staff-log.dto';
import { UpdateIssProviderDto } from './dto/update-iss-provider.dto';

import { ConsumersService } from '../consumers/consumers.service';
import { Consumer } from '../consumers/entities/consumer.entity';
import { CreateConsumerDto } from '../consumers/dto/create-consumer.dto';

@Injectable()
export class IssService {
  constructor(
    @InjectRepository(IssProvider)
    private readonly providerRepo: Repository<IssProvider>,

    @InjectRepository(IssStaffLog)
    private readonly staffLogRepo: Repository<IssStaffLog>,

    private readonly consumersService: ConsumersService,
  ) {}

  /* =========================
   * PROVIDERS - CRUD
   * ========================= */

  async createProvider(dto: CreateIssProviderDto): Promise<IssProvider> {
    const provider = this.providerRepo.create({
      name: dto.name,
      licenseNumber: dto.licenseNumber,
    });

    return this.providerRepo.save(provider);
  }

  async findAllProviders(): Promise<IssProvider[]> {
    return this.providerRepo.find({
      order: { name: 'ASC' },
    });
  }

  async findProviderById(id: number): Promise<IssProvider> {
    const provider = await this.providerRepo.findOne({ where: { id } });

    if (!provider) {
      throw new NotFoundException(`ISS provider ${id} not found`);
    }

    return provider;
  }

  async updateProvider(
    id: number,
    dto: UpdateIssProviderDto,
  ): Promise<IssProvider> {
    const provider = await this.findProviderById(id);
    const merged = this.providerRepo.merge(provider, dto);
    return this.providerRepo.save(merged);
  }

  async removeProvider(id: number): Promise<void> {
    const provider = await this.findProviderById(id);
    await this.providerRepo.remove(provider);
  }

  /* =========================
   * CONSUMERS - delegated to ConsumersService
   * ========================= */

  async createConsumer(dto: CreateConsumerDto): Promise<Consumer> {
    // mirrors POST /v1/iss/consumers in IssController
    return this.consumersService.create(dto);
  }

  async findConsumersByProvider(
    issProviderId: number,
  ): Promise<Consumer[]> {
    // mirrors GET /v1/iss/consumers?issProviderId=...
    return this.consumersService.findByProvider(issProviderId);
  }

  /* =========================
   * STAFF LOGS (8615) - CREATE
   * ========================= */

  async createStaffLog(dto: CreateIssStaffLogDto): Promise<IssStaffLog> {
    const consumer: Consumer = await this.consumersService.findOne(
      dto.consumerId,
    );

    if (!consumer.issProvider) {
      throw new NotFoundException(
        `Consumer ${dto.consumerId} has no associated ISS provider`,
      );
    }

    // Strip DTO-only field
    const { consumerId, ...rest } = dto;

    const log = this.staffLogRepo.create({
      ...rest, // header, serviceWeek, weeklySections, notes, serviceDate
      consumer,
      issProvider: consumer.issProvider,
    });

    return this.staffLogRepo.save(log);
  }

  /* =========================
   * STAFF LOGS (8615) - READ / LIST
   * ========================= */

  async findStaffLogById(id: number): Promise<IssStaffLog> {
    const log = await this.staffLogRepo.findOne({
      where: { id },
      relations: ['consumer', 'issProvider'],
    });

    if (!log) {
      throw new NotFoundException(`ISS staff log ${id} not found`);
    }

    return log;
  }

  async findStaffLogsForConsumer(
    consumerId: number,
  ): Promise<IssStaffLog[]> {
    return this.staffLogRepo.find({
      where: { consumer: { id: consumerId } },
      relations: ['consumer', 'issProvider'],
      order: {
        serviceDate: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  /* =========================
   * STAFF LOGS (8615) - UPDATE
   * ========================= */

  async updateStaffLog(
    id: number,
    dto: UpdateIssStaffLogDto,
  ): Promise<IssStaffLog> {
    const existing = await this.findStaffLogById(id);

    const { consumerId, ...rest } = dto as any;

    const merged = this.staffLogRepo.merge(
      existing,
      rest as Partial<IssStaffLog>,
    );

    return this.staffLogRepo.save(merged);
  }

  /* =========================
   * STAFF LOGS (8615) - DELETE
   * ========================= */

  async removeStaffLog(id: number): Promise<void> {
    const existing = await this.findStaffLogById(id);
    await this.staffLogRepo.remove(existing);
  }

  /* =========================
   * CONSUMER + LATEST LOG
   * ========================= */

  async getConsumerWithLatestLog(
    consumerId: number,
  ): Promise<{ consumer: Consumer; latestLog: IssStaffLog | null }> {
    const consumer = await this.consumersService.findOne(consumerId);

    const latestLog = await this.staffLogRepo.findOne({
      where: { consumer: { id: consumerId } },
      relations: ['consumer', 'issProvider'],
      order: {
        serviceDate: 'DESC',
        createdAt: 'DESC',
      },
    });

    return { consumer, latestLog };
  }

  /* =========================
   * LATEST OR DEFAULT TEMPLATE BY DATE
   * ========================= */

  async getLogForConsumerAndDate(
    consumerId: number,
    dateIso?: string,
  ): Promise<{
    consumer: Consumer;
    log: IssStaffLog | null;
    defaultTemplate?: any;
  }> {
    const consumer = await this.consumersService.findOne(consumerId);

    const targetDate = dateIso ?? new Date().toISOString().slice(0, 10);

    const log = await this.staffLogRepo.findOne({
      where: {
        consumer: { id: consumerId },
        serviceDate: targetDate as any,
      },
      relations: ['consumer', 'issProvider'],
    });

    if (log) {
      return { consumer, log };
    }

    const fullName = `${consumer.firstName} ${consumer.lastName}`;
    const provider = consumer.issProvider;

    const lonValue =
      (consumer as any).levelOfNeed ??
      (consumer as any).level_of_need ??
      '';

    const defaultTemplate = {
      serviceDate: targetDate,
      header: {
        individualName: fullName,
        date: targetDate,
        lon: lonValue,
        provider: provider?.name ?? '',
        license: provider?.licenseNumber ?? '',
        staffNameTitle: 'ISS Direct Care Staff',
      },
      serviceWeek: [],
      weeklySections: {},
      notes: [],
    };

    return { consumer, log: null, defaultTemplate };
  }

  /* =========================
   * LIST WEEKS FOR CONSUMER (1–N, paginated)
   * ========================= */

  async listWeeksForConsumer(
    consumerId: number,
    page = 1,
    limit = 52,
  ): Promise<{
    data: { weekNumber: number; serviceDate: string; staffLogId: number }[];
    meta: { total: number; page: number; limit: number; pageCount: number };
  }> {
    const take = Math.min(Math.max(limit, 1), 52);
    const safePage = Math.max(page, 1);
    const skip = (safePage - 1) * take;

    const [logs, total] = await this.staffLogRepo.findAndCount({
      where: { consumer: { id: consumerId } },
      order: { serviceDate: 'ASC' },
      select: ['id', 'serviceDate'],
      skip,
      take,
    });

    const data = logs.map((log, index) => {
      const rawDate = log.serviceDate as unknown as Date | string;
      const asDate =
        rawDate instanceof Date ? rawDate : new Date(rawDate as string);

      return {
        weekNumber: skip + index + 1,
        serviceDate: asDate.toISOString().slice(0, 10),
        staffLogId: log.id,
      };
    });

    return {
      data,
      meta: {
        total,
        page: safePage,
        limit: take,
        pageCount: Math.ceil(total / take) || 1,
      },
    };
  }
}
