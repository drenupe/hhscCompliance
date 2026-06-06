// server/src/app/people/entities/consumer-guardian.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ConsumerRecordEntity } from './consumer-record.entity';

@Entity({ name: 'consumer_guardians' })
@Index(['consumerRecordId'])
@Index(['status'])
@Index(['isPrimaryGuardian'])
@Index(['isEmergencyContact'])
export class ConsumerGuardianEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'consumer_record_id', type: 'uuid' })
  consumerRecordId!: string;

  @ManyToOne(() => ConsumerRecordEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'consumer_record_id' })
  consumerRecord!: ConsumerRecordEntity;

  @Column({ name: 'first_name', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', length: 100 })
  lastName!: string;

  @Column({ length: 100, nullable: true })
  relationship!: string | null;

  @Column({ length: 32, nullable: true })
  phone!: string | null;

  @Column({ length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ name: 'is_primary_guardian', type: 'boolean', default: false })
  isPrimaryGuardian!: boolean;

  @Column({ name: 'is_emergency_contact', type: 'boolean', default: false })
  isEmergencyContact!: boolean;

  @Column({ name: 'has_medical_decision_authority', type: 'boolean', default: false })
  hasMedicalDecisionAuthority!: boolean;

  @Column({ name: 'has_financial_decision_authority', type: 'boolean', default: false })
  hasFinancialDecisionAuthority!: boolean;

  @Column({ length: 32, default: 'ACTIVE' })
  status!: 'ACTIVE' | 'INACTIVE';

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}