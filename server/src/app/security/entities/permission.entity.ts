import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RolePermissionEntity } from './role-permission.entity';

@Entity({ name: 'permissions' })
@Index(['code'], { unique: true })
@Index(['module'])
@Index(['status'])
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 150 })
  code!: string;

  @Column({ length: 100 })
  module!: string;

  @Column({ length: 255, nullable: true })
  description!: string | null;

  @Column({ length: 32, default: 'ACTIVE' })
  status!: string;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.permission)
  rolePermissions!: RolePermissionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}