import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,      // ⬅️ use PrimaryColumn, not PrimaryGeneratedColumn
  UpdateDateColumn,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryColumn('uuid')
  id!: string;

  @Index() @Column({ type: 'uuid' })
  userId!: string;

  @Index() @Column({ type: 'uuid' })
  sessionId!: string;

  @Column({ type: 'text' })
  tokenHash!: string;

  // Portable dates (no explicit DB type needed)
  @Column()
  expiresAt!: Date;

  @Column({ nullable: true })
  revokedAt?: Date;

  @Column({ nullable: true })
  rotatedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
