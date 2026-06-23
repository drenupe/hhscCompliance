import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type CapEvidenceType =
  | 'PHOTO'
  | 'PDF'
  | 'POLICY'
  | 'TRAINING_RECORD'
  | 'FORM'
  | 'OTHER';

@Entity({ name: 'cap_evidence' })
@Index('ix_cap_evidence_cap', ['capId'])
@Index('ix_cap_evidence_compliance_result', ['complianceResultId'])
@Index('ix_cap_evidence_type', ['evidenceType'])
export class CapEvidenceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'cap_id' })
  capId!: string;

  @Column({ type: 'uuid', name: 'compliance_result_id' })
  complianceResultId!: string;

  @Column({ type: 'text', name: 'file_name' })
  fileName!: string;

  @Column({ type: 'text', name: 'file_type' })
  fileType!: string;

  @Column({ type: 'text', name: 'storage_path' })
  storagePath!: string;

  @Column({ type: 'text', name: 'evidence_type', default: 'OTHER' })
  evidenceType!: CapEvidenceType;

  @Column({ type: 'uuid', name: 'uploaded_by_user_id', nullable: true })
  uploadedByUserId!: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}