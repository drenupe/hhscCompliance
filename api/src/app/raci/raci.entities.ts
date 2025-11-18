import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import type { ModuleKey, AppRole } from '@hhsc-compliance/shared-models';

export type RaciLevel = 'R' | 'A' | 'C' | 'I';

// Example lookups (adjust to your schema)
@Entity('role_catalog')
@Unique(['name'])
export class RoleCatalog {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index() @Column({ type: 'text' }) name!: AppRole;
}

@Entity('module_catalog')
@Unique(['key'])
export class ModuleCatalog {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index() @Column({ type: 'text' }) key!: ModuleKey;
  @Column({ type: 'text' }) label!: string;
  @Column({ type: 'text' }) icon!: string;
  @Column({ type: 'text' }) path!: string;
}

@Entity('raci_assignment')
@Unique(['moduleId', 'roleId', 'level'])
export class RaciAssignment {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(() => ModuleCatalog, { eager: true })
  @JoinColumn({ name: 'moduleId' })
  module!: ModuleCatalog;

  @ManyToOne(() => RoleCatalog, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role!: RoleCatalog;

  @Index() @Column({ type: 'uuid' }) moduleId!: string;
  @Index() @Column({ type: 'uuid' }) roleId!: string;

  @Column({ type: 'text' }) level!: RaciLevel; // R/A/C/I
}
