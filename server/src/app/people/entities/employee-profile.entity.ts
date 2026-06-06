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

export type EmployeeStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'TERMINATED'
  | 'ON_LEAVE';

@Entity({ name: 'employee_profiles' })
export class EmployeeProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid', name: 'person_id' })
  personId!: string;

  @OneToOne(() => PersonEntity)
  @JoinColumn({ name: 'person_id' })
  person?: PersonEntity;

  @Index()
  @Column({ type: 'uuid', name: 'provider_id' })
  providerId!: string;

  @Column({ type: 'text', name: 'employee_number', nullable: true })
  employeeNumber!: string | null;

  @Column({ type: 'text', name: 'job_title', nullable: true })
  jobTitle!: string | null;

  @Column({ type: 'date', name: 'hire_date', nullable: true })
  hireDate!: string | null;

  @Column({ type: 'date', name: 'termination_date', nullable: true })
  terminationDate!: string | null;

  @Column({ type: 'text', name: 'credentials', nullable: true })
  credentials!: string | null;

  @Column({ type: 'boolean', name: 'is_direct_care', default: false })
  isDirectCare!: boolean;

  @Column({ type: 'boolean', name: 'is_case_manager', default: false })
  isCaseManager!: boolean;

  @Column({ type: 'boolean', name: 'is_nurse', default: false })
  isNurse!: boolean;

  @Column({ type: 'boolean', name: 'requires_background_check', default: true })
  requiresBackgroundCheck!: boolean;

  @Column({ type: 'date', name: 'background_check_date', nullable: true })
  backgroundCheckDate!: string | null;

  @Index()
  @Column({ type: 'text', default: 'ACTIVE' })
  status!: EmployeeStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}