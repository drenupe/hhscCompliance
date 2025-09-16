import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_verifications')
export class EmailVerification {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Index() @Column({ type: 'uuid' })
  userId!: string;

  @Index() @Column({ type: 'text' })
  token!: string;

  @Column()
  expiresAt!: Date;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
