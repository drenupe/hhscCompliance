import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ComplianceResultsService } from './compliance-results.service';
import { CreateComplianceResultDto, UpdateComplianceResultDto } from './dto/compliance-results.dto';

@Controller('compliance-results')
export class ComplianceResultsController {
  constructor(private readonly svc: ComplianceResultsService) {}

  @Get()
  list(
    @Query('locationId') locationId?: string,
    @Query('module') module?: string,
    @Query('subcategory') subcategory?: string,
    @Query('status') status?: string,
  ) {
    return this.svc.list({ locationId, module, subcategory, status });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
  create(@Body() dto: CreateComplianceResultDto, @Req() req: any) {
    return this.svc.create(dto, req.user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComplianceResultDto, @Req() req: any) {
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
