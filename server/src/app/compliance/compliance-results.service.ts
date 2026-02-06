// apps/api/src/app/compliance/compliance-results.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { ProviderEntity } from '../providers/provider.entity';
import { AuditService } from '../audit/audit.service';
import { ComplianceResultEntity, ComplianceSeverity } from './entities/compliance-result.entity';

type Actor = { id?: string; email?: string; roles?: string[] };
type ReqMeta = { ip?: string; userAgent?: string; requestId?: string };

function normalizeModule(v: any): string {
  return String(v ?? '').trim().toUpperCase();
}


function normalizeText(v: any): string | null {
  const s = String(v ?? '').trim();
  if (!s) return null;

  const low = s.toLowerCase();
  if (low === 'undefined' || low === 'null') return null;

  return s;
}


function normalizeStatus(v: any): 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN' | null {
  const up = String(v ?? '').trim().toUpperCase();
  return up === 'COMPLIANT' || up === 'NON_COMPLIANT' || up === 'UNKNOWN' ? (up as any) : null;
}

function severityRank(sev: ComplianceSeverity | string | null | undefined): number {
  switch (sev) {
    case 'CRITICAL':
      return 4;
    case 'HIGH':
      return 3;
    case 'MED':
      return 2;
    case 'LOW':
      return 1;
    default:
      return 0;
  }
}

@Injectable()
export class ComplianceResultsService {
  constructor(
    @InjectRepository(ComplianceResultEntity)
    private readonly repo: Repository<ComplianceResultEntity>,
    @InjectRepository(ProviderEntity)
    private readonly providers: Repository<ProviderEntity>,
    private readonly audit: AuditService,
  ) {}

  private async resolveProviderId(maybeProviderId?: string): Promise<string> {
    if (maybeProviderId) return maybeProviderId;

    const where: FindOptionsWhere<ProviderEntity> = {} as any;

    const cols = this.providers.metadata.columns.map((c) => c.propertyName);
    if (cols.includes('deletedAt')) (where as any).deletedAt = null;

    const p = await this.providers.findOne({
      where,
      order: { createdAt: 'ASC' } as any,
    });

    if (!p) throw new BadRequestException('No Provider exists yet. Create Provider first.');
    return (p as any).id;
  }

  async list(params: { locationId?: string; module?: string; subcategory?: string; status?: string } = {}) {
    const qb = this.repo.createQueryBuilder('r');

    if (params.locationId) qb.andWhere('r.locationId = :locationId', { locationId: params.locationId });
    if (params.module) qb.andWhere('r.module = :module', { module: normalizeModule(params.module) });

    const sub = normalizeText(params.subcategory);
    if (sub) qb.andWhere('r.subcategory = :subcategory', { subcategory: sub });

    // ✅ status handling:
    // - if valid status provided => filter to it
    // - else default => show everything NOT compliant
    const st = normalizeStatus(params.status);
    if (st) qb.andWhere('r.status = :status', { status: st });
    else qb.andWhere('r.status != :ok', { ok: 'COMPLIANT' });

    // ✅ severity ordering in SQL
    qb.addSelect(
      `
      CASE r.severity
        WHEN 'CRITICAL' THEN 4
        WHEN 'HIGH' THEN 3
        WHEN 'MED' THEN 2
        WHEN 'LOW' THEN 1
        ELSE 0
      END
      `,
      'severity_rank',
    );

    qb.orderBy('severity_rank', 'DESC').addOrderBy('r.updatedAt', 'DESC');

    return qb.getMany();
  }

  async get(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Compliance result not found');
    return row;
  }

  async create(dto: any, actor?: Actor, meta?: ReqMeta) {
    const providerId = await this.resolveProviderId(dto.providerId);

    const payload: DeepPartial<ComplianceResultEntity> = {
      providerId,
      locationId: dto.locationId ?? null,
      entityType: dto.entityType,
      entityId: dto.entityId,

      module: normalizeModule(dto.module),
      subcategory: normalizeText(dto.subcategory),

      ruleCode: String(dto.ruleCode ?? '').trim(),
      status: dto.status,
      severity: dto.severity,
      message: normalizeText(dto.message),

      routeCommands: dto.routeCommands ?? null,
      queryParams: dto.queryParams ?? null,
      lastCheckedAt: dto.lastCheckedAt ? new Date(dto.lastCheckedAt) : null,
    };

    const row = this.repo.create(payload);
    const saved = await this.repo.save(row);

    await this.audit.log({
      entityType: 'ComplianceResult',
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

  async update(id: string, dto: any, actor?: Actor, meta?: ReqMeta) {
    const row = await this.get(id);
    const before = { ...row };

    if (dto.status !== undefined) row.status = dto.status;
    if (dto.severity !== undefined) row.severity = dto.severity;
    if (dto.message !== undefined) row.message = normalizeText(dto.message);
    if (dto.subcategory !== undefined) row.subcategory = normalizeText(dto.subcategory);
    if (dto.routeCommands !== undefined) row.routeCommands = dto.routeCommands ?? null;
    if (dto.queryParams !== undefined) row.queryParams = dto.queryParams ?? null;
    if (dto.lastCheckedAt !== undefined)
      row.lastCheckedAt = dto.lastCheckedAt ? new Date(dto.lastCheckedAt) : null;

    const saved = await this.repo.save(row);

    await this.audit.log({
      entityType: 'ComplianceResult',
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
      entityType: 'ComplianceResult',
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
