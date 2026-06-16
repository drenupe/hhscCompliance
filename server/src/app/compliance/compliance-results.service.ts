import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { AuditService } from '../audit/audit.service';
import { ProviderEntity } from '../providers/provider.entity';
import {
  ComplianceEntityType,
  ComplianceQueryParams,
  ComplianceResultEntity,
  ComplianceRouteCommands,
  ComplianceSeverity,
  ComplianceStatus,
} from './entities/compliance-result.entity';

type Actor = { id?: string; email?: string; roles?: string[] };
type ReqMeta = { ip?: string; userAgent?: string; requestId?: string };

type ComplianceResultInput = {
  providerId?: string;
  locationId?: string | null;
  entityType: ComplianceEntityType;
  entityId: string;
  module: string;
  subcategory?: string | null;
  ruleCode: string;
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message?: string | null;
  routeCommands?: ComplianceRouteCommands;
  queryParams?: ComplianceQueryParams;
  lastCheckedAt?: Date | string | null;
};

type NaturalKey = {
  providerId: string;
  locationId: string | null;
  entityType: ComplianceEntityType;
  entityId: string;
  ruleCode: string;
};

const SYSTEM_ACTOR: Actor = {
  id: 'system',
  email: 'system@hhsc-compliance.local',
  roles: ['SYSTEM'],
};

const SYSTEM_META: ReqMeta = {
  ip: '127.0.0.1',
  userAgent: 'compliance-engine',
  requestId: 'engine',
};

function normalizeModule(value: unknown): string {
  return String(value ?? '').trim().toUpperCase();
}

