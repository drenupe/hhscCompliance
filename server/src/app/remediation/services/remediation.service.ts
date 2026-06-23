import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AddFindingNoteDto } from '../dto/add-finding-note.dto';
import { CreateCapDto } from '../dto/create-cap.dto';
import { UpdateCapDto } from '../dto/update-cap.dto';
import { ComplianceFindingNoteEntity } from '../entities/compliance-finding-note.entity';
import { ComplianceResultCapEntity } from '../entities/compliance-result-cap.entity';
import { CorrectiveActionPlanEntity } from '../entities/corrective-action-plan.entity';
import { ComplianceResultEntity } from '../../compliance/entities/compliance-result.entity';
import { FindingCapSummaryDto } from '../dto/finding-cap-summary.dto';
import { AddCapNoteDto } from '../dto/add-cap-note.dto';
import { UpdateCapStatusDto } from '../dto/update-cap-status.dto';
import { CapStatusHistoryEntity } from '../entities/cap-status-history.entity';
import { UploadCapEvidenceDto } from '../dto/upload-cap-evidence.dto';
import { CapEvidenceEntity } from '../entities/cap-evidence.entity';
import { FindingWorkspaceView } from '../types/finding-workspace.types';

type CapSummaryStatus =
  | 'NONE'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'READY_FOR_REVIEW'
  | 'RESOLVED'
  | 'CLOSED';

