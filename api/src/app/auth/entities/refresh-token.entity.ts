// api/src/app/auth/entities/refresh-token.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column('uuid', { name: 'userId' })    userId!: string;
  @Column('uuid', { name: 'sessionId' }) sessionId!: string;

  @Column('text', { name: 'tokenHash' }) tokenHash!: string;

  @Column('timestamptz', { name: 'expiresAt' })  expiresAt!: Date;
  @Column('timestamptz', { name: 'rotatedAt', nullable: true }) rotatedAt?: Date;
  @Column('timestamptz', { name: 'revokedAt', nullable: true }) revokedAt?: Date;

  @Column('text', { name: 'userAgent', nullable: true }) userAgent?: string;
  @Column('inet', { name: 'ip', nullable: true }) ip?: string;
}
