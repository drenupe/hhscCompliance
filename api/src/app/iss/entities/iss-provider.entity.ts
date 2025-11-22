import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IssStaffLog } from './iss-staff-log.entity';
import { Consumer } from '../../consumers/entities/consumer.entity';

@Entity('iss_provider')
export class IssProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'license_number', length: 50 })
  licenseNumber: string;

  @OneToMany(() => Consumer, (consumer) => consumer.issProvider)
  consumers: Consumer[];

  @OneToMany(() => IssStaffLog, (log) => log.issProvider)
  staffLogs: IssStaffLog[];   // 👈 MUST be an array

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
