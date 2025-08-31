// api/src/app/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Use varchar here (no DB extensions required). Unique index on email.
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email!: string;

  // Store bcrypt hash here
  @Column({ type: 'text' })
  passwordHash!: string;

  // Postgres text[] for roles; switch to 'simple-array' if you prefer a CSV column
  @Column({ type: 'text', array: true, default: '{}' })
  roles!: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
