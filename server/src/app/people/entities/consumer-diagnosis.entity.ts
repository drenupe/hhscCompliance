// server/src/app/people/entities/consumer-diagnosis.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ConsumerRecordEntity } from './consumer-record.entity';

@Entity({ name: 'consumer_diagnoses' })
@Index(['consumerRecordId'])
@Index(['icd10Code'])
@Index(['status'])
export class ConsumerDiagnosisEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'consumer_record_id', type: 'uuid' })
  consumerRecordId!: string;

  @ManyToOne(() => ConsumerRecordEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consumer_record_id' })
  consumerRecord!: ConsumerRecordEntity;

  @Column({ name: 'icd10_code', length: 32, nullable: true })
  icd10Code!: string | null;

  @Column({ name: 'diagnosis_name', length: 255 })
  diagnosisName!: string;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;

  @Column({ name: 'effective_date', type: 'date', nullable: true })
  effectiveDate!: string | null;

  @Column({ name: 'resolved_date', type: 'date', nullable: true })
  resolvedDate!: string | null;

  @Column({ length: 32, default: 'ACTIVE' })
  status!: 'ACTIVE' | 'INACTIVE' | 'RESOLVED';

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}