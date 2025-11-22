/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Consumer } from './entities/consumer.entity';
import { IssProvider } from '../iss/entities/iss-provider.entity';

import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';

@Injectable()
export class ConsumersService {
  constructor(
    @InjectRepository(Consumer)
    private readonly consumerRepo: Repository<Consumer>,

    @InjectRepository(IssProvider)
    private readonly providerRepo: Repository<IssProvider>,
  ) {}

  /* =========================
   * CREATE
   * ========================= */

  async create(dto: CreateConsumerDto): Promise<Consumer> {
    const provider = await this.providerRepo.findOne({
      where: { id: dto.issProviderId },
    });

    if (!provider) {
      throw new NotFoundException(
        `ISS provider with id ${dto.issProviderId} not found`,
      );
    }

    const { issProviderId, ...rest } = dto;

    const consumer = this.consumerRepo.create({
      ...rest,
      issProvider: provider,
    });

    return this.consumerRepo.save(consumer);
  }

  /* =========================
   * READ
   * ========================= */

  async findAll(): Promise<Consumer[]> {
    return this.consumerRepo.find({
      relations: ['issProvider'],
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });
  }

  async findByProvider(issProviderId: number): Promise<Consumer[]> {
    return this.consumerRepo.find({
      where: { issProvider: { id: issProviderId } },
      relations: ['issProvider'],
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Consumer> {
    const consumer = await this.consumerRepo.findOne({
      where: { id },
      relations: ['issProvider'],
    });

    if (!consumer) {
      throw new NotFoundException(`Consumer ${id} not found`);
    }

    return consumer;
  }

  /* =========================
   * UPDATE
   * ========================= */

  async update(id: number, dto: UpdateConsumerDto): Promise<Consumer> {
    const consumer = await this.consumerRepo.findOne({
      where: { id },
      relations: ['issProvider'],
    });

    if (!consumer) {
      throw new NotFoundException(`Consumer ${id} not found`);
    }

    // If ISS provider is being changed
    if (dto.issProviderId !== undefined) {
      const provider = await this.providerRepo.findOne({
        where: { id: dto.issProviderId },
      });

      if (!provider) {
        throw new NotFoundException(
          `ISS provider with id ${dto.issProviderId} not found`,
        );
      }

      consumer.issProvider = provider;
      delete (dto as any).issProviderId;
    }

    Object.assign(consumer, dto);
    return this.consumerRepo.save(consumer);
  }
}
