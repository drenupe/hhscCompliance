import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { ResidentialLocationEntity } from './residential-location.entity';
import { ProviderEntity } from '../providers/provider.entity';
import { AuditService } from '../audit/audit.service';
import { ComplianceResultEntity } from '../compliance/entities/compliance-result.entity';


type Actor = { id?: string; email?: string; roles?: string[] };
type ReqMeta = { ip?: string; userAgent?: string; requestId?: string };

const LOCATION_CODE_RE = /^[A-Z0-9]{4}$/;

@Injectable()
export class ResidentialLocationsService {
  constructor(
    @InjectRepository(ResidentialLocationEntity)
    private readonly repo: Repository<ResidentialLocationEntity>,

    @InjectRepository(ProviderEntity)
    private readonly providers: Repository<ProviderEntity>,

    // ✅ new repository for stored compliance
    @InjectRepository(ComplianceResultEntity)
    private readonly complianceRepo: Repository<ComplianceResultEntity>,

    private readonly audit: AuditService,
  ) {}

  async list(): Promise<ResidentialLocationEntity[]> {
    return this.repo.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async get(id: string): Promise<ResidentialLocationEntity> {
    const row = await this.repo.findOne({ where: { id, deletedAt: null } });
    if (!row) throw new NotFoundException('Residence not found');
    return row;
  }

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

  private normalizeLocationCode(raw: any): string {
    const code = String(raw ?? '').trim().toUpperCase();
    if (!LOCATION_CODE_RE.test(code)) {
      throw new BadRequestException('locationCode must be exactly 4 characters (A–Z, 0–9).');
    }
    return code;
  }

  private cleanText(v: any): string {
    return String(v ?? '').trim();
  }

  private toNull(v: any): string | null {
    const s = this.cleanText(v);
    return s.length ? s : null;
  }

  async create(dto: any, actor?: Actor, meta?: ReqMeta) {
    const name = this.cleanText(dto.name);
    if (!name) throw new BadRequestException('name is required');

    const providerId = await this.resolveProviderId(dto.providerId);

    // ✅ enforce locationCode server-side
    const locationCode = this.normalizeLocationCode(dto.locationCode);

    const row = this.repo.create({
      providerId,
      locationCode, // ✅ NEW column must exist (migration 0111)
      name,
      type: dto.type,
      address: this.toNull(dto.address),
      city: this.toNull(dto.city),
      state: this.cleanText(dto.state || 'TX').toUpperCase(),
      zip: this.toNull(dto.zip),
      status: 'ACTIVE',
    });

    const saved = await this.repo.save(row);

    // ✅ seed stored compliance results (Option A testing)
    await this.seedComplianceForNewLocation(saved);

    await this.audit.log({
      entityType: 'ResidentialLocation',
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

    if (dto.locationCode !== undefined) {
      row.locationCode = this.normalizeLocationCode(dto.locationCode);
    }

    if (dto.name !== undefined) {
      const v = this.cleanText(dto.name);
      if (!v) throw new BadRequestException('name cannot be empty');
      row.name = v;
    }

    if (dto.type !== undefined) row.type = dto.type;
    if (dto.address !== undefined) row.address = this.toNull(dto.address);
    if (dto.city !== undefined) row.city = this.toNull(dto.city);
    if (dto.state !== undefined) row.state = this.cleanText(dto.state || 'TX').toUpperCase();
    if (dto.zip !== undefined) row.zip = this.toNull(dto.zip);
    if (dto.status !== undefined) row.status = dto.status;

    const saved = await this.repo.save(row);

    await this.audit.log({
      entityType: 'ResidentialLocation',
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

    await this.repo.softRemove(row);

    await this.audit.log({
      entityType: 'ResidentialLocation',
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

  private async seedComplianceForNewLocation(loc: ResidentialLocationEntity): Promise<void> {
    // Only for dev/testing — safe for now.
    const now = new Date();

    const seed = [
      this.complianceRepo.create({
        providerId: loc.providerId,
        locationId: loc.id,
        entityType: 'RESIDENTIAL',
        entityId: loc.id,
        module: 'residential',
        ruleCode: '565.23(b)(5)',
        status: 'NON_COMPLIANT',
        severity: 'CRITICAL',
        message: 'Missing required residential documentation for initial setup.',
        routeCommands: ['/', 'residential', 'residency'],
        queryParams: { locationId: loc.id, rule: '565.23(b)(5)' },
        lastCheckedAt: now,
      }),

      this.complianceRepo.create({
        providerId: loc.providerId,
        locationId: loc.id,
        entityType: 'RESIDENTIAL',
        entityId: loc.id,
        module: 'fire',
        ruleCode: '565.23(b)(7)',
        status: 'NON_COMPLIANT',
        severity: 'MED',
        message: 'Fire drill log not recorded for the current month.',
        routeCommands: ['/', 'residential', 'fire', 'drills'],
        queryParams: { locationId: loc.id, rule: '565.23(b)(7)' },
        lastCheckedAt: now,
      }),

      this.complianceRepo.create({
        providerId: loc.providerId,
        locationId: loc.id,
        entityType: 'RESIDENTIAL',
        entityId: loc.id,
        module: 'training',
        ruleCode: '565.25',
        status: 'COMPLIANT',
        severity: 'LOW',
        message: 'Training records are up to date.',
        routeCommands: ['/', 'residential', 'training'],
        queryParams: { locationId: loc.id, rule: '565.25' },
        lastCheckedAt: now,
      }),
    ];

    await this.complianceRepo.save(seed);
  }
}
