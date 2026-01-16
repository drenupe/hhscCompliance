import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderEntity, ProviderStatus } from './provider.entity';
import { AuditService } from '../audit/audit.service';
import { CreateProviderDto, UpdateProviderDto } from './providers.dto';

type Actor = { id?: string; email?: string; roles?: string[] };
type ReqMeta = { ip?: string; userAgent?: string; requestId?: string };

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(ProviderEntity)
    private readonly repo: Repository<ProviderEntity>,
    private readonly audit: AuditService,
  ) {}

  list(): Promise<ProviderEntity[]> {
    return this.repo.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async get(id: string): Promise<ProviderEntity> {
    const row = await this.repo.findOne({ where: { id, deletedAt: null } });
    if (!row) throw new NotFoundException('Provider not found');
    return row;
  }

  async create(dto: CreateProviderDto, actor?: Actor, meta?: ReqMeta) {
    const name = this.clean(dto.name);
    if (!name) throw new BadRequestException('name is required');

    const row = this.repo.create({
      name,

      // keep legacy if you still use it
      licenseNumber: this.cleanOrNull(dto.licenseNumber),

      contractNumber: this.digitsOrNull(dto.contractNumber),
      componentCode: this.digitsOrNull(dto.componentCode),
      npi: this.digitsOrNull(dto.npi),
      ein: this.digitsOrNull(dto.ein),

      address: this.cleanOrNull(dto.address),
      city: this.cleanOrNull(dto.city),
      state: this.stateOrNull(dto.state),
      zip: this.zipOrNull(dto.zip),

      status: 'ACTIVE',
    });

    const saved = await this.repo.save(row);

    await this.audit.log({
      entityType: 'Provider',
      entityId: saved.id,
      action: 'CREATE',
      after: this.auditShape(saved),
      actorUserId: actor?.id ?? null,
      actorEmail: actor?.email ?? null,
      actorRoles: actor?.roles ?? null,
      ip: meta?.ip ?? null,
      userAgent: meta?.userAgent ?? null,
      requestId: meta?.requestId ?? null,
    });

    return saved;
  }

  async update(id: string, dto: UpdateProviderDto, actor?: Actor, meta?: ReqMeta) {
    const row = await this.get(id);
    const before = this.auditShape(row);

    // name
    if (dto.name !== undefined) {
      const next = this.clean(dto.name);
      if (!next) throw new BadRequestException('name cannot be empty');
      row.name = next;
    }

    // legacy
    if (dto.licenseNumber !== undefined) row.licenseNumber = this.cleanOrNull(dto.licenseNumber);

    // identifiers
    if (dto.contractNumber !== undefined) row.contractNumber = this.digitsOrNull(dto.contractNumber);
    if (dto.componentCode !== undefined) row.componentCode = this.digitsOrNull(dto.componentCode);
    if (dto.npi !== undefined) row.npi = this.digitsOrNull(dto.npi);
    if (dto.ein !== undefined) row.ein = this.digitsOrNull(dto.ein);

    // address
    if (dto.address !== undefined) row.address = this.cleanOrNull(dto.address);
    if (dto.city !== undefined) row.city = this.cleanOrNull(dto.city);
    if (dto.state !== undefined) row.state = this.stateOrNull(dto.state);
    if (dto.zip !== undefined) row.zip = this.zipOrNull(dto.zip);

    // status
    if (dto.status !== undefined) row.status = dto.status as ProviderStatus;

    const saved = await this.repo.save(row);

    await this.audit.log({
      entityType: 'Provider',
      entityId: saved.id,
      action: 'UPDATE',
      before,
      after: this.auditShape(saved),
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
    const before = this.auditShape(row);

    await this.repo.softRemove(row);

    await this.audit.log({
      entityType: 'Provider',
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

  // ---------------------------
  // helpers
  // ---------------------------

  private clean(v: unknown): string {
    return String(v ?? '').trim();
  }

  private cleanOrNull(v: unknown): string | null {
    const s = this.clean(v);
    return s.length ? s : null;
  }

  private digitsOrNull(v: unknown): string | null {
    const s = this.clean(v).replace(/[^\d]/g, '');
    return s.length ? s : null;
  }

  private stateOrNull(v: unknown): string | null {
    const s = this.clean(v).toUpperCase();
    if (!s) return 'TX'; // default
    return s;
  }

  private zipOrNull(v: unknown): string | null {
    const s = this.clean(v);
    if (!s) return null;
    // keep digits and optional dash
    const z = s.replace(/[^\d-]/g, '');
    return z.length ? z : null;
  }

  private auditShape(p: ProviderEntity) {
    return {
      id: p.id,
      name: p.name,
      licenseNumber: p.licenseNumber ?? null,

      contractNumber: (p as any).contractNumber ?? null,
      componentCode: (p as any).componentCode ?? null,
      npi: (p as any).npi ?? null,
      ein: (p as any).ein ?? null,

      address: (p as any).address ?? null,
      city: (p as any).city ?? null,
      state: (p as any).state ?? null,
      zip: (p as any).zip ?? null,

      status: p.status,
    };
  }
}
