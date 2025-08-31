// api/src/app/users/users.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UsersService } from '../services/users.service';
import { ListUsersQuery } from '../dto/list-users.query';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // Admin-only, paginated, projection-only list
  @Get()
  @Roles('admin')
  findAll(@Query() query: ListUsersQuery) {
    return this.users.list(query);
  }

  // Admin-only get by id (consider returning a DTO/projection here too)
  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.users.findById(id);
  }
}
