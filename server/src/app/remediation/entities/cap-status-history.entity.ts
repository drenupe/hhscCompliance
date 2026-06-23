import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cap_status_history' })
@Index('ix_cap_status_history_cap', ['capId'])
export class CapStatusHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'cap_id' })
  capId!: string;

  @Column({ type: 'text', name: 'from_status', nullable: true })
  fromStatus!: string | null;

  @Column({ type: 'text', name: 'to_status' })
  toStatus!: string;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ type: 'uuid', name: 'changed_by_user_id', nullable: true })
  changedByUserId!: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}