import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResidentialAssignmentEntity } from '../entities/residential-assignment.entity';
import { CreateResidentialAssignmentDto } from '../dto/create-residential-assignment.dto';

@Injectable()
export class ResidentialAssignmentsService {
  constructor(
    @InjectRepository(ResidentialAssignmentEntity)
    private readonly repo: Repository<ResidentialAssignmentEntity>,
  ) {}

  async create(dto: CreateResidentialAssignmentDto) {
    const existingActive = await this.repo.findOne({
      where: {
        consumerRecordId: dto.consumerRecordId,
        status: 'ACTIVE',
      },
    });

    if (existingActive) {
      throw new BadRequestException(
        'Consumer already has an active residential assignment. End the current assignment before creating a new one.',
      );
    }

    try {
      return await this.repo.save(
        this.repo.create({
          ...dto,
          status: dto.status ?? 'ACTIVE',
          endDate: dto.endDate ?? null,
        }),
      );
    } catch (error: any) {
      if (
        error?.code === '23505' &&
        error?.constraint === 'ux_res_assign_one_active_consumer'
      ) {
        throw new BadRequestException(
          'Consumer already has an active residential assignment. End the current assignment before creating a new one.',
        );
      }
      throw error;
    }
  }

  findByLocation(locationId: string) {
    return this.repo.find({
      where: { locationId, status: 'ACTIVE' },
      relations: {
        consumerRecord: { person: true },
        location: true,
      },
      order: { startDate: 'ASC' },
    });
  }

  findByConsumer(consumerRecordId: string) {
    return this.repo.find({
      where: { consumerRecordId },
      relations: {
        consumerRecord: { person: true },
        location: true,
      },
      order: { startDate: 'DESC' },
    });
  }

  async end(id: string, endDate: string) {
    const assignment = await this.repo.findOne({ where: { id } });

    if (!assignment) {
      throw new NotFoundException(`Residential assignment ${id} not found`);
    }

    assignment.endDate = endDate;
    assignment.status = 'INACTIVE';

    return this.repo.save(assignment);
  }
}