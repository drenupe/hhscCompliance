import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_permissions' })
@Index(['userId', 'permissionCode'], { unique: true })
@Index(['userId'])
@Index(['permissionCode'])
export class UserPermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'permission_code', length: 150 })
  permissionCode!: string;

  @Column({ name: 'effect', length: 16, default: 'ALLOW' })
  effect!: 'ALLOW' | 'DENY';

  @Column({ length: 255, nullable: true })
  reason!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}