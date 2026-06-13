import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_mfa_secrets' })
@Index(['userId'], { unique: true })
@Index(['status'])
export class MfaSecretEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'encrypted_secret', type: 'text' })
  encryptedSecret!: string;

  @Column({ name: 'is_enabled', type: 'boolean', default: false })
  isEnabled!: boolean;

  @Column({ length: 32, default: 'PENDING' })
  status!: 'PENDING' | 'ACTIVE' | 'DISABLED';

  @Column({ name: 'enabled_at', type: 'timestamp', nullable: true })
  enabledAt!: Date | null;

  @Column({ name: 'disabled_at', type: 'timestamp', nullable: true })
  disabledAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}