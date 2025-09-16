import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Index() @Column({ type: 'uuid' })
  userId!: string;

  @Index() @Column({ type: 'text' })
  token!: string;

  @Column()
  expiresAt!: Date;

  @Column({ nullable: true })
  usedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
