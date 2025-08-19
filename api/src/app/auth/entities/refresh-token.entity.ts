// api/src/app/auth/entities/refresh-token.entity.ts
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserSession } from './user-session.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => UserSession, { onDelete: 'CASCADE' }) session!: UserSession;
  @Index() @Column({ type: 'uuid' }) sessionId!: string;
  @Column({ type: 'text' }) tokenHash!: string; // never store raw tokens
  @Column({ type: 'uuid', nullable: true }) prevId?: string; // for chain
  @Column({ type: 'timestamptz', nullable: true }) rotatedAt?: Date;
  @Column({ type: 'timestamptz', nullable: true }) revokedAt?: Date;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
}