import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConsumerRecordEntity } from '../entities/consumer-record.entity';
import { CreateConsumerRecordDto } from '../dto/create-consumer-record.dto';
import { UpdateConsumerRecordDto } from '../dto/update-consumer-record.dto';
import { PersonsService } from './persons.service';

@Injectable()
export class ConsumerRecordsService {
  constructor(
    @InjectRepository(ConsumerRecordEntity)
    private readonly repo: Repository<ConsumerRecordEntity>,
    private readonly personsService: PersonsService,
  ) {}

  async create(dto: CreateConsumerRecordDto) {
    await this.personsService.findOne(dto.personId);

    return this.repo.save(
      this.repo.create({
        ...dto,
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
    const record = await this.repo.findOne({
      where: { id },
      relations: { person: true },
    });

    if (!record) throw new NotFoundException(`Consumer record ${id} not found`);
    return record;
  }

  async update(id: string, dto: UpdateConsumerRecordDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }
}