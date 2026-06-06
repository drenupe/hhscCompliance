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
import { EmployeeProfileEntity } from './employee-profile.entity';
import { ClinicalContactProfileEntity } from './clinical-contact-profile.entity';

export type CareTeamRole =
  | 'CASE_MANAGER'
  | 'RN'
  | 'LVN'
  | 'PCP'
  | 'PSYCHIATRIST'
  | 'DENTIST'
  | 'SPECIALIST'
  | 'GUARDIAN'
  | 'PROGRAM_MANAGER'
  | 'QIDP';

export type CareTeamAssignmentStatus = 'ACTIVE' | 'INACTIVE';

@Entity({ name: 'consumer_care_team_assignments' })
@Index('ix_care_team_consumer_record', ['consumerRecordId'])
@Index('ix_care_team_employee_profile', ['employeeProfileId'])
@Index('ix_care_team_clinical_contact', ['clinicalContactProfileId'])
@Index('ix_care_team_role', ['role'])
export class ConsumerCareTeamAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'consumer_record_id' })
  consumerRecordId!: string;

  @ManyToOne(() => ConsumerRecordEntity)
  @JoinColumn({ name: 'consumer_record_id' })
  consumerRecord?: ConsumerRecordEntity;

  @Column({ type: 'uuid', name: 'employee_profile_id', nullable: true })
  employeeProfileId!: string | null;

  @ManyToOne(() => EmployeeProfileEntity, { nullable: true })
  @JoinColumn({ name: 'employee_profile_id' })
  employeeProfile?: EmployeeProfileEntity | null;

  @Column({ type: 'uuid', name: 'clinical_contact_profile_id', nullable: true })
  clinicalContactProfileId!: string | null;

  @ManyToOne(() => ClinicalContactProfileEntity, { nullable: true })
  @JoinColumn({ name: 'clinical_contact_profile_id' })
  clinicalContactProfile?: ClinicalContactProfileEntity | null;

  @Column({ type: 'text' })
  role!: CareTeamRole;

  @Column({ type: 'date', name: 'start_date' })
  startDate!: string;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate!: string | null;

  @Index()
  @Column({ type: 'text', default: 'ACTIVE' })
  status!: CareTeamAssignmentStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}