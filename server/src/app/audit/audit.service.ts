import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity, AuditAction } from './entities/audit.entity';

export type AuditLogInput = {
  entityType?: string;
  entityId?: string | null;
  action?: AuditAction;

  actorUserId?: string | null;
  actorEmail?: string | null;
  actorRoles?: string[] | null;

  ip?: string | null;
  userAgent?: string | null;
  requestId?: string | null;

  meta?: any;
  before?: any;
  after?: any;
};

// ✅ used by interceptor so "unknown" doesn't break typing
export function toAuditAction(v?: string | null): AuditAction {
  switch ((v ?? '').toUpperCase()) {
    case 'CREATE':
    case 'UPDATE':
    case 'DELETE':
    case 'READ':
      return v!.toUpperCase() as AuditAction;
    default:
      return 'READ';
  }
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly repo: Repository<AuditLogEntity>,
  ) {}

  /**
   * Fire-and-forget audit write.
   * Do NOT throw from audit; never block the business request.
   */
  async log(input: AuditLogInput): Promise<void> {
    try {
      // ✅ IMPORTANT: use entity property names (camelCase), NOT column names
      const row = this.repo.create({
        entityType: input.entityType ?? 'unknown',
        entityId: input.entityId ?? null,
        action: (input.action ?? 'READ') as AuditAction,

        actorUserId: input.actorUserId ?? null,
        actorEmail: input.actorEmail ?? null,
        actorRoles: input.actorRoles ?? null,

        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        requestId: input.requestId ?? null,

        meta: input.meta ?? null,
        before: input.before ?? null,
        after: input.after ?? null,
      });

      // insert avoids extra select that save() may do
      await this.repo.insert(row);
    } catch {
      // swallow on purpose
    }
  }
}
