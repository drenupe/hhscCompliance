import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ComplianceEntityType =
  | 'RESIDENTIAL'
  | 'CONSUMER'
  | 'EMPLOYEE'
  | 'PROVIDER';

export type ComplianceStatus =
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'UNKNOWN';

export type ComplianceSeverity =
  | 'LOW'
  | 'MED'
  | 'HIGH'
  | 'CRITICAL';

export type ComplianceRouteCommands = string[] | null;

export type ComplianceQueryParams =
  | Record<string, string | number | boolean | null>
  | null;

export type ComplianceCapStatus =
  | 'NONE'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'READY_FOR_REVIEW'
  | 'RESOLVED'
  | 'CLOSED';

@Entity({ name: 'compliance_results' })
@Index(
  'ux_compliance_results_unique',
  ['providerId', 'locationId', 'entityType', 'entityId', 'ruleCode'],
  { unique: true },
)
@Index('ix_compliance_results_location', ['locationId'])
@Index('ix_compliance_results_status', ['status'])
@Index('ix_compliance_results_module', ['module'])
@Index('ix_compliance_results_provider', ['providerId'])
@Index('ix_compliance_results_entity', ['entityType', 'entityId'])
@Index('ix_compliance_results_cap_status', ['capStatus'])
export class ComplianceResultEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'provider_id' })
  providerId!: string;

  @Column({ type: 'uuid', name: 'location_id', nullable: true })
  locationId!: string | null;

  @Column({ type: 'text', name: 'entity_type' })
  entityType!: ComplianceEntityType;

  @Column({ type: 'uuid', name: 'entity_id' })
  entityId!: string;

  @Column({ type: 'text' })
  module!: string;

  @Column({ type: 'text', nullable: true })
  subcategory!: string | null;

  @Column({ type: 'text', name: 'rule_code' })
  ruleCode!: string;

  @Column({ type: 'text' })
  status!: ComplianceStatus;

  @Column({ type: 'text' })
  severity!: ComplianceSeverity;

  @Column({ type: 'text', nullable: true })
  message!: string | null;

  @Column({ type: 'jsonb', name: 'route_commands', nullable: true })
  routeCommands!: ComplianceRouteCommands;

  @Column({ type: 'jsonb', name: 'query_params', nullable: true })
  queryParams!: ComplianceQueryParams;

  /**
   * Quick dashboard indicator showing whether this finding has CAP activity.
   * Source of truth remains corrective_action_plans.
   */
  @Column({ type: 'text', name: 'cap_status', default: 'NONE' })
  capStatus!: ComplianceCapStatus;

  @Column({ type: 'int', name: 'cap_count', default: 0 })
  capCount!: number;

  @Column({ type: 'timestamptz', name: 'last_checked_at', nullable: true })
  lastCheckedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'boolean', name: 'needs_recheck', default: false })
  needsRecheck!: boolean;

  @Column({ type: 'timestamptz', name: 'next_check_at', nullable: true })
  nextCheckAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'last_rechecked_at', nullable: true })
  lastRecheckedAt!: Date | null;

  @Column({ type: 'text', name: 'recheck_reason', nullable: true })
  recheckReason!: string | null;

  
}
