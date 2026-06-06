import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClinicalContactProfileEntity } from '../entities/clinical-contact-profile.entity';
import { CreateClinicalContactProfileDto } from '../dto/create-clinical-contact-profile.dto';
import { PersonsService } from './persons.service';

@Injectable()
export class ClinicalContactProfilesService {
  constructor(
    @InjectRepository(ClinicalContactProfileEntity)
    private readonly repo: Repository<ClinicalContactProfileEntity>,
    private readonly personsService: PersonsService,
  ) {}

  async create(dto: CreateClinicalContactProfileDto) {
    await this.personsService.findOne(dto.personId);

    return this.repo.save(
      this.repo.create({
        ...dto,
        organization: dto.organization ?? null,
        npi: dto.npi ?? null,
        licenseNumber: dto.licenseNumber ?? null,
        phone: dto.phone ?? null,
        fax: dto.fax ?? null,
        status: dto.status ?? 'ACTIVE',
      }),
    );
  }

  findAll() {
    return this.repo.find({
      relations: { person: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const profile = await this.repo.findOne({
      where: { id },
      relations: { person: true },
    });

    if (!profile) {
      throw new NotFoundException(`Clinical contact profile ${id} not found`);
    }

    return profile;
  }
}