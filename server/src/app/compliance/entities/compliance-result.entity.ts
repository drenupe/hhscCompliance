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

export type ComplianceRouteCommands = unknown[] | null;

export type ComplianceQueryParams =
  | Record<string, string | number | boolean | null>
  | null;

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

  /**
   * Canonical module key.
   *
   * Examples:
   * RESIDENTIAL
   * MEDICATION
   * NURSING
   * EMERGENCY_PLANS
   * FIRE_DRILLS
   * ISS
   */
  @Column({ type: 'text' })
  module!: string;

  @Column({ type: 'text', name: 'subcategory', nullable: true })
  subcategory!: string | null;

  @Column({ type: 'text', name: 'rule_code' })
  ruleCode!: string;

  @Column({ type: 'text' })
  status!: ComplianceStatus;

  @Column({ type: 'text' })
  severity!: ComplianceSeverity;

  @Column({ type: 'text', nullable: true })
  message!: string | null;

  /**
   * Angular router commands used by dashboard findings
   * to deep-link users into the remediation screen.
   *
   * Example:
   * ['/residential', locationId, 'fire-drills']
   */
  @Column({ type: 'jsonb', name: 'route_commands', nullable: true })
  routeCommands!: ComplianceRouteCommands;

  /**
   * Optional route query params for remediation screens.
   *
   * Example:
   * { tab: 'missing-drills', ruleCode: 'FIRE_DRILL_MONTHLY' }
   */
  @Column({ type: 'jsonb', name: 'query_params', nullable: true })
  queryParams!: ComplianceQueryParams;

  @Column({ type: 'timestamptz', name: 'last_checked_at', nullable: true })
  lastCheckedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}