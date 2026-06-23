import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('corrective_action_plans')
@Index(['complianceResultId'])
@Index(['status'])
export class CorrectiveActionPlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'compliance_result_id', type: 'uuid' })
  complianceResultId!: string;

  @Column({ type: 'varchar', length: 40, default: 'OPEN' })
  status!: string;

  @Column({ type: 'text' })
  issue!: string;

  @Column({ name: 'corrective_action', type: 'text' })
  correctiveAction!: string;

  @Column({ name: 'responsible_party', type: 'varchar', length: 160, nullable: true })
  responsibleParty?: string | null;

  @Column({ name: 'target_completion_date', type: 'date', nullable: true })
  targetCompletionDate?: string | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date | null;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  createdByUserId?: string | null;

  @Column({ name: 'updated_by_user_id', type: 'uuid', nullable: true })
  updatedByUserId?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}