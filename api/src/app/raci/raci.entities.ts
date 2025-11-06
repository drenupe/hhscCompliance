import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import type { ModuleKey, Role } from '@hhsc-compliance/shared-models';

export type RaciLevel = 'R' | 'A' | 'C' | 'I';

@Entity('roles_catalog')
@Unique(['name'])
export class RoleCatalog {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 64 }) name!: Role;
}

@Entity('modules_catalog')
@Unique(['key'])
export class ModuleCatalog {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 64 }) key!: ModuleKey;
  @Column({ type: 'varchar', length: 128, default: '' }) label!: string;
  @Column({ type: 'varchar', length: 64, default: '' }) icon!: string;   // lucide icon name
  @Column({ type: 'varchar', length: 256, default: '' }) path!: string;   // route path
}

@Entity('raci_assignments')
@Index(['moduleId', 'roleId', 'level'], { unique: true })
export class RaciAssignment {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(() => ModuleCatalog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' }) module!: ModuleCatalog;
  @Column() moduleId!: string;

  @ManyToOne(() => RoleCatalog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' }) role!: RoleCatalog;
  @Column() roleId!: string;

  @Column({ type: 'varchar', length: 1 }) level!: RaciLevel; // 'R'|'A'|'C'|'I'
}
