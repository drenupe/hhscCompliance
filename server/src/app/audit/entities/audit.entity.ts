import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';

@Entity({ name: 'audit_log' })
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'entity_type', type: 'text' })
  entityType!: string;

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entityId!: string | null;

  @Column({ name: 'action', type: 'text' })
  action!: AuditAction;

  @Column({ name: 'actor_user_id', type: 'uuid', nullable: true })
  actorUserId!: string | null;

  @Column({ name: 'actor_email', type: 'text', nullable: true })
  actorEmail!: string | null;

  @Column({ name: 'actor_roles', type: 'text', array: true, nullable: true })
  actorRoles!: string[] | null;

  @Column({ name: 'ip', type: 'inet', nullable: true })
  ip!: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent!: string | null;

  @Column({ name: 'request_id', type: 'text', nullable: true })
  requestId!: string | null;

  @Column({ name: 'meta', type: 'jsonb', nullable: true })
  meta!: any;

  @Column({ name: 'before', type: 'jsonb', nullable: true })
  before!: any;

  @Column({ name: 'after', type: 'jsonb', nullable: true })
  after!: any;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}
