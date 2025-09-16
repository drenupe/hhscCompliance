// api/src/app/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

const IS_TEST = process.env.NODE_ENV === 'test';
const TSTZ = IS_TEST ? 'datetime' : ('timestamptz' as any);
const NOW_SQL = 'CURRENT_TIMESTAMP';

// Use PG array in prod; fallback to simple CSV in SQLite tests
const ROLES_COLUMN = IS_TEST
  ? ({ type: 'simple-array', default: '' } as const)
  : ({ type: 'text', array: true, default: '{}' } as any);

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Portable email column with unique index
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email!: string;

  // Store bcrypt hash here
  @Column({ type: 'text' })
  passwordHash!: string;

  @Column(ROLES_COLUMN)
  roles!: string[];

  @CreateDateColumn({ type: TSTZ, default: () => NOW_SQL })
  createdAt!: Date;

  @UpdateDateColumn({ type: TSTZ, default: () => NOW_SQL })
  updatedAt!: Date;
}
