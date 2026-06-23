import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'compliance_result_caps' })
@Index(
  'ux_compliance_result_cap',
  ['complianceResultId', 'capId'],
  { unique: true },
)
@Index('ix_crc_compliance_result', ['complianceResultId'])
@Index('ix_crc_cap', ['capId'])
export class ComplianceResultCapEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uuid',
    name: 'compliance_result_id',
  })
  complianceResultId!: string;

  @Column({
    type: 'uuid',
    name: 'cap_id',
  })
  capId!: string;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt!: Date;
}