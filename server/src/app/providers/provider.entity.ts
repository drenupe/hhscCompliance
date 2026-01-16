import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProviderStatus = 'ACTIVE' | 'INACTIVE';

@Entity({ name: 'providers' })
export class ProviderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'citext', unique: true })
  name!: string;

  // keep legacy licenseNumber if you still want it
  @Column({ type: 'citext', name: 'license_number', unique: true, nullable: true })
  licenseNumber!: string | null;

  // HHSC / business identifiers (stored as TEXT; validated in DTO)
  @Index()
  @Column({ type: 'text', name: 'contract_number', nullable: true })
  contractNumber!: string | null;

  @Index()
  @Column({ type: 'text', name: 'component_code', nullable: true })
  componentCode!: string | null;

  @Index()
  @Column({ type: 'text', name: 'npi', nullable: true })
  npi!: string | null;

  @Index()
  @Column({ type: 'text', name: 'ein', nullable: true })
  ein!: string | null;

  // Location (simple, non-normalized)
  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ type: 'text', nullable: true })
  city!: string | null;

  @Column({ type: 'text', nullable: true, default: 'TX' })
  state!: string | null;

  @Column({ type: 'text', nullable: true })
  zip!: string | null;

  @Index()
  @Column({ type: 'text', default: 'ACTIVE' })
  status!: ProviderStatus;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
