import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';

import {
  CreateResidentialLocationDto,
  UpdateResidentialLocationDto,
} from './residential-location.dto';
import { ResidentialLocationsService } from './residential-locations.service';

@Controller('residential-locations')
export class ResidentialLocationsController {
  constructor(private readonly svc: ResidentialLocationsService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
  create(@Body() dto: CreateResidentialLocationDto, @Req() req: any) {
    return this.svc.create(dto, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResidentialLocationDto, @Req() req: any) {
    return this.svc.update(id, dto, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.svc.remove(id, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  }
}
