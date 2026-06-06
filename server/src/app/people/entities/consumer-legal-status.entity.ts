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

@Entity({ name: 'consumer_legal_statuses' })
@Index(['consumerRecordId'])
@Index(['status'])
export class ConsumerLegalStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'consumer_record_id', type: 'uuid' })
  consumerRecordId!: string;

  @ManyToOne(() => ConsumerRecordEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'consumer_record_id' })
  consumerRecord!: ConsumerRecordEntity;

  @Column({
    name: 'legal_status_type',
    length: 100,
  })
  legalStatusType!: string;

  @Column({
    name: 'court_order_date',
    type: 'date',
    nullable: true,
  })
  courtOrderDate!: string | null;

  @Column({
    name: 'effective_date',
    type: 'date',
    nullable: true,
  })
  effectiveDate!: string | null;

  @Column({
    name: 'expiration_date',
    type: 'date',
    nullable: true,
  })
  expirationDate!: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes!: string | null;

  @Column({
    length: 32,
    default: 'ACTIVE',
  })
  status!: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}