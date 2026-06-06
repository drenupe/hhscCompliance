import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { PersonEntity } from '../entities/person.entity';
import { CreatePersonDto } from '../dto/create-person.dto';
import { UpdatePersonDto } from '../dto/update-person.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly peopleRepo: Repository<PersonEntity>,
  ) {}

  create(dto: CreatePersonDto) {
    return this.peopleRepo.save(
      this.peopleRepo.create({
        ...dto,
        state: dto.state ?? 'TX',
        status: 'ACTIVE',
      }),
    );
  }

  findAll() {
    return this.peopleRepo.find({
      where: { deletedAt: IsNull() },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findOne(id: string) {
    const person = await this.peopleRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!person) throw new NotFoundException(`Person ${id} not found`);
    return person;
  }

  async update(id: string, dto: UpdatePersonDto) {
    const person = await this.findOne(id);
    Object.assign(person, dto);
    return this.peopleRepo.save(person);
  }

  async remove(id: string) {
    const person = await this.findOne(id);
    await this.peopleRepo.softRemove(person);
  }
}