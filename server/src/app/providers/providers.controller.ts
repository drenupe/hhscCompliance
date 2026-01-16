import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto, UpdateProviderDto } from './providers.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('providers') // ✅ FIX: no api/v1 here
// @UseGuards(RolesGuard)
export class ProvidersController {
  constructor(private readonly svc: ProvidersService) {}

  @Get()
  //@Roles('Admin', 'ProgramDirector', 'ComplianceOfficer')
  list() {
    return this.svc.list();
  }

  @Get(':id')
  //@Roles('Admin', 'ProgramDirector', 'ComplianceOfficer')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
  // @Roles('Admin')
  create(@Body() dto: CreateProviderDto, @Req() req: any) {
    return this.svc.create(dto, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  }

  @Patch(':id')
  // @Roles('Admin')
  update(@Param('id') id: string, @Body() dto: UpdateProviderDto, @Req() req: any) {
    return this.svc.update(id, dto, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  }

  @Delete(':id')
  // @Roles('Admin')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.svc.remove(id, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  }
}
