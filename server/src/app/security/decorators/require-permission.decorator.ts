import { SetMetadata } from '@nestjs/common';
import { PermissionCode } from '../constants/permission-codes';

export const REQUIRED_PERMISSIONS_KEY = 'required_permissions';

export const RequirePermission = (...permissions: PermissionCode[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);