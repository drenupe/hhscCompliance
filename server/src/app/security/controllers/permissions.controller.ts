import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AssignRolePermissionDto } from '../dto/assign-role-permission.dto';
import { AssignUserPermissionDto } from '../dto/assign-user-permission.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionsService } from '../services/permissions.service';

@Controller('security/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Post('assign-role')
  assignToRole(@Body() dto: AssignRolePermissionDto) {
    return this.permissionsService.assignToRole(dto);
  }

  @Post('assign-user')
  assignToUser(@Body() dto: AssignUserPermissionDto) {
    return this.permissionsService.assignToUser(dto);
  }
}