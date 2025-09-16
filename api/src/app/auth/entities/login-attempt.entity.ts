// api/src/app/auth/entities/login-attempt.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

const IS_TEST = process.env.NODE_ENV === 'test';
const CITEXT = IS_TEST ? 'text' : ('citext' as any);
const TSTZ = IS_TEST ? 'datetime' : ('timestamptz' as any);
const NOW_SQL = 'CURRENT_TIMESTAMP';

@Entity('login_attempts')
@Index(['email', 'createdAt'])
@Index(['ip', 'createdAt'])
export class LoginAttempt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // email if provided, else null (citext in PG, text in SQLite tests)
  @Column({ type: CITEXT, nullable: true })
  email!: string | null;

  // IP stored as string (portable)
  @Column({ type: 'varchar', length: 64, nullable: true })
  ip!: string | null;

  @Column({ type: 'boolean', default: false })
  succeeded!: boolean;

  @CreateDateColumn({ type: TSTZ, default: () => NOW_SQL })
  createdAt!: Date;
}
