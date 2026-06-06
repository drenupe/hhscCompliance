// server/src/app/people/services/consumer-diagnoses.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateConsumerDiagnosisDto } from '../dto/create-consumer-diagnosis.dto';
import { UpdateConsumerDiagnosisDto } from '../dto/update-consumer-diagnosis.dto';
import { ConsumerDiagnosisEntity } from '../entities/consumer-diagnosis.entity';
import { ConsumerRecordsService } from './consumer-records.service';

@Injectable()
export class ConsumerDiagnosesService {
  constructor(
    @InjectRepository(ConsumerDiagnosisEntity)
    private readonly diagnosisRepo: Repository<ConsumerDiagnosisEntity>,
    private readonly consumerRecords: ConsumerRecordsService,
  ) {}

  async create(dto: CreateConsumerDiagnosisDto): Promise<ConsumerDiagnosisEntity> {
    await this.consumerRecords.findOne(dto.consumerRecordId);

    const diagnosis = this.diagnosisRepo.create({
      consumerRecordId: dto.consumerRecordId,
      icd10Code: dto.icd10Code ?? null,
      diagnosisName: dto.diagnosisName,
      isPrimary: dto.isPrimary ?? false,
      effectiveDate: dto.effectiveDate ?? null,
      resolvedDate: dto.resolvedDate ?? null,
      status: dto.status ?? 'ACTIVE',
      notes: dto.notes ?? null,
    });

    return this.diagnosisRepo.save(diagnosis);
  }

  findAll(): Promise<ConsumerDiagnosisEntity[]> {
    return this.diagnosisRepo.find({
      relations: {
        consumerRecord: {
          person: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findByConsumer(consumerRecordId: string): Promise<ConsumerDiagnosisEntity[]> {
    return this.diagnosisRepo.find({
      where: { consumerRecordId },
      relations: {
        consumerRecord: {
          person: true,
        },
      },
      order: {
        isPrimary: 'DESC',
        diagnosisName: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<ConsumerDiagnosisEntity> {
    const diagnosis = await this.diagnosisRepo.findOne({
      where: { id },
      relations: {
        consumerRecord: {
          person: true,
        },
      },
    });

    if (!diagnosis) {
      throw new NotFoundException(`Consumer diagnosis ${id} not found`);
    }

    return diagnosis;
  }

  async update(
    id: string,
    dto: UpdateConsumerDiagnosisDto,
  ): Promise<ConsumerDiagnosisEntity> {
    const diagnosis = await this.findOne(id);

    Object.assign(diagnosis, {
      icd10Code: dto.icd10Code ?? diagnosis.icd10Code,
      diagnosisName: dto.diagnosisName ?? diagnosis.diagnosisName,
      isPrimary: dto.isPrimary ?? diagnosis.isPrimary,
      effectiveDate: dto.effectiveDate ?? diagnosis.effectiveDate,
      resolvedDate: dto.resolvedDate ?? diagnosis.resolvedDate,
      status: dto.status ?? diagnosis.status,
      notes: dto.notes ?? diagnosis.notes,
    });

    return this.diagnosisRepo.save(diagnosis);
  }

  async remove(id: string): Promise<void> {
    const diagnosis = await this.findOne(id);
    await this.diagnosisRepo.remove(diagnosis);
  }
}