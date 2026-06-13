import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionEntity } from './entities/permission.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { RoleEntity } from './entities/role.entity';
import { UserPermissionEntity } from './entities/user-permission.entity';

import { PermissionsController } from './controllers/permissions.controller';
import { RolesController } from './controllers/roles.controller';

import { AuthorizationService } from './services/authorization.service';
import { PermissionsService } from './services/permissions.service';
import { RolesService } from './services/roles.service';

import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditLogsController } from './controllers/audit-logs.controller';
import { AuditLogsService } from './services/audit-logs.service';

import { MfaBackupCodeEntity } from './entities/mfa-backup-code.entity';
import { MfaSecretEntity } from './entities/mfa-secret.entity';
import { MfaController } from './controllers/mfa.controller';
import { MfaService } from './services/mfa.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
      UserPermissionEntity,
      AuditLogEntity,
      MfaBackupCodeEntity,
      MfaSecretEntity,
    ]),
  ],
  controllers: [RolesController, PermissionsController,AuditLogsController,MfaController],
  providers: [RolesService, PermissionsService, AuthorizationService, AuditLogsService, MfaService],
  exports: [RolesService, PermissionsService, AuthorizationService, AuditLogsService, MfaService],
})
export class SecurityModule {}