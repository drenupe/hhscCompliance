import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { FireDrillsService } from './fire-drills.service';
import { CreateFireDrillInput, UpdateFireDrillInput } from '@hhsc-compliance/shared-models';

@Controller('fire-drills')
export class FireDrillsController {
  constructor(private readonly svc: FireDrillsService) {}

  @Get()
  list(@Query('locationId') locationId: string) {
    if (!locationId) throw new BadRequestException('locationId is required');
    return this.svc.list(locationId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
  create(@Body() dto: CreateFireDrillInput, @Req() req: any) {
    return this.svc.create(dto, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFireDrillInput, @Req() req: any) {
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
