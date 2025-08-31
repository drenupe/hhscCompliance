// api/src/app/auth/entities/user-session.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index() @Column({ type: 'uuid' }) userId!: string;
  @Column({ type: 'text', nullable: true }) userAgent?: string;
  @Column({ type: 'inet', nullable: true }) ip?: string;
  @Column({ type: 'timestamptz', nullable: true }) revokedAt?: Date;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
