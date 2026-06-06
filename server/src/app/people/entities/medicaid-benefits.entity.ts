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

@Entity({ name: 'medicaid_benefits' })
@Index(['consumerRecordId'])
@Index(['medicaidNumber'])
@Index(['eligibilityStatus'])
export class MedicaidBenefitsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'consumer_record_id',
    type: 'uuid',
  })
  consumerRecordId!: string;

  @ManyToOne(() => ConsumerRecordEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'consumer_record_id',
  })
  consumerRecord!: ConsumerRecordEntity;

  @Column({
    name: 'medicaid_number',
    length: 64,
  })
  medicaidNumber!: string;

  @Column({
    name: 'waiver_program',
    length: 100,
    nullable: true,
  })
  waiverProgram!: string | null;

  @Column({
    name: 'mco_name',
    length: 100,
    nullable: true,
  })
  mcoName!: string | null;

  @Column({
    name: 'eligibility_status',
    length: 50,
    default: 'ACTIVE',
  })
  eligibilityStatus!: string;

  @Column({
    name: 'effective_date',
    type: 'date',
    nullable: true,
  })
  effectiveDate!: string | null;

  @Column({
    name: 'renewal_date',
    type: 'date',
    nullable: true,
  })
  renewalDate!: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes!: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}