/* eslint-disable @nx/enforce-module-boundaries */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IssProvider } from './iss-provider.entity';
import { Consumer } from '../../consumers/entities/consumer.entity';

@Entity('iss_staff_log')
export class IssStaffLog {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔗 Many logs belong to one consumer
  @ManyToOne(() => Consumer, (consumer) => consumer.staffLogs, {
    nullable: false,
  })
  @JoinColumn({ name: 'consumer_id' })
  consumer: Consumer;

  // 🔗 Many logs belong to one ISS provider
  @ManyToOne(() => IssProvider, (provider) => provider.staffLogs, {
    nullable: false,
  })
  @JoinColumn({ name: 'iss_provider_id' })
  issProvider: IssProvider;

  @Column({ name: 'service_date', type: 'date' })
  serviceDate: string; // or Date if you prefer, but string is fine for `date`

  // Store big JSON blobs from your Angular form
  @Column({ name: 'header', type: 'jsonb' })
  header: any;

  @Column({ name: 'service_week', type: 'jsonb' })
  serviceWeek: any;

  @Column({ name: 'weekly_sections', type: 'jsonb' })
  weeklySections: any;

  @Column({ name: 'notes', type: 'jsonb' })
  notes: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
