import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'audit_logs' })
@Index(['userId'])
@Index(['action'])
@Index(['resourceType'])
@Index(['resourceId'])
@Index(['createdAt'])
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId!: string | null;

  @Column({ length: 100 })
  action!: string;

  @Column({ name: 'resource_type', length: 100 })
  resourceType!: string;

  @Column({ name: 'resource_id', length: 255, nullable: true })
  resourceId!: string | null;

  @Column({ name: 'ip_address', length: 64, nullable: true })
  ipAddress!: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent!: string | null;

  @Column({ name: 'before_value', type: 'jsonb', nullable: true })
  beforeValue!: Record<string, unknown> | null;

  @Column({ name: 'after_value', type: 'jsonb', nullable: true })
  afterValue!: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}