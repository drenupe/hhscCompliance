import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmployeeProfileEntity } from '../entities/employee-profile.entity';
import { CreateEmployeeProfileDto } from '../dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from '../dto/update-employee-profile.dto';
import { PersonsService } from './persons.service';

@Injectable()
export class EmployeeProfilesService {
  constructor(
    @InjectRepository(EmployeeProfileEntity)
    private readonly repo: Repository<EmployeeProfileEntity>,
    private readonly personsService: PersonsService,
  ) {}

  async create(dto: CreateEmployeeProfileDto) {
    await this.personsService.findOne(dto.personId);

    return this.repo.save(
      this.repo.create({
        ...dto,
        employeeNumber: dto.employeeNumber ?? null,
        jobTitle: dto.jobTitle ?? null,
        hireDate: dto.hireDate ?? null,
        terminationDate: dto.terminationDate ?? null,
        credentials: dto.credentials ?? null,
        isDirectCare: dto.isDirectCare ?? false,
        isCaseManager: dto.isCaseManager ?? false,
        isNurse: dto.isNurse ?? false,
        requiresBackgroundCheck: dto.requiresBackgroundCheck ?? true,
        backgroundCheckDate: dto.backgroundCheckDate ?? null,
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

    if (!profile) throw new NotFoundException(`Employee profile ${id} not found`);
    return profile;
  }

  async update(id: string, dto: UpdateEmployeeProfileDto) {
    const profile = await this.findOne(id);
    Object.assign(profile, dto);
    return this.repo.save(profile);
  }
}