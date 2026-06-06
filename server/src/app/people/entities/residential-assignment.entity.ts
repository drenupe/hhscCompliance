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
import { ResidentialLocationEntity } from '../../residential/residential-location.entity';

export type AssignmentStatus = 'ACTIVE' | 'INACTIVE';

@Entity({ name: 'residential_assignments' })
@Index('ix_res_assign_location', ['locationId'])
@Index('ix_res_assign_consumer_record', ['consumerRecordId'])
export class ResidentialAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'provider_id' })
  providerId!: string;

  @Column({ type: 'uuid', name: 'location_id' })
  locationId!: string;

  @ManyToOne(() => ResidentialLocationEntity)
  @JoinColumn({ name: 'location_id' })
  location?: ResidentialLocationEntity;

  @Column({ type: 'uuid', name: 'consumer_record_id' })
  consumerRecordId!: string;

  @ManyToOne(() => ConsumerRecordEntity)
  @JoinColumn({ name: 'consumer_record_id' })
  consumerRecord?: ConsumerRecordEntity;

  @Column({ type: 'date', name: 'start_date' })
  startDate!: string;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate!: string | null;

  @Index()
  @Column({ type: 'text', default: 'ACTIVE' })
  status!: AssignmentStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}