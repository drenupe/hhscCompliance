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

export type ClinicalContactType =
  | 'PCP'
  | 'RN'
  | 'LVN'
  | 'PSYCHIATRIST'
  | 'DENTIST'
  | 'SPECIALIST';

export type ClinicalContactStatus =
  | 'ACTIVE'
  | 'INACTIVE';

@Entity({ name: 'clinical_contact_profiles' })
export class ClinicalContactProfileEntity {
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

  @Index()
  @Column({ type: 'text' })
  type!: ClinicalContactType;

  @Column({ type: 'text', nullable: true })
  organization!: string | null;

  @Column({ type: 'text', name: 'npi', nullable: true })
  npi!: string | null;

  @Column({ type: 'text', name: 'license_number', nullable: true })
  licenseNumber!: string | null;

  @Column({ type: 'text', nullable: true })
  phone!: string | null;

  @Column({ type: 'text', nullable: true })
  fax!: string | null;

  @Index()
  @Column({
    type: 'text',
    default: 'ACTIVE',
  })
  status!: ClinicalContactStatus;

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