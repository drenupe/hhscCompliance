import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ResidentialLocationEntity } from './residential-location.entity';
import { AuditService } from '../audit/audit.service';
import { ProviderEntity } from '../providers/provider.entity';

type Actor = { id?: string; email?: string; roles?: string[] };
type ReqMeta = { ip?: string; userAgent?: string; requestId?: string };

@Injectable()
export class ResidentialLocationsService {
  constructor(
    @InjectRepository(ResidentialLocationEntity) private readonly repo: Repository<ResidentialLocationEntity>,
    @InjectRepository(ProviderEntity) private readonly providers: Repository<ProviderEntity>,
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

    // single-tenant assumption: use the first provider row
    // don't assume ProviderEntity has deletedAt
    const where: FindOptionsWhere<ProviderEntity> = {} as any;

    // If ProviderEntity supports soft delete, this will work; if not, it's ignored safely.
    // (TypeORM will ignore unknown props on where only if you don't include them.
    // So we do a runtime guard.)
    const cols = this.providers.metadata.columns.map((c) => c.propertyName);
    if (cols.includes('deletedAt')) (where as any).deletedAt = null;

    const p = await this.providers.findOne({
      where,
      order: { createdAt: 'ASC' } as any,
    });

    if (!p) throw new BadRequestException('No Provider exists yet. Create Provider first.');
    return (p as any).id;
  }

  async create(dto: any, actor?: Actor, meta?: ReqMeta) {
    const name = String(dto.name ?? '').trim();
    if (!name) throw new BadRequestException('name is required');

    const providerId = await this.resolveProviderId(dto.providerId);

    const row = this.repo.create({
      providerId,
      name,
      type: dto.type,
      address: dto.address ? String(dto.address).trim() : null,
      city: dto.city ? String(dto.city).trim() : null,
      state: dto.state ? String(dto.state).trim().toUpperCase() : 'TX',
      zip: dto.zip ? String(dto.zip).trim() : null,
      status: 'ACTIVE',
    });

    const saved = await this.repo.save(row);

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

    if (dto.name !== undefined) {
      const v = String(dto.name).trim();
      if (!v) throw new BadRequestException('name cannot be empty');
      row.name = v;
    }
    if (dto.type !== undefined) row.type = dto.type;
    if (dto.address !== undefined) row.address = dto.address ? String(dto.address).trim() : null;
    if (dto.city !== undefined) row.city = dto.city ? String(dto.city).trim() : null;
    if (dto.state !== undefined) row.state = dto.state ? String(dto.state).trim().toUpperCase() : 'TX';
    if (dto.zip !== undefined) row.zip = dto.zip ? String(dto.zip).trim() : null;
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
}
