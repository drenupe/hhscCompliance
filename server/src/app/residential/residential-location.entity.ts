import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ProviderEntity } from '../providers/provider.entity';

export type ResidentialType = 'THREE_PERSON' | 'FOUR_PERSON' | 'HOST_HOME';
export type RecordStatus = 'ACTIVE' | 'INACTIVE';

@Entity({ name: 'residential_locations' })
export class ResidentialLocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'provider_id' })
  providerId!: string;

  @ManyToOne(() => ProviderEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider?: ProviderEntity;

  @Index()
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  type!: ResidentialType;

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
  status!: RecordStatus;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
