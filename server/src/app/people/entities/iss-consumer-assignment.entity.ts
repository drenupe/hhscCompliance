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

import { IssProvider } from '../../iss/entities/iss-provider.entity';
import { ConsumerRecordEntity } from './consumer-record.entity';

export type IssAssignmentStatus = 'ACTIVE' | 'INACTIVE';

@Entity({ name: 'iss_consumer_assignments' })
@Index('ix_iss_assign_provider', ['issProviderId'])
@Index('ix_iss_assign_consumer_record', ['consumerRecordId'])
export class IssConsumerAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'consumer_record_id' })
  consumerRecordId!: string;

  @ManyToOne(() => ConsumerRecordEntity)
  @JoinColumn({ name: 'consumer_record_id' })
  consumerRecord?: ConsumerRecordEntity;

  @Column({ type: 'int', name: 'iss_provider_id' })
  issProviderId!: number;

  @ManyToOne(() => IssProvider)
  @JoinColumn({ name: 'iss_provider_id' })
  issProvider?: IssProvider;

  @Column({ type: 'date', name: 'start_date' })
  startDate!: string;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate!: string | null;

  @Index()
  @Column({ type: 'text', default: 'ACTIVE' })
  status!: IssAssignmentStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}