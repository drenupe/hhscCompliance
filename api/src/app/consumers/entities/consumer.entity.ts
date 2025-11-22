/* eslint-disable @nx/enforce-module-boundaries */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IssProvider } from '../../iss/entities/iss-provider.entity';
import { IssStaffLog } from '../../iss/entities/iss-staff-log.entity';

@Entity('consumer')
export class Consumer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ name: 'medicaid_number', length: 64, nullable: true })
  medicaidNumber: string | null;

  @Column({ name: 'level_of_need', length: 32, nullable: true })
  levelOfNeed: string | null;

  @Column({ name: 'place_of_service', length: 32, nullable: true })
  placeOfService: string | null;

  @ManyToOne(() => IssProvider, (provider) => provider.consumers, {
    nullable: false,
  })
  @JoinColumn({ name: 'iss_provider_id' })
  issProvider: IssProvider;

  // 🔁 Inverse side of IssStaffLog.consumer
  @OneToMany(() => IssStaffLog, (log) => log.consumer)
  staffLogs: IssStaffLog[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
