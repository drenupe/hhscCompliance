import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { FireDrillEntity } from './fire-drill.entity';
import { CreateFireDrillInput, UpdateFireDrillInput } from '@hhsc-compliance/shared-models';
import { ProviderEntity } from '../providers/provider.entity';
import { AuditService } from '../audit/audit.service';

type Actor = { id?: string; email?: string; roles?: string[] };
type ReqMeta = { ip?: string; userAgent?: string; requestId?: string };

function normText(v: any): string | null {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const low = s.toLowerCase();
  if (low === 'undefined' || low === 'null') return null;
  return s;
}

function normArr(v: any): string[] {
  return Array.isArray(v) ? v.map(String).map((x) => x.trim()).filter(Boolean) : [];
}

@Injectable()
export class FireDrillsService {
  constructor(
    @InjectRepository(FireDrillEntity)
    private readonly repo: Repository<FireDrillEntity>,
    @InjectRepository(ProviderEntity)
    private readonly providers: Repository<ProviderEntity>,
    private readonly audit: AuditService,
  ) {}

  private async resolveProviderId(maybeProviderId?: string): Promise<string> {
    if (maybeProviderId) return maybeProviderId;

    const where: FindOptionsWhere<ProviderEntity> = {} as any;
    const cols = this.providers.metadata.columns.map((c) => c.propertyName);
    if (cols.includes('deletedAt')) (where as any).deletedAt = null;

    const p = await this.providers.findOne({ where, order: { createdAt: 'ASC' } as any });
    if (!p) throw new BadRequestException('No Provider exists yet. Create Provider first.');
    return (p as any).id;
  }

  async list(locationId: string) {
    if (!locationId) throw new BadRequestException('locationId is required');

    return this.repo.find({
      where: { locationId } as any,
      order: { dateDrillConducted: 'DESC', updatedAt: 'DESC' } as any,
    });
  }

  async get(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Fire drill not found');
    return row;
  }

  async create(dto: CreateFireDrillInput, actor?: Actor, meta?: ReqMeta) {
    const providerId = await this.resolveProviderId(dto.providerId);

    if (!dto.locationId) throw new BadRequestException('locationId is required');
    if (!dto.dateDrillConducted) throw new BadRequestException('dateDrillConducted is required');
    if (!dto.shift) throw new BadRequestException('shift is required');

    const payload: DeepPartial<FireDrillEntity> = {
      providerId,
      locationId: dto.locationId,

      dateDrillConducted: dto.dateDrillConducted,
      timeDrillConducted: normText(dto.timeDrillConducted),
      shift: dto.shift,

      simulatedSituations: normArr(dto.simulatedSituations),
      simulatedOtherText: normText(dto.simulatedOtherText),

      locations: normArr(dto.locations),
      locationOtherText: normText(dto.locationOtherText),

      fireTypes: normArr(dto.fireTypes),
      fireTypeOtherText: normText(dto.fireTypeOtherText),

      extentOfFire: normArr(dto.extentOfFire),
      extentOfFireOtherText: normText(dto.extentOfFireOtherText),

      extentOfSmoke: normArr(dto.extentOfSmoke),
      extentOfSmokeOtherText: normText(dto.extentOfSmokeOtherText),

      exitsUsed: normArr(dto.exitsUsed),
      exitOtherText: normText(dto.exitOtherText),

      rallyPoint: normText(dto.rallyPoint),

      staffUsedProperJudgment: dto.staffUsedProperJudgment ?? null,
      actionsTaken: normText(dto.actionsTaken),

      fireDepartmentCalled: dto.fireDepartmentCalled ?? null,
      fireDepartmentCalledTime: normText(dto.fireDepartmentCalledTime),
      fireDepartmentCalledAmPm: dto.fireDepartmentCalledAmPm ?? null,

      residentsRemovedToSafety: dto.residentsRemovedToSafety ?? null,
      egressClear: dto.egressClear ?? null,
      corridorDoorsClosed: dto.corridorDoorsClosed ?? null,

      whoRespondedAndEquipment: normText(dto.whoRespondedAndEquipment),

      staffMonitoredExits: dto.staffMonitoredExits ?? null,
      buildingEvacuated: dto.buildingEvacuated ?? null,
      fireExtinguished: dto.fireExtinguished ?? null,

      allClearBy: normText(dto.allClearBy),
      allClearTime: normText(dto.allClearTime),
      allClearAmPm: dto.allClearAmPm ?? null,

      emergencyPlanExecutedCorrectly: dto.emergencyPlanExecutedCorrectly ?? null,
      staffCarriedOutResponsibilities: dto.staffCarriedOutResponsibilities ?? null,

      staffAreasChecks: dto.staffAreasChecks ?? null,

      commentsProblems: normText(dto.commentsProblems),
      participantsNames: normText(dto.participantsNames),

      reportCompletedBy: normText(dto.reportCompletedBy),
      reportCompletedByTitle: normText(dto.reportCompletedByTitle),
    };

    const row = this.repo.create(payload);
    const saved = await this.repo.save(row);

    await this.audit.log({
      entityType: 'FireDrill',
      entityId: saved.id,
      action: 'CREATE',
      after: saved,
      actorUserId: actor?.id ?? null,
      actorEmail: actor?.email ?? null,
      actorRoles: actor?.roles ?? null,
      ip: meta?.ip ?? null,
      userAgent: meta?.userAgent ?? null,
      requestId: meta?.requestId ?? null,
    });

    return saved;
  }

