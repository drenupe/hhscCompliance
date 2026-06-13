import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PermissionEntity } from '../entities/permission.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { UserPermissionEntity } from '../entities/user-permission.entity';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionsRepo: Repository<PermissionEntity>,

    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionsRepo: Repository<RolePermissionEntity>,

    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionsRepo: Repository<UserPermissionEntity>,
  ) {}

  async userHasPermission(params: {
    userId: string;
    roleIds?: string[];
    permissionCode: string;
  }): Promise<boolean> {
    const { userId, roleIds = [], permissionCode } = params;

    const directPermission = await this.userPermissionsRepo.findOne({
      where: {
        userId,
        permissionCode,
      },
    });

    if (directPermission?.effect === 'DENY') {
      return false;
    }

    if (directPermission?.effect === 'ALLOW') {
      return true;
    }

    if (!roleIds.length) {
      return false;
    }

    const permission = await this.permissionsRepo.findOne({
      where: {
        code: permissionCode,
        status: 'ACTIVE',
      },
    });

    if (!permission) {
      return false;
    }

    const rolePermission = await this.rolePermissionsRepo.findOne({
      where: {
        roleId: In(roleIds),
        permissionId: permission.id,
      },
    });

    return !!rolePermission;
  }

  async getUserEffectivePermissions(params: {
    userId: string;
    roleIds?: string[];
  }): Promise<string[]> {
    const { userId, roleIds = [] } = params;

    const directPermissions = await this.userPermissionsRepo.find({
      where: { userId },
    });

    const denied = new Set(
      directPermissions
        .filter((permission) => permission.effect === 'DENY')
        .map((permission) => permission.permissionCode),
    );

    const allowed = new Set(
      directPermissions
        .filter((permission) => permission.effect === 'ALLOW')
        .map((permission) => permission.permissionCode),
    );

    if (roleIds.length) {
      const rolePermissions = await this.rolePermissionsRepo.find({
        where: {
          roleId: In(roleIds),
        },
        relations: {
          permission: true,
        },
      });

      for (const rolePermission of rolePermissions) {
        if (
          rolePermission.permission?.status === 'ACTIVE' &&
          !denied.has(rolePermission.permission.code)
        ) {
          allowed.add(rolePermission.permission.code);
        }
      }
    }

    for (const deniedCode of denied) {
      allowed.delete(deniedCode);
    }

    return Array.from(allowed).sort();
  }
}