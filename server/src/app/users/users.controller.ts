import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../security/decorators/require-permission.decorator';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { UsersService } from './services/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission('security:role:manage')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermission('security:role:manage')
  findById(@Param('id') id: string) {
    return this.usersService.findSafeById(id);
  }

  @Patch(':id/roles')
  @RequirePermission('security:role:manage')
  updateRoles(
    @Param('id') id: string,
    @Body() body: { roles: string[] },
  ) {
    return this.usersService.updateRoles(id, body.roles);
  }
}