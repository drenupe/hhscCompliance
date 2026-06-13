import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { SearchAuditLogDto } from '../dto/search-audit-log.dto';
import { AuditLogsService } from '../services/audit-logs.service';

@Controller('security/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  create(@Body() dto: CreateAuditLogDto) {
    return this.auditLogsService.create(dto);
  }

  @Post('search')
  search(@Body() dto: SearchAuditLogDto) {
    return this.auditLogsService.search(dto);
  }

  @Get()
  findAll() {
    return this.auditLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(id);
  }
}