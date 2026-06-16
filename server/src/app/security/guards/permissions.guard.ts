import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  REQUIRED_PERMISSIONS_KEY,
} from '../decorators/require-permission.decorator';
import { PermissionCode } from '../constants/permission-codes';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<PermissionCode[]>(
        REQUIRED_PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? [];

    if (!requiredPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    const userId = user.sub ?? user.id ?? user.userId;

    if (!userId) {
      throw new UnauthorizedException('Authenticated user id missing');
    }

    const roleIds = user.roleIds ?? user.roles ?? [];

    for (const permission of requiredPermissions) {
      const allowed = await this.authorizationService.userHasPermission({
        userId,
        roleIds,
        permissionCode: permission,
      });

      if (!allowed) {
        throw new ForbiddenException(
          `Missing required permission: ${permission}`,
        );
      }
    }

    return true;
  }
}