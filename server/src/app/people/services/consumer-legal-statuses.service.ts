// server/src/app/people/services/consumer-legal-statuses.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateConsumerLegalStatusDto } from '../dto/create-consumer-legal-status.dto';
import { UpdateConsumerLegalStatusDto } from '../dto/update-consumer-legal-status.dto';
import { ConsumerLegalStatusEntity } from '../entities/consumer-legal-status.entity';
import { ConsumerRecordsService } from './consumer-records.service';

@Injectable()
export class ConsumerLegalStatusesService {
  constructor(
    @InjectRepository(ConsumerLegalStatusEntity)
    private readonly legalStatusRepo: Repository<ConsumerLegalStatusEntity>,
    private readonly consumerRecords: ConsumerRecordsService,
  ) {}

  async create(dto: CreateConsumerLegalStatusDto) {
    await this.consumerRecords.findOne(dto.consumerRecordId);

    return this.legalStatusRepo.save(
      this.legalStatusRepo.create({
        consumerRecordId: dto.consumerRecordId,
        legalStatusType: dto.legalStatusType,
        courtOrderDate: dto.courtOrderDate ?? null,
        effectiveDate: dto.effectiveDate ?? null,
        expirationDate: dto.expirationDate ?? null,
        notes: dto.notes ?? null,
        status: dto.status ?? 'ACTIVE',
      }),
    );
  }

  findAll() {
    return this.legalStatusRepo.find({
      relations: { consumerRecord: { person: true } },
      order: { createdAt: 'DESC' },
    });
  }

  findByConsumer(consumerRecordId: string) {
    return this.legalStatusRepo.find({
      where: { consumerRecordId },
      relations: { consumerRecord: { person: true } },
      order: { effectiveDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const legalStatus = await this.legalStatusRepo.findOne({
      where: { id },
      relations: { consumerRecord: { person: true } },
    });

    if (!legalStatus) {
      throw new NotFoundException(`Consumer legal status ${id} not found`);
    }

    return legalStatus;
  }

  async update(id: string, dto: UpdateConsumerLegalStatusDto) {
    const legalStatus = await this.findOne(id);

    Object.assign(legalStatus, {
      legalStatusType: dto.legalStatusType ?? legalStatus.legalStatusType,
      courtOrderDate: dto.courtOrderDate ?? legalStatus.courtOrderDate,
      effectiveDate: dto.effectiveDate ?? legalStatus.effectiveDate,
      expirationDate: dto.expirationDate ?? legalStatus.expirationDate,
      notes: dto.notes ?? legalStatus.notes,
      status: dto.status ?? legalStatus.status,
    });

    return this.legalStatusRepo.save(legalStatus);
  }

  async remove(id: string) {
    const legalStatus = await this.findOne(id);
    await this.legalStatusRepo.remove(legalStatus);
  }
}