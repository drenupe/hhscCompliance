import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConsumerCareTeamAssignmentEntity } from '../entities/consumer-care-team-assignment.entity';
import { CreateConsumerCareTeamAssignmentDto } from '../dto/create-consumer-care-team-assignment.dto';
import { UpdateConsumerCareTeamAssignmentDto } from '../dto/update-consumer-care-team-assignment.dto';
import { ConsumerRecordsService } from './consumer-records.service';
import { EmployeeProfilesService } from './employee-profiles.service';
import { ClinicalContactProfilesService } from './clinical-contact-profiles.service';

@Injectable()
export class CareTeamAssignmentsService {
  constructor(
    @InjectRepository(ConsumerCareTeamAssignmentEntity)
    private readonly repo: Repository<ConsumerCareTeamAssignmentEntity>,
    private readonly consumerRecordsService: ConsumerRecordsService,
    private readonly employeeProfilesService: EmployeeProfilesService,
    private readonly clinicalContactsService: ClinicalContactProfilesService,
  ) {}

  async create(dto: CreateConsumerCareTeamAssignmentDto) {
    const hasEmployee = Boolean(dto.employeeProfileId);
    const hasClinical = Boolean(dto.clinicalContactProfileId);

    if (hasEmployee === hasClinical) {
      throw new BadRequestException(
        'Care team assignment must reference exactly one employeeProfileId or clinicalContactProfileId.',
      );
    }

    await this.consumerRecordsService.findOne(dto.consumerRecordId);

    if (dto.employeeProfileId) {
      await this.employeeProfilesService.findOne(dto.employeeProfileId);
    }

    if (dto.clinicalContactProfileId) {
      await this.clinicalContactsService.findOne(dto.clinicalContactProfileId);
    }

    const existing = await this.repo.findOne({
      where: {
        consumerRecordId: dto.consumerRecordId,
        role: dto.role,
        status: 'ACTIVE',
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Consumer already has an active ${dto.role} care team assignment. End the current assignment before creating a new one.`,
      );
    }

    return this.repo.save(
      this.repo.create({
        ...dto,
        employeeProfileId: dto.employeeProfileId ?? null,
        clinicalContactProfileId: dto.clinicalContactProfileId ?? null,
        endDate: dto.endDate ?? null,
        status: dto.status ?? 'ACTIVE',
      }),
    );
  }

  findByConsumer(consumerRecordId: string) {
    return this.repo.find({
      where: { consumerRecordId, status: 'ACTIVE' },
      relations: {
        employeeProfile: { person: true },
        clinicalContactProfile: { person: true },
        consumerRecord: { person: true },
      },
      order: { role: 'ASC', startDate: 'ASC' },
    });
  }

  async findOne(id: string) {
    const assignment = await this.repo.findOne({
      where: { id },
      relations: {
        employeeProfile: { person: true },
        clinicalContactProfile: { person: true },
        consumerRecord: { person: true },
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Care team assignment ${id} not found`);
    }

    return assignment;
  }

  async update(id: string, dto: UpdateConsumerCareTeamAssignmentDto) {
    const assignment = await this.findOne(id);
    Object.assign(assignment, dto);
    return this.repo.save(assignment);
  }

  async end(id: string, endDate: string) {
    const assignment = await this.findOne(id);
    assignment.endDate = endDate;
    assignment.status = 'INACTIVE';
    return this.repo.save(assignment);
  }
}