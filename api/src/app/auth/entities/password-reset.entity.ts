// api/src/app/auth/entities/password-reset.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index() @Column({ type: 'uuid' }) userId!: string;
  @Column({ type: 'text' }) codeHash!: string;
  @Column({ type: 'timestamptz' }) expiresAt!: Date;
  @Column({ type: 'timestamptz', nullable: true }) consumedAt?: Date;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
}