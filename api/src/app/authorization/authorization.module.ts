// api/src/app/authorization/authorization.module.ts
import { Module } from '@nestjs/common';
import { RolesGuard } from './gaurds/roles.guard';

@Module({ providers: [RolesGuard], exports: [RolesGuard] })
export class AuthorizationModule {}