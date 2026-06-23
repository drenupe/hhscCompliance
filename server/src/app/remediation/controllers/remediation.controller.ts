import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../../security/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../security/guards/permissions.guard';
import { CreateCapDto } from '../dto/create-cap.dto';
import { UpdateCapDto } from '../dto/update-cap.dto';
import { AddFindingNoteDto } from '../dto/add-finding-note.dto';
import { RemediationService } from '../services/remediation.service';
import { AddCapNoteDto } from '../dto/add-cap-note.dto';
import { UpdateCapStatusDto } from '../dto/update-cap-status.dto';
import { UploadCapEvidenceDto } from '../dto/upload-cap-evidence.dto';

@Controller('remediation')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RemediationController {
  constructor(private readonly svc: RemediationService) {}

  @Get('caps')
  @RequirePermission('dashboard:view')
  listCaps() {
    return this.svc.listCaps();
  }

  @Get('caps/:id')
  @RequirePermission('dashboard:view')
  getCap(@Param('id') id: string) {
    return this.svc.getCap(id);
  }

  @Post('caps')
  @RequirePermission('residential:update')
  createCap(@Body() dto: CreateCapDto, @Req() req: any) {
    return this.svc.createCap(dto, req.user);
  }

  @Patch('caps/:id')
  @RequirePermission('residential:update')
  updateCap(@Param('id') id: string, @Body() dto: UpdateCapDto, @Req() req: any) {
    return this.svc.updateCap(id, dto, req.user);
  }

  @Post('notes')
  @RequirePermission('dashboard:view')
  addNote(@Body() dto: AddFindingNoteDto, @Req() req: any) {
    return this.svc.addNote(dto, req.user);
  }

  @Get('notes')
  @RequirePermission('dashboard:view')
  listNotes(@Query('complianceResultId') complianceResultId: string) {
    return this.svc.listNotes(complianceResultId);
  }

  @Get('findings/:findingId/workspace')
  @RequirePermission('dashboard:view')
  getFindingWorkspace(@Param('findingId') findingId: string) {
    return this.svc.getFindingWorkspace(findingId);
  }

  @Get('findings/:complianceResultId/caps')
  @RequirePermission('dashboard:view')
  getCapsForFinding(@Param('complianceResultId') complianceResultId: string) {
    return this.svc.getCapsForFinding(complianceResultId);
  }

  @Post('caps/:capId/notes')
  @RequirePermission('residential:update')
  addCapNote(
    @Param('capId') capId: string,
    @Body() dto: AddCapNoteDto,
    @Req() req: any,
  ) {
    return this.svc.addCapNote(capId, dto, req.user);
  }

  @Get('caps/:capId/notes')
  @RequirePermission('dashboard:view')
  listCapNotes(@Param('capId') capId: string) {
    return this.svc.listCapNotes(capId);
  }

  @Patch('caps/:id/status')
  @RequirePermission('residential:update')
  updateCapStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCapStatusDto,
    @Req() req: any,
  ) {
    return this.svc.updateCapStatus(id, dto, req.user);
  }

  @Get('caps/:id/status-history')
  @RequirePermission('dashboard:view')
  listCapStatusHistory(@Param('id') id: string) {
    return this.svc.listCapStatusHistory(id);
  }

  @Post('caps/:capId/evidence')
  @RequirePermission('residential:update')
  uploadCapEvidence(
    @Param('capId') capId: string,
    @Body() dto: UploadCapEvidenceDto,
    @Req() req: any,
  ) {
    return this.svc.uploadCapEvidence(capId, dto, req.user);
  }

  @Get('caps/:capId/evidence')
  @RequirePermission('dashboard:view')
  listCapEvidence(@Param('capId') capId: string) {
    return this.svc.listCapEvidence(capId);
  }

  @Delete('evidence/:evidenceId')
  @RequirePermission('residential:update')
  deleteEvidence(@Param('evidenceId') evidenceId: string) {
    return this.svc.deleteEvidence(evidenceId);
  }
}