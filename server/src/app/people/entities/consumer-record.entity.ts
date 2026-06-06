import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PersonEntity } from './person.entity';

export type ConsumerStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DISCHARGED'
  | 'DECEASED';

@Entity({ name: 'consumer_records' })
export class ConsumerRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid', name: 'person_id' })
  personId!: string;

  @OneToOne(() => PersonEntity)
  @JoinColumn({ name: 'person_id' })
  person?: PersonEntity;

  // =====================================================
  // HCS / Medicaid
  // =====================================================

  @Index()
  @Column({
    type: 'text',
    name: 'medicaid_number',
    nullable: true,
  })
  medicaidNumber!: string | null;

  @Column({
    type: 'text',
    name: 'level_of_need',
    nullable: true,
  })
  levelOfNeed!: string | null;

  @Column({
    type: 'text',
    name: 'place_of_service',
    nullable: true,
  })
  placeOfService!: string | null;

  @Column({
    type: 'text',
    name: 'service_group',
    nullable: true,
  })
  serviceGroup!: string | null;

  // =====================================================
  // HCS Enrollment
  // =====================================================

  @Column({
    type: 'date',
    name: 'enrollment_date',
    nullable: true,
  })
  enrollmentDate!: string | null;

  @Column({
    type: 'date',
    name: 'discharge_date',
    nullable: true,
  })
  dischargeDate!: string | null;

  // =====================================================
  // Demographic Snapshot
  // (frequently used data duplicated for reporting)
  // =====================================================

  @Column({
    type: 'text',
    name: 'gender',
    nullable: true,
  })
  gender!: string | null;

  @Column({
    type: 'text',
    name: 'preferred_language',
    nullable: true,
  })
  preferredLanguage!: string | null;

  // =====================================================
  // Emergency / Guardian Flags
  // =====================================================

  @Column({
    type: 'boolean',
    name: 'has_guardian',
    default: false,
  })
  hasGuardian!: boolean;

  @Column({
    type: 'boolean',
    name: 'requires_nursing',
    default: false,
  })
  requiresNursing!: boolean;

  @Column({
    type: 'boolean',
    name: 'has_behavior_support_plan',
    default: false,
  })
  hasBehaviorSupportPlan!: boolean;

  // =====================================================
  // Medicaid / Benefits Tracking
  // =====================================================

  @Column({
    type: 'date',
    name: 'medicaid_renewal_date',
    nullable: true,
  })
  medicaidRenewalDate!: string | null;

  @Column({
    type: 'boolean',
    name: 'medicaid_active',
    default: true,
  })
  medicaidActive!: boolean;

  // =====================================================
  // Status
  // =====================================================

  @Index()
  @Column({
    type: 'text',
    default: 'ACTIVE',
  })
  status!: ConsumerStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt!: Date;
}