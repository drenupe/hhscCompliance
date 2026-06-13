import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepo: Repository<RoleEntity>,
  ) {}

  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const existing = await this.rolesRepo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(`Role ${dto.name} already exists`);
    }

    return this.rolesRepo.save(
      this.rolesRepo.create({
        name: dto.name,
        description: dto.description ?? null,
        status: dto.status ?? 'ACTIVE',
      }),
    );
  }

  findAll(): Promise<RoleEntity[]> {
    return this.rolesRepo.find({
      order: { name: 'ASC' },
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<RoleEntity> {
    const role = await this.rolesRepo.findOne({
      where: { id },
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }

    return role;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOne(id);

    Object.assign(role, {
      name: dto.name ?? role.name,
      description: dto.description ?? role.description,
      status: dto.status ?? role.status,
    });

    return this.rolesRepo.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.rolesRepo.remove(role);
  }
}