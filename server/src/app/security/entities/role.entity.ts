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

@Entity({ name: 'roles' })
@Index(['name'], { unique: true })
@Index(['status'])
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 255, nullable: true })
  description!: string | null;

  @Column({ length: 32, default: 'ACTIVE' })
  status!: string;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.role)
  rolePermissions!: RolePermissionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}