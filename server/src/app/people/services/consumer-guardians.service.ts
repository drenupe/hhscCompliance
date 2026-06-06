// server/src/app/people/services/consumer-guardians.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateConsumerGuardianDto } from '../dto/create-consumer-guardian.dto';
import { UpdateConsumerGuardianDto } from '../dto/update-consumer-guardian.dto';
import { ConsumerGuardianEntity } from '../entities/consumer-guardian.entity';
import { ConsumerRecordsService } from './consumer-records.service';

@Injectable()
export class ConsumerGuardiansService {
  constructor(
    @InjectRepository(ConsumerGuardianEntity)
    private readonly guardiansRepo: Repository<ConsumerGuardianEntity>,
    private readonly consumerRecords: ConsumerRecordsService,
  ) {}

  async create(dto: CreateConsumerGuardianDto) {
    await this.consumerRecords.findOne(dto.consumerRecordId);

    return this.guardiansRepo.save(
      this.guardiansRepo.create({
        ...dto,
        relationship: dto.relationship ?? null,
        phone: dto.phone ?? null,
        email: dto.email ?? null,
        address: dto.address ?? null,
        isPrimaryGuardian: dto.isPrimaryGuardian ?? false,
        isEmergencyContact: dto.isEmergencyContact ?? false,
        hasMedicalDecisionAuthority: dto.hasMedicalDecisionAuthority ?? false,
        hasFinancialDecisionAuthority:
          dto.hasFinancialDecisionAuthority ?? false,
        status: dto.status ?? 'ACTIVE',
        notes: dto.notes ?? null,
      }),
    );
  }

  findAll() {
    return this.guardiansRepo.find({
      relations: { consumerRecord: { person: true } },
      order: { createdAt: 'DESC' },
    });
  }

  findByConsumer(consumerRecordId: string) {
    return this.guardiansRepo.find({
      where: { consumerRecordId },
      relations: { consumerRecord: { person: true } },
      order: { isPrimaryGuardian: 'DESC', lastName: 'ASC' },
    });
  }

  async findOne(id: string) {
    const guardian = await this.guardiansRepo.findOne({
      where: { id },
      relations: { consumerRecord: { person: true } },
    });

    if (!guardian) {
      throw new NotFoundException(`Consumer guardian ${id} not found`);
    }

    return guardian;
  }

  async update(id: string, dto: UpdateConsumerGuardianDto) {
    const guardian = await this.findOne(id);
    Object.assign(guardian, dto);
    return this.guardiansRepo.save(guardian);
  }

  async remove(id: string) {
    const guardian = await this.findOne(id);
    await this.guardiansRepo.remove(guardian);
  }
}