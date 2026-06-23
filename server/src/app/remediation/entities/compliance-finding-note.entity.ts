import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('compliance_finding_notes')
@Index(['complianceResultId'])
export class ComplianceFindingNoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'compliance_result_id', type: 'uuid' })
  complianceResultId!: string;

  @Column({ type: 'text' })
  note!: string;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  createdByUserId?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({  type: 'uuid',  name: 'cap_id',  nullable: true,})
  capId!: string | null;
}