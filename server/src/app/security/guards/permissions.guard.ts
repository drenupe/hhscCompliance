import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PermissionCode } from '../constants/permission-codes';
import { REQUIRED_PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { AuthorizationService } from '../services/authorization.service';

type AuthenticatedRequestUser = {
  sub?: string;
  id?: string;
  userId?: string;
  email?: string;
  roles?: string[];
  roleIds?: string[];
};

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

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedRequestUser | undefined;



    if (!requiredPermissions.length) {
      return true;
    }

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    const userId = user.userId ?? user.id ?? user.sub;

    if (!userId) {
      throw new UnauthorizedException('Authenticated user id missing');
    }

    const roleIds = user.roleIds ?? user.roles ?? [];

    for (const permissionCode of requiredPermissions) {
      const allowed = await this.authorizationService.userHasPermission({
        userId,
        roleIds,
        permissionCode,
      });

      if (!allowed) {
        throw new ForbiddenException(
          `Missing required permission: ${permissionCode}`,
        );
      }
    }

    return true;
  }
}