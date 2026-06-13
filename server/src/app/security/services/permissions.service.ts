import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssignRolePermissionDto } from '../dto/assign-role-permission.dto';
import { AssignUserPermissionDto } from '../dto/assign-user-permission.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionEntity } from '../entities/permission.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserPermissionEntity } from '../entities/user-permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionsRepo: Repository<PermissionEntity>,

    @InjectRepository(RoleEntity)
    private readonly rolesRepo: Repository<RoleEntity>,

    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionsRepo: Repository<RolePermissionEntity>,

    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionsRepo: Repository<UserPermissionEntity>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
    const existing = await this.permissionsRepo.findOne({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`Permission ${dto.code} already exists`);
    }

    return this.permissionsRepo.save(
      this.permissionsRepo.create({
        code: dto.code,
        module: dto.module,
        description: dto.description ?? null,
        status: dto.status ?? 'ACTIVE',
      }),
    );
  }

  findAll(): Promise<PermissionEntity[]> {
    return this.permissionsRepo.find({
      order: {
        module: 'ASC',
        code: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<PermissionEntity> {
    const permission = await this.permissionsRepo.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission ${id} not found`);
    }

    return permission;
  }

  async update(id: string, dto: UpdatePermissionDto): Promise<PermissionEntity> {
    const permission = await this.findOne(id);

    Object.assign(permission, {
      code: dto.code ?? permission.code,
      module: dto.module ?? permission.module,
      description: dto.description ?? permission.description,
      status: dto.status ?? permission.status,
    });

    return this.permissionsRepo.save(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionsRepo.remove(permission);
  }

  async assignToRole(dto: AssignRolePermissionDto): Promise<RolePermissionEntity> {
    const role = await this.rolesRepo.findOne({
      where: { id: dto.roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role ${dto.roleId} not found`);
    }

    const permission = await this.permissionsRepo.findOne({
      where: { id: dto.permissionId },
    });

    if (!permission) {
      throw new NotFoundException(`Permission ${dto.permissionId} not found`);
    }

    const existing = await this.rolePermissionsRepo.findOne({
      where: {
        roleId: dto.roleId,
        permissionId: dto.permissionId,
      },
    });

    if (existing) {
      return existing;
    }

    return this.rolePermissionsRepo.save(
      this.rolePermissionsRepo.create({
        roleId: dto.roleId,
        permissionId: dto.permissionId,
      }),
    );
  }

  async assignToUser(dto: AssignUserPermissionDto): Promise<UserPermissionEntity> {
    const existing = await this.userPermissionsRepo.findOne({
      where: {
        userId: dto.userId,
        permissionCode: dto.permissionCode,
      },
    });

    if (existing) {
      Object.assign(existing, {
        effect: dto.effect ?? existing.effect,
        reason: dto.reason ?? existing.reason,
      });

      return this.userPermissionsRepo.save(existing);
    }

    return this.userPermissionsRepo.save(
      this.userPermissionsRepo.create({
        userId: dto.userId,
        permissionCode: dto.permissionCode,
        effect: dto.effect ?? 'ALLOW',
        reason: dto.reason ?? null,
      }),
    );
  }
}