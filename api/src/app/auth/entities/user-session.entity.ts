import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Map PG-only types to SQLite-friendly ones during tests
const IS_TEST = process.env.NODE_ENV === 'test';
const IP_ADDR = IS_TEST ? 'text' : ('inet' as any);
const TSTZ = IS_TEST ? 'datetime' : ('timestamptz' as any);
const NOW_SQL = 'CURRENT_TIMESTAMP';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  // was: { type: 'inet' }
  @Column({ type: IP_ADDR, nullable: true })
  ip?: string;

  // was: { type: 'timestamptz', nullable: true }
  @Column({ type: TSTZ, nullable: true })
  revokedAt?: Date;

  // was: { type: 'timestamptz' }
  @CreateDateColumn({ type: TSTZ, default: () => NOW_SQL })
  createdAt!: Date;

  // was: { type: 'timestamptz' }
  @UpdateDateColumn({ type: TSTZ, default: () => NOW_SQL })
  updatedAt!: Date;
}
