export enum MfaType {
  TOTP = 'totp', // pick lowercase
}
// api/src/app/auth/entities/mfa-secret.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mfa_secrets')
export class MfaSecret {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  // Keep as plain text; you can narrow type in TS to 'TOTP' | 'WEBAUTHN'
  @Column({ type: 'text' })
  type!: string;

  // For TOTP this is the base32 secret; for WebAuthn you’d store credential data
  @Column({ type: 'text' })
  secret!: string;

  // Mark enabled by setting enabledAt; null means not enabled yet
  @Column({ nullable: true })
  enabledAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
