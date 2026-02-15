import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { ProviderEntity } from '../providers/provider.entity';
import { AuditService } from '../audit/audit.service';
import { ComplianceResultEntity, ComplianceSeverity } from './entities/compliance-result.entity';

type Actor = { id?: string; email?: string; roles?: string[] };
type ReqMeta = { ip?: string; userAgent?: string; requestId?: string };

type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';
type ComplianceEntityType = 'RESIDENTIAL' | 'CONSUMER' | 'EMPLOYEE' | 'PROVIDER';

function normalizeModule(v: any): string {
  return String(v ?? '').trim().toUpperCase();
}

function normalizeRuleCode(v: any): string {
  return String(v ?? '').trim();
}

function normalizeText(v: any): string | null {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const low = s.toLowerCase();
  if (low === 'undefined' || low === 'null') return null;
  return s;
}

function normalizeStatus(v: any): ComplianceStatus | null {
  const up = String(v ?? '').trim().toUpperCase();
  return up === 'COMPLIANT' || up === 'NON_COMPLIANT' || up === 'UNKNOWN' ? (up as ComplianceStatus) : null;
}

type NaturalKey = {
  providerId: string;
  locationId: string | null;
  entityType: ComplianceEntityType;
  entityId: string;
  ruleCode: string;
};

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

  private assertCreateDto(dto: any) {
    const ruleCode = normalizeRuleCode(dto?.ruleCode);
    if (!ruleCode) throw new BadRequestException('ruleCode is required');

    const module = normalizeModule(dto?.module);
    if (!module) throw new BadRequestException('module is required');

    const entityType = String(dto?.entityType ?? '').trim().toUpperCase();
    if (!entityType) throw new BadRequestException('entityType is required');

    const entityId = String(dto?.entityId ?? '').trim();
    if (!entityId) throw new BadRequestException('entityId is required');

    const st = normalizeStatus(dto?.status);
    if (!st) throw new BadRequestException('status must be COMPLIANT, NON_COMPLIANT, or UNKNOWN');

    const sev = String(dto?.severity ?? '').trim().toUpperCase();
    if (!sev) throw new BadRequestException('severity is required');

    return {
      ruleCode,
      module,
      entityType: entityType as ComplianceEntityType,
      entityId,
      status: st,
      severity: sev as ComplianceSeverity,
    };
  }

  private naturalKeyWhere(k: NaturalKey): FindOptionsWhere<ComplianceResultEntity> {
    return {
      providerId: k.providerId,
      locationId: k.locationId ?? null,
      entityType: k.entityType,
      entityId: k.entityId,
      ruleCode: k.ruleCode,
    } as any;
  }

  async list(params: { locationId?: string; module?: string; subcategory?: string; status?: string } = {}) {
    const qb = this.repo.createQueryBuilder('r');

    if (params.locationId) qb.andWhere('r.locationId = :locationId', { locationId: params.locationId });
    if (params.module) qb.andWhere('r.module = :module', { module: normalizeModule(params.module) });

    const sub = normalizeText(params.subcategory);
    if (sub) qb.andWhere('r.subcategory = :subcategory', { subcategory: sub });

    const st = normalizeStatus(params.status);
    if (st) qb.andWhere('r.status = :status', { status: st });
    else qb.andWhere('r.status != :ok', { ok: 'COMPLIANT' });

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
    const providerId = await this.resolveProviderId(dto?.providerId);
    const validated = this.assertCreateDto(dto);

    const payload: DeepPartial<ComplianceResultEntity> = {
      providerId,
      locationId: dto?.locationId ?? null,
      entityType: validated.entityType,
      entityId: validated.entityId,

      module: validated.module,
      subcategory: normalizeText(dto?.subcategory),

      ruleCode: validated.ruleCode,
      status: validated.status,
      severity: validated.severity,
      message: normalizeText(dto?.message),

      routeCommands: dto?.routeCommands ?? null,
      queryParams: dto?.queryParams ?? null,
      lastCheckedAt: dto?.lastCheckedAt ? new Date(dto.lastCheckedAt) : null,
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

    if (dto?.status !== undefined) {
      const st = normalizeStatus(dto.status);
      if (!st) throw new BadRequestException('status must be COMPLIANT, NON_COMPLIANT, or UNKNOWN');
      row.status = st;
    }

    if (dto?.severity !== undefined) row.severity = String(dto.severity).trim().toUpperCase() as any;
    if (dto?.message !== undefined) row.message = normalizeText(dto.message);
    if (dto?.subcategory !== undefined) row.subcategory = normalizeText(dto.subcategory);
    if (dto?.routeCommands !== undefined) row.routeCommands = dto.routeCommands ?? null;
    if (dto?.queryParams !== undefined) row.queryParams = dto.queryParams ?? null;
    if (dto?.lastCheckedAt !== undefined) row.lastCheckedAt = dto.lastCheckedAt ? new Date(dto.lastCheckedAt) : null;

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

  /**
   * ✅ Engine primitive: idempotent upsert by natural key.
   * Can be called by evaluators (system) or by users (manual run).
   */
  async upsertResult(
    input: {
      providerId?: string;

      locationId?: string | null;
      entityType: ComplianceEntityType;
      entityId: string;

      module: string;
      ruleCode: string;

      status: ComplianceStatus;
      severity: ComplianceSeverity;

      message?: string | null;
      subcategory?: string | null;

      routeCommands?: any[] | null;
      queryParams?: Record<string, any> | null;

      lastCheckedAt?: Date | string | null;
    },
    actor?: Actor,
    meta?: ReqMeta,
  ) {
    const providerId = await this.resolveProviderId(input.providerId);

    const ruleCode = normalizeRuleCode(input.ruleCode);
    if (!ruleCode) throw new BadRequestException('ruleCode is required');

    const module = normalizeModule(input.module);
    if (!module) throw new BadRequestException('module is required');

    const status = normalizeStatus(input.status);
    if (!status) throw new BadRequestException('status must be COMPLIANT, NON_COMPLIANT, or UNKNOWN');

    const severity = String(input.severity ?? '').trim().toUpperCase() as ComplianceSeverity;
    if (!severity) throw new BadRequestException('severity is required');

    const entityId = String(input.entityId ?? '').trim();
    if (!entityId) throw new BadRequestException('entityId is required');

    const entityType = String(input.entityType ?? '').trim().toUpperCase() as ComplianceEntityType;
    if (!entityType) throw new BadRequestException('entityType is required');

    const naturalKey: NaturalKey = {
      providerId,
      locationId: input.locationId ?? null,
      entityType,
      entityId,
      ruleCode,
    };

    const existing = await this.repo.findOne({ where: this.naturalKeyWhere(naturalKey) });
    const before = existing ? { ...existing } : null;

    const payload: DeepPartial<ComplianceResultEntity> = {
      providerId: naturalKey.providerId,
      locationId: naturalKey.locationId,
      entityType: naturalKey.entityType,
      entityId: naturalKey.entityId,
      ruleCode: naturalKey.ruleCode,

      module,
      status,
      severity,

      message: normalizeText(input.message),
      subcategory: normalizeText(input.subcategory),

      routeCommands: input.routeCommands ?? null,
      queryParams: input.queryParams ?? null,
      lastCheckedAt: input.lastCheckedAt ? new Date(input.lastCheckedAt as any) : new Date(),
    };

    await this.repo.upsert(payload as any, {
      conflictPaths: ['providerId', 'locationId', 'entityType', 'entityId', 'ruleCode'] as any,
      skipUpdateIfNoValuesChanged: true as any,
    } as any);

    const saved = await this.repo.findOne({ where: this.naturalKeyWhere(naturalKey) });
    if (!saved) throw new BadRequestException('Upsert failed unexpectedly');

    await this.audit.log({
      entityType: 'ComplianceResult',
      entityId: saved.id,
      action: existing ? 'UPDATE' : 'CREATE',
      before: before ?? undefined,
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


    /**
   * ✅ Convenience wrapper for evaluators.
   * Uses a SYSTEM actor/meta by default so audit logs clearly show
   * that the write came from the compliance engine (not a user action).
   */
  async upsertSystemResult(input: {
    providerId?: string;

    locationId?: string | null;
    entityType: ComplianceEntityType;
    entityId: string;

    module: string;
    ruleCode: string;

    status: ComplianceStatus;
    severity: ComplianceSeverity;

    message?: string | null;
    subcategory?: string | null;

    routeCommands?: any[] | null;
    queryParams?: Record<string, any> | null;

    lastCheckedAt?: Date | string | null;
  }) {
    return this.upsertResult(
      input,
      { id: 'system', email: 'system@hhsc-compliance.local', roles: ['SYSTEM'] },
      { ip: '127.0.0.1', userAgent: 'compliance-engine', requestId: 'engine' },
    );
  }

}
