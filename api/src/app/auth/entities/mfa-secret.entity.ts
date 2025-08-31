// api/src/app/auth/entities/mfa-secret.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mfa_secrets')
export class MfaSecret {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index() @Column({ type: 'uuid' }) userId!: string;
  @Column({ type: 'text' }) type!: 'totp' | 'webauthn';
  @Column({ type: 'text' }) secret!: string; // store encrypted if possible
  @Column({ type: 'text', array: true, nullable: true }) backupCodesHash?: string[];
  @Column({ type: 'timestamptz', nullable: true }) enabledAt?: Date;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
}