@Injectable()
export class RemediationService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(CorrectiveActionPlanEntity)
    private readonly capsRepo: Repository<CorrectiveActionPlanEntity>,

    @InjectRepository(ComplianceFindingNoteEntity)
    private readonly notesRepo: Repository<ComplianceFindingNoteEntity>,

    @InjectRepository(ComplianceResultCapEntity)
    private readonly resultCapsRepo: Repository<ComplianceResultCapEntity>,

    @InjectRepository(ComplianceResultEntity)
    private readonly complianceResultsRepo: Repository<ComplianceResultEntity>,

    @InjectRepository(CapStatusHistoryEntity)
    private readonly capStatusHistoryRepo: Repository<CapStatusHistoryEntity>,

    @InjectRepository(CapEvidenceEntity)
    private readonly evidenceRepo: Repository<CapEvidenceEntity>,
  ) {}

  listCaps() {
    return this.capsRepo.find({
      order: { updatedAt: 'DESC' },
    });
  }

  async getCap(id: string) {
    const cap = await this.capsRepo.findOne({ where: { id } });

    if (!cap) {
      throw new NotFoundException('Corrective action plan not found');
    }

    return cap;
  }

  async getFindingWorkspace(findingId: string): Promise<FindingWorkspaceView> {
    const finding = await this.complianceResultsRepo.findOne({
      where: { id: findingId },
    });

    if (!finding) {
      throw new NotFoundException('Compliance result not found');
    }

    const caps = await this.capsRepo.find({
      where: { complianceResultId: findingId },
      order: { updatedAt: 'DESC' },
    });

    const cap = caps[0] ?? null;

    const notes = await this.notesRepo.find({
      where: { complianceResultId: findingId },
      order: { createdAt: 'DESC' },
    });

    const evidence = cap
      ? await this.evidenceRepo.find({
          where: { capId: cap.id },
          order: { createdAt: 'DESC' },
        })
      : [];

    const statusHistory = cap
      ? await this.capStatusHistoryRepo.find({
          where: { capId: cap.id },
          order: { createdAt: 'DESC' },
        })
      : [];

    return {
      finding: {
        id: finding.id,
        providerId: finding.providerId ?? null,
        locationId: finding.locationId ?? null,
        entityType: finding.entityType,
        entityId: finding.entityId,
        module: finding.module,
        subcategory: finding.subcategory ?? null,
        ruleCode: finding.ruleCode,
        status: finding.status,
        severity: this.normalizeFindingSeverity(finding.severity),
        message: finding.message ?? null,
        routeCommands: finding.routeCommands ?? null,
        queryParams: finding.queryParams ?? null,
        needsRecheck: finding.needsRecheck ?? false,
        nextCheckAt: this.toIsoOrNull(finding.nextCheckAt),
        lastRecheckedAt: this.toIsoOrNull(finding.lastRecheckedAt),
        recheckReason: finding.recheckReason ?? null,
        lastCheckedAt: this.toIsoOrNull(finding.lastCheckedAt),
      },

      cap: cap
        ? {
            id: cap.id,
            status: cap.status,
            issue: cap.issue ?? null,
            correctiveAction: cap.correctiveAction ?? null,
            responsibleParty: cap.responsibleParty ?? null,
            targetCompletionDate: this.toIsoOrNull(cap.targetCompletionDate),
            completedAt: this.toIsoOrNull(cap.completedAt),
            createdAt: this.toIsoOrNull(cap.createdAt),
            updatedAt: this.toIsoOrNull(cap.updatedAt),
          }
        : null,

      notes: notes.map((note) => ({
        id: note.id,
        note: note.note,
        createdByUserId: note.createdByUserId ?? null,
        createdAt: this.toIsoOrNull(note.createdAt),
      })),

      evidence: evidence.map((ev) => ({
        id: ev.id,
        fileName: ev.fileName ?? null,
        originalFileName: ev.fileName ?? null,
        mimeType: ev.fileType ?? null,
        fileSize: null,
        uploadedByUserId: ev.uploadedByUserId ?? null,
        createdAt: this.toIsoOrNull(ev.createdAt),
      })),

      statusHistory: statusHistory.map((h) => ({
        id: h.id,
        fromStatus: h.fromStatus ?? null,
        toStatus: h.toStatus,
        reason: h.note ?? null,
        changedByUserId: h.changedByUserId ?? null,
        createdAt: this.toIsoOrNull(h.createdAt),
      })),
    };
  }

  async createCap(dto: CreateCapDto, user?: any) {
    const userId = this.resolveUserId(user);

    return this.dataSource.transaction(async (manager: EntityManager) => {
      const complianceResult = await manager.findOne(ComplianceResultEntity, {
        where: { id: dto.complianceResultId },
      });

      if (!complianceResult) {
        throw new NotFoundException('Compliance result not found');
      }

      const cap = manager.create(CorrectiveActionPlanEntity, {
        complianceResultId: dto.complianceResultId,
        status: 'OPEN',
        issue: dto.issue,
        correctiveAction: dto.correctiveAction,
        responsibleParty: dto.responsibleParty ?? null,
        targetCompletionDate: dto.targetCompletionDate ?? null,
        completedAt: null,
        createdByUserId: userId,
        updatedByUserId: userId,
      });

      const savedCap = await manager.save(CorrectiveActionPlanEntity, cap);

      const link = manager.create(ComplianceResultCapEntity, {
        complianceResultId: dto.complianceResultId,
        capId: savedCap.id,
      });

      await manager.save(ComplianceResultCapEntity, link);

      await this.refreshComplianceResultCapSummary(
        manager,
        dto.complianceResultId,
      );

      return savedCap;
    });
  }

  async updateCap(id: string, dto: UpdateCapDto, user?: any) {
    const userId = this.resolveUserId(user);

    return this.dataSource.transaction(async (manager: EntityManager) => {
      const cap = await manager.findOne(CorrectiveActionPlanEntity, {
        where: { id },
      });

      if (!cap) {
        throw new NotFoundException('Corrective action plan not found');
      }

      Object.assign(cap, {
        ...dto,
        updatedByUserId: userId,
      });

      if (dto.status === 'RESOLVED' || dto.status === 'CLOSED') {
        cap.completedAt = new Date();
      }

      if (dto.status && dto.status !== 'RESOLVED' && dto.status !== 'CLOSED') {
        cap.completedAt = null;
      }

      const savedCap = await manager.save(CorrectiveActionPlanEntity, cap);

      await this.refreshComplianceResultCapSummary(
        manager,
        savedCap.complianceResultId,
      );

      return savedCap;
    });
  }

  async addCapNote(capId: string, dto: AddCapNoteDto, user?: any) {
    const cap = await this.getCap(capId);

    const note = this.notesRepo.create({
      complianceResultId: cap.complianceResultId,
      capId,
      note: dto.note,
      createdByUserId: this.resolveUserId(user),
    });

    return this.notesRepo.save(note);
  }

  async listCapNotes(capId: string) {
    await this.getCap(capId);

    return this.notesRepo.find({
      where: { capId },
      order: { createdAt: 'DESC' },
    });
  }

  async getCapsForFinding(
    complianceResultId: string,
  ): Promise<FindingCapSummaryDto> {
    const complianceResult = await this.complianceResultsRepo.findOne({
      where: { id: complianceResultId },
    });

    if (!complianceResult) {
      throw new NotFoundException('Compliance result not found');
    }

    const links = await this.resultCapsRepo.find({
      where: { complianceResultId },
      order: { createdAt: 'DESC' },
    });

    const capIds = links.map((link) => link.capId);

    const caps = capIds.length ? await this.capsRepo.findByIds(capIds) : [];

    return {
      complianceResultId,
      ruleCode: complianceResult.ruleCode,
      module: complianceResult.module,
      subcategory: complianceResult.subcategory,
      status: complianceResult.status,
      severity: complianceResult.severity,
      capStatus: complianceResult.capStatus,
      capCount: complianceResult.capCount,
      caps: caps.map((cap) => ({
        id: cap.id,
        status: cap.status,
        issue: cap.issue,
        correctiveAction: cap.correctiveAction,
        responsibleParty: cap.responsibleParty ?? null,
        targetCompletionDate: cap.targetCompletionDate ?? null,
        completedAt: cap.completedAt ?? null,
        createdAt: cap.createdAt,
        updatedAt: cap.updatedAt,
      })),
    };
  }

  async updateCapStatus(id: string, dto: UpdateCapStatusDto, user?: any) {
    const userId = this.resolveUserId(user);

    return this.dataSource.transaction(async (manager: EntityManager) => {
      const cap = await manager.findOne(CorrectiveActionPlanEntity, {
        where: { id },
      });

      if (!cap) {
        throw new NotFoundException('Corrective action plan not found');
      }

      const fromStatus = cap.status;
      const toStatus = dto.status;

      this.validateStatusTransition(fromStatus, toStatus);

      cap.status = toStatus;
      cap.updatedByUserId = userId;

      if (toStatus === 'RESOLVED' || toStatus === 'CLOSED') {
        cap.completedAt = new Date();
      }

      if (
        toStatus === 'OPEN' ||
        toStatus === 'IN_PROGRESS' ||
        toStatus === 'READY_FOR_REVIEW'
      ) {
        cap.completedAt = null;
      }

      const savedCap = await manager.save(CorrectiveActionPlanEntity, cap);

      const history = manager.create(CapStatusHistoryEntity, {
        capId: savedCap.id,
        fromStatus,
        toStatus,
        note: dto.note ?? null,
        changedByUserId: userId,
      });

      await manager.save(CapStatusHistoryEntity, history);

      if (dto.note) {
        const note = manager.create(ComplianceFindingNoteEntity, {
          complianceResultId: savedCap.complianceResultId,
          capId: savedCap.id,
          note: dto.note,
          createdByUserId: userId,
        });

        await manager.save(ComplianceFindingNoteEntity, note);
      }

      await this.refreshComplianceResultCapSummary(
        manager,
        savedCap.complianceResultId,
      );

      if (toStatus === 'READY_FOR_REVIEW' || toStatus === 'RESOLVED') {
        await manager.update(
          ComplianceResultEntity,
          { id: savedCap.complianceResultId },
          {
            needsRecheck: true,
            nextCheckAt: new Date(),
            recheckReason: `CAP moved from ${fromStatus} to ${toStatus}`,
          },
        );
      }

      return savedCap;
    });
  }

  async listCapStatusHistory(capId: string) {
    await this.getCap(capId);

    return this.capStatusHistoryRepo.find({
      where: { capId },
      order: { createdAt: 'DESC' },
    });
  }

  async addNote(dto: AddFindingNoteDto, user?: any) {
    const userId = this.resolveUserId(user);

    const note = this.notesRepo.create({
      complianceResultId: dto.complianceResultId,
      note: dto.note,
      createdByUserId: userId,
    });

    return this.notesRepo.save(note);
  }

  listNotes(complianceResultId: string) {
    return this.notesRepo.find({
      where: { complianceResultId },
      order: { createdAt: 'DESC' },
    });
  }

  async uploadCapEvidence(
    capId: string,
    dto: UploadCapEvidenceDto,
    user?: any,
  ) {
    const cap = await this.getCap(capId);

    const evidence = this.evidenceRepo.create({
      capId,
      complianceResultId: cap.complianceResultId,
      fileName: dto.fileName,
      fileType: dto.fileType,
      storagePath: dto.storagePath,
      evidenceType: dto.evidenceType ?? 'OTHER',
      uploadedByUserId: this.resolveUserId(user),
    });

    return this.evidenceRepo.save(evidence);
  }

  async listCapEvidence(capId: string) {
    await this.getCap(capId);

    return this.evidenceRepo.find({
      where: { capId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteEvidence(evidenceId: string) {
    const evidence = await this.evidenceRepo.findOne({
      where: { id: evidenceId },
    });

    if (!evidence) {
      throw new NotFoundException('Evidence not found');
    }

    await this.evidenceRepo.delete({ id: evidenceId });

    return {
      deleted: true,
      id: evidenceId,
    };
  }

  private validateStatusTransition(fromStatus: string, toStatus: string): void {
    if (fromStatus === toStatus) {
      return;
    }

    const allowedTransitions: Record<string, string[]> = {
      OPEN: ['IN_PROGRESS', 'READY_FOR_REVIEW', 'RESOLVED', 'CLOSED'],
      IN_PROGRESS: ['READY_FOR_REVIEW', 'RESOLVED', 'CLOSED'],
      READY_FOR_REVIEW: ['RESOLVED', 'IN_PROGRESS', 'CLOSED'],
      RESOLVED: ['CLOSED', 'IN_PROGRESS'],
      CLOSED: [],
    };

    const allowed = allowedTransitions[fromStatus] ?? [];

    if (!allowed.includes(toStatus)) {
      throw new BadRequestException(
        `Invalid CAP status transition from ${fromStatus} to ${toStatus}`,
      );
    }
  }

  private resolveUserId(user?: any): string | null {
    return user?.id ?? user?.userId ?? user?.sub ?? null;
  }

  private async refreshComplianceResultCapSummary(
    manager: EntityManager,
    complianceResultId: string,
  ): Promise<void> {
    const caps = await manager.find(CorrectiveActionPlanEntity, {
      where: { complianceResultId },
    });

    const capCount = caps.length;
    const capStatus = this.resolveCapSummaryStatus(caps);

    await manager.update(
      ComplianceResultEntity,
      { id: complianceResultId },
      {
        capCount,
        capStatus,
      },
    );
  }

  private resolveCapSummaryStatus(
    caps: CorrectiveActionPlanEntity[],
  ): CapSummaryStatus {
    if (caps.length === 0) {
      return 'NONE';
    }

    const statuses = new Set(caps.map((cap) => cap.status));

    if (statuses.has('READY_FOR_REVIEW')) {
      return 'READY_FOR_REVIEW';
    }

    if (statuses.has('IN_PROGRESS')) {
      return 'IN_PROGRESS';
    }

    if (statuses.has('OPEN')) {
      return 'OPEN';
    }

    if (statuses.has('RESOLVED')) {
      return 'RESOLVED';
    }

    if (statuses.has('CLOSED')) {
      return 'CLOSED';
    }

    return 'NONE';
  }

  private normalizeFindingSeverity(
    value: unknown,
  ): 'LOW' | 'MED' | 'HIGH' | 'CRITICAL' {
    const severity = String(value ?? '').toUpperCase();

    if (severity === 'CRITICAL') return 'CRITICAL';
    if (severity === 'HIGH') return 'HIGH';
    if (severity === 'MEDIUM' || severity === 'MED') return 'MED';

    return 'LOW';
  }

  private toIsoOrNull(value: unknown): string | null {
    if (!value) return null;

    if (value instanceof Date) {
      return value.toISOString();
    }

    const date = new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toISOString();
  }
}