function normalizeRuleCode(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeText(value: unknown): string | null {
  const text = String(value ?? '').trim();
  if (!text) return null;

  const low = text.toLowerCase();
  if (low === 'undefined' || low === 'null') return null;

  return text;
}

function normalizeStatus(value: unknown): ComplianceStatus | null {
  const status = String(value ?? '').trim().toUpperCase();

  if (
    status === 'COMPLIANT' ||
    status === 'NON_COMPLIANT' ||
    status === 'UNKNOWN'
  ) {
    return status;
  }

  return null;
}

function normalizeSeverity(value: unknown): ComplianceSeverity | null {
  const severity = String(value ?? '').trim().toUpperCase();

  if (
    severity === 'LOW' ||
    severity === 'MED' ||
    severity === 'HIGH' ||
    severity === 'CRITICAL'
  ) {
    return severity;
  }

  return null;
}

function normalizeEntityType(value: unknown): ComplianceEntityType | null {
  const entityType = String(value ?? '').trim().toUpperCase();

  if (
    entityType === 'RESIDENTIAL' ||
    entityType === 'CONSUMER' ||
    entityType === 'EMPLOYEE' ||
    entityType === 'PROVIDER'
  ) {
    return entityType;
  }

  return null;
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

  private async resolveProviderId(providerId?: string): Promise<string> {
    if (providerId) return providerId;

    const where: FindOptionsWhere<ProviderEntity> = {} as any;

    const columns = this.providers.metadata.columns.map((column) => column.propertyName);
    if (columns.includes('deletedAt')) {
      (where as any).deletedAt = null;
    }

    const provider = await this.providers.findOne({
      where,
      order: { createdAt: 'ASC' } as any,
    });

    if (!provider) {
      throw new BadRequestException('No Provider exists yet. Create Provider first.');
    }

    return (provider as any).id;
  }

  private validateInput(input: ComplianceResultInput): Required<
    Pick<
      ComplianceResultInput,
      'entityType' | 'entityId' | 'module' | 'ruleCode' | 'status' | 'severity'
    >
  > {
    const ruleCode = normalizeRuleCode(input.ruleCode);
    if (!ruleCode) throw new BadRequestException('ruleCode is required');

    const module = normalizeModule(input.module);
    if (!module) throw new BadRequestException('module is required');

    const entityType = normalizeEntityType(input.entityType);
    if (!entityType) {
      throw new BadRequestException(
        'entityType must be RESIDENTIAL, CONSUMER, EMPLOYEE, or PROVIDER',
      );
    }

    const entityId = String(input.entityId ?? '').trim();
    if (!entityId) throw new BadRequestException('entityId is required');

    const status = normalizeStatus(input.status);
    if (!status) {
      throw new BadRequestException(
        'status must be COMPLIANT, NON_COMPLIANT, or UNKNOWN',
      );
    }

    const severity = normalizeSeverity(input.severity);
    if (!severity) {
      throw new BadRequestException(
        'severity must be LOW, MED, HIGH, or CRITICAL',
      );
    }

    return {
      ruleCode,
      module,
      entityType,
      entityId,
      status,
      severity,
    };
  }

  private naturalKeyWhere(
    key: NaturalKey,
  ): FindOptionsWhere<ComplianceResultEntity> {
    return {
      providerId: key.providerId,
      locationId: key.locationId,
      entityType: key.entityType,
      entityId: key.entityId,
      ruleCode: key.ruleCode,
    } as any;
  }

  private buildPayload(
    input: ComplianceResultInput,
    providerId: string,
  ): DeepPartial<ComplianceResultEntity> {
    const validated = this.validateInput(input);

    return {
      providerId,
      locationId: input.locationId ?? null,
      entityType: validated.entityType,
      entityId: validated.entityId,
      module: validated.module,
      subcategory: normalizeText(input.subcategory),
      ruleCode: validated.ruleCode,
      status: validated.status,
      severity: validated.severity,
      message: normalizeText(input.message),
      routeCommands: input.routeCommands ?? null,
      queryParams: input.queryParams ?? null,
      lastCheckedAt: input.lastCheckedAt
        ? new Date(input.lastCheckedAt)
        : new Date(),
    };
  }

  async list(
    params: {
      locationId?: string;
      module?: string;
      subcategory?: string;
      status?: string;
    } = {},
  ) {
    const qb = this.repo.createQueryBuilder('r');

    if (params.locationId) {
      qb.andWhere('r.locationId = :locationId', {
        locationId: params.locationId,
      });
    }

    if (params.module) {
      qb.andWhere('r.module = :module', {
        module: normalizeModule(params.module),
      });
    }

    const subcategory = normalizeText(params.subcategory);
    if (subcategory) {
      qb.andWhere('r.subcategory = :subcategory', { subcategory });
    }

    const status = normalizeStatus(params.status);
    if (status) {
      qb.andWhere('r.status = :status', { status });
    } else {
      qb.andWhere('r.status != :compliant', { compliant: 'COMPLIANT' });
    }

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

    if (!row) {
      throw new NotFoundException('Compliance result not found');
    }

    return row;
  }

  async create(dto: ComplianceResultInput, actor?: Actor, meta?: ReqMeta) {
    const providerId = await this.resolveProviderId(dto.providerId);
    const payload = this.buildPayload(dto, providerId);

    payload.lastCheckedAt = dto.lastCheckedAt
      ? new Date(dto.lastCheckedAt)
      : null;

    const saved = await this.repo.save(this.repo.create(payload));

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

  async update(
    id: string,
    dto: Partial<ComplianceResultInput>,
    actor?: Actor,
    meta?: ReqMeta,
  ) {
    const row = await this.get(id);
    const before = { ...row };

    if (dto.status !== undefined) {
      const status = normalizeStatus(dto.status);
      if (!status) {
        throw new BadRequestException(
          'status must be COMPLIANT, NON_COMPLIANT, or UNKNOWN',
        );
      }
      row.status = status;
    }

    if (dto.severity !== undefined) {
      const severity = normalizeSeverity(dto.severity);
      if (!severity) {
        throw new BadRequestException(
          'severity must be LOW, MED, HIGH, or CRITICAL',
        );
      }
      row.severity = severity;
    }

    if (dto.message !== undefined) row.message = normalizeText(dto.message);
    if (dto.subcategory !== undefined) row.subcategory = normalizeText(dto.subcategory);
    if (dto.routeCommands !== undefined) row.routeCommands = dto.routeCommands ?? null;
    if (dto.queryParams !== undefined) row.queryParams = dto.queryParams ?? null;
    if (dto.lastCheckedAt !== undefined) {
      row.lastCheckedAt = dto.lastCheckedAt ? new Date(dto.lastCheckedAt) : null;
    }

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

  async upsertResult(
    input: ComplianceResultInput,
    actor?: Actor,
    meta?: ReqMeta,
  ) {
    const providerId = await this.resolveProviderId(input.providerId);
    const payload = this.buildPayload(input, providerId);

    const naturalKey: NaturalKey = {
      providerId,
      locationId: payload.locationId ?? null,
      entityType: payload.entityType as ComplianceEntityType,
      entityId: payload.entityId as string,
      ruleCode: payload.ruleCode as string,
    };

    const existing = await this.repo.findOne({
      where: this.naturalKeyWhere(naturalKey),
    });

    const before = existing ? { ...existing } : undefined;

    await this.repo.upsert(payload as any, {
      conflictPaths: [
        'providerId',
        'locationId',
        'entityType',
        'entityId',
        'ruleCode',
      ] as any,
      skipUpdateIfNoValuesChanged: true as any,
    } as any);

    const saved = await this.repo.findOne({
      where: this.naturalKeyWhere(naturalKey),
    });

    if (!saved) {
      throw new BadRequestException('Upsert failed unexpectedly');
    }

    await this.audit.log({
      entityType: 'ComplianceResult',
      entityId: saved.id,
      action: existing ? 'UPDATE' : 'CREATE',
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

  async upsertSystemResult(input: ComplianceResultInput) {
    return this.upsertResult(input, SYSTEM_ACTOR, SYSTEM_META);
  }
}