  async update(id: string, dto: UpdateFireDrillInput, actor?: Actor, meta?: ReqMeta) {
    const row = await this.get(id);
    const before = { ...row };

    if (dto.dateDrillConducted !== undefined) row.dateDrillConducted = String(dto.dateDrillConducted);
    if (dto.timeDrillConducted !== undefined) row.timeDrillConducted = normText(dto.timeDrillConducted);
    if (dto.shift !== undefined) row.shift = dto.shift as any;

    if (dto.simulatedSituations !== undefined) row.simulatedSituations = normArr(dto.simulatedSituations);
    if (dto.simulatedOtherText !== undefined) row.simulatedOtherText = normText(dto.simulatedOtherText);

    if (dto.locations !== undefined) row.locations = normArr(dto.locations);
    if (dto.locationOtherText !== undefined) row.locationOtherText = normText(dto.locationOtherText);

    if (dto.fireTypes !== undefined) row.fireTypes = normArr(dto.fireTypes);
    if (dto.fireTypeOtherText !== undefined) row.fireTypeOtherText = normText(dto.fireTypeOtherText);

    if (dto.extentOfFire !== undefined) row.extentOfFire = normArr(dto.extentOfFire);
    if (dto.extentOfFireOtherText !== undefined) row.extentOfFireOtherText = normText(dto.extentOfFireOtherText);

    if (dto.extentOfSmoke !== undefined) row.extentOfSmoke = normArr(dto.extentOfSmoke);
    if (dto.extentOfSmokeOtherText !== undefined) row.extentOfSmokeOtherText = normText(dto.extentOfSmokeOtherText);

    if (dto.exitsUsed !== undefined) row.exitsUsed = normArr(dto.exitsUsed);
    if (dto.exitOtherText !== undefined) row.exitOtherText = normText(dto.exitOtherText);

    if (dto.rallyPoint !== undefined) row.rallyPoint = normText(dto.rallyPoint);

    if (dto.staffUsedProperJudgment !== undefined) row.staffUsedProperJudgment = dto.staffUsedProperJudgment ?? null;
    if (dto.actionsTaken !== undefined) row.actionsTaken = normText(dto.actionsTaken);

    if (dto.fireDepartmentCalled !== undefined) row.fireDepartmentCalled = dto.fireDepartmentCalled ?? null;
    if (dto.fireDepartmentCalledTime !== undefined) row.fireDepartmentCalledTime = normText(dto.fireDepartmentCalledTime);
    if (dto.fireDepartmentCalledAmPm !== undefined) row.fireDepartmentCalledAmPm = dto.fireDepartmentCalledAmPm ?? null;

    if (dto.residentsRemovedToSafety !== undefined) row.residentsRemovedToSafety = dto.residentsRemovedToSafety ?? null;
    if (dto.egressClear !== undefined) row.egressClear = dto.egressClear ?? null;
    if (dto.corridorDoorsClosed !== undefined) row.corridorDoorsClosed = dto.corridorDoorsClosed ?? null;

    if (dto.whoRespondedAndEquipment !== undefined) row.whoRespondedAndEquipment = normText(dto.whoRespondedAndEquipment);

    if (dto.staffMonitoredExits !== undefined) row.staffMonitoredExits = dto.staffMonitoredExits ?? null;
    if (dto.buildingEvacuated !== undefined) row.buildingEvacuated = dto.buildingEvacuated ?? null;
    if (dto.fireExtinguished !== undefined) row.fireExtinguished = dto.fireExtinguished ?? null;

    if (dto.allClearBy !== undefined) row.allClearBy = normText(dto.allClearBy);
    if (dto.allClearTime !== undefined) row.allClearTime = normText(dto.allClearTime);
    if (dto.allClearAmPm !== undefined) row.allClearAmPm = dto.allClearAmPm ?? null;

    if (dto.emergencyPlanExecutedCorrectly !== undefined) row.emergencyPlanExecutedCorrectly = dto.emergencyPlanExecutedCorrectly ?? null;
    if (dto.staffCarriedOutResponsibilities !== undefined) row.staffCarriedOutResponsibilities = dto.staffCarriedOutResponsibilities ?? null;

    if (dto.staffAreasChecks !== undefined) row.staffAreasChecks = dto.staffAreasChecks ?? null;

    if (dto.commentsProblems !== undefined) row.commentsProblems = normText(dto.commentsProblems);
    if (dto.participantsNames !== undefined) row.participantsNames = normText(dto.participantsNames);

    if (dto.reportCompletedBy !== undefined) row.reportCompletedBy = normText(dto.reportCompletedBy);
    if (dto.reportCompletedByTitle !== undefined) row.reportCompletedByTitle = normText(dto.reportCompletedByTitle);

    const saved = await this.repo.save(row);

    await this.audit.log({
      entityType: 'FireDrill',
      entityId: saved.id,
      action: 'UPDATE',
      before,
      after: saved,
      actorUserId: actor?.id ?? null,
      actorEmail: actor?.email ?? null,
      actorRoles: actor?.roles ?? null,
      ip: meta?.ip ?? null,
      userAgent: meta?.userAgent ?? null,
      requestId: meta?.requestId ?? null,
    });

    return saved;
  }

  async remove(id: string, actor?: Actor, meta?: ReqMeta) {
    const row = await this.get(id);
    const before = { ...row };

    await this.repo.remove(row);

    await this.audit.log({
      entityType: 'FireDrill',
      entityId: row.id,
      action: 'DELETE',
      before,
      actorUserId: actor?.id ?? null,
      actorEmail: actor?.email ?? null,
      actorRoles: actor?.roles ?? null,
      ip: meta?.ip ?? null,
      userAgent: meta?.userAgent ?? null,
      requestId: meta?.requestId ?? null,
    });

    return { id };
  }
}
