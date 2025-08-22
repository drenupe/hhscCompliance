// api/src/app/auth/entities/login-attempt.entity.ts
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('login_attempts')
@Index(['email', 'createdAt'])
@Index(['ip', 'createdAt'])
export class LoginAttempt {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column({ type: 'citext', nullable: true })
  email!: string | null; // email if provided, else null

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip!: string | null;

  @Column({ type: 'boolean', default: false })
  succeeded!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
