// server/src/app/people/services/medicaid-benefits.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMedicaidBenefitsDto } from '../dto/create-medicaid-benefits.dto';
import { UpdateMedicaidBenefitsDto } from '../dto/update-medicaid-benefits.dto';
import { MedicaidBenefitsEntity } from '../entities/medicaid-benefits.entity';
import { ConsumerRecordsService } from './consumer-records.service';

@Injectable()
export class MedicaidBenefitsService {
  constructor(
    @InjectRepository(MedicaidBenefitsEntity)
    private readonly benefitsRepo: Repository<MedicaidBenefitsEntity>,
    private readonly consumerRecords: ConsumerRecordsService,
  ) {}

  async create(dto: CreateMedicaidBenefitsDto) {
    await this.consumerRecords.findOne(dto.consumerRecordId);

    return this.benefitsRepo.save(
      this.benefitsRepo.create({
        consumerRecordId: dto.consumerRecordId,
        medicaidNumber: dto.medicaidNumber,
        waiverProgram: dto.waiverProgram ?? null,
        mcoName: dto.mcoName ?? null,
        eligibilityStatus: dto.eligibilityStatus ?? 'ACTIVE',
        effectiveDate: dto.effectiveDate ?? null,
        renewalDate: dto.renewalDate ?? null,
        notes: dto.notes ?? null,
      }),
    );
  }

  findAll() {
    return this.benefitsRepo.find({
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

  findByConsumer(consumerRecordId: string) {
    return this.benefitsRepo.find({
      where: { consumerRecordId },
      relations: {
        consumerRecord: {
          person: true,
        },
      },
    });
  }

  async findOne(id: string) {
    const benefit = await this.benefitsRepo.findOne({
      where: { id },
      relations: {
        consumerRecord: {
          person: true,
        },
      },
    });

    if (!benefit) {
      throw new NotFoundException(
        `Medicaid benefit record ${id} not found`,
      );
    }

    return benefit;
  }

  async update(id: string, dto: UpdateMedicaidBenefitsDto) {
    const benefit = await this.findOne(id);

    Object.assign(benefit, dto);

    return this.benefitsRepo.save(benefit);
  }

  async remove(id: string) {
    const benefit = await this.findOne(id);
    await this.benefitsRepo.remove(benefit);
  }
}