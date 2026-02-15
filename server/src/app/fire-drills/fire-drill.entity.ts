import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type DrillShift = 'DAY' | 'EVENING' | 'NIGHT';
export type YesNo = 'YES' | 'NO';
export type AmPm = 'AM' | 'PM';

@Entity({ name: 'fire_drills' })
@Index('ix_fire_drills_location', ['locationId'])
@Index('ix_fire_drills_date', ['locationId', 'dateDrillConducted'])
export class FireDrillEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'provider_id' })
  providerId!: string;

  @Column({ type: 'uuid', name: 'location_id' })
  locationId!: string;

  // Header
  @Column({ type: 'date', name: 'date_drill_conducted' })
  dateDrillConducted!: string; // YYYY-MM-DD

  @Column({ type: 'text', name: 'time_drill_conducted', nullable: true })
  timeDrillConducted!: string | null; // "HH:MM" or null

  @Column({ type: 'text', name: 'shift' })
  shift!: DrillShift;

  // Before drill (arrays + otherText)
  @Column({ type: 'jsonb', name: 'simulated_situations', nullable: true })
  simulatedSituations!: string[] | null;

  @Column({ type: 'text', name: 'simulated_other_text', nullable: true })
  simulatedOtherText!: string | null;

  @Column({ type: 'jsonb', name: 'locations', nullable: true })
  locations!: string[] | null;

  @Column({ type: 'text', name: 'location_other_text', nullable: true })
  locationOtherText!: string | null;

  @Column({ type: 'jsonb', name: 'fire_types', nullable: true })
  fireTypes!: string[] | null;

  @Column({ type: 'text', name: 'fire_type_other_text', nullable: true })
  fireTypeOtherText!: string | null;

  @Column({ type: 'jsonb', name: 'extent_of_fire', nullable: true })
  extentOfFire!: string[] | null;

  @Column({ type: 'text', name: 'extent_of_fire_other_text', nullable: true })
  extentOfFireOtherText!: string | null;

  @Column({ type: 'jsonb', name: 'extent_of_smoke', nullable: true })
  extentOfSmoke!: string[] | null;

  @Column({ type: 'text', name: 'extent_of_smoke_other_text', nullable: true })
  extentOfSmokeOtherText!: string | null;

  @Column({ type: 'jsonb', name: 'exits_used', nullable: true })
  exitsUsed!: string[] | null;

  @Column({ type: 'text', name: 'exit_other_text', nullable: true })
  exitOtherText!: string | null;

  @Column({ type: 'text', name: 'rally_point', nullable: true })
  rallyPoint!: string | null;

  // After drill
  @Column({ type: 'text', name: 'staff_used_proper_judgment', nullable: true })
  staffUsedProperJudgment!: YesNo | null;

  @Column({ type: 'text', name: 'actions_taken', nullable: true })
  actionsTaken!: string | null;

  @Column({ type: 'text', name: 'fire_department_called', nullable: true })
  fireDepartmentCalled!: YesNo | null;

  @Column({ type: 'text', name: 'fire_department_called_time', nullable: true })
  fireDepartmentCalledTime!: string | null;

  @Column({ type: 'text', name: 'fire_department_called_ampm', nullable: true })
  fireDepartmentCalledAmPm!: AmPm | null;

  @Column({ type: 'text', name: 'residents_removed_to_safety', nullable: true })
  residentsRemovedToSafety!: YesNo | null;

  @Column({ type: 'text', name: 'egress_clear', nullable: true })
  egressClear!: YesNo | null;

  @Column({ type: 'text', name: 'corridor_doors_closed', nullable: true })
  corridorDoorsClosed!: YesNo | null;

  @Column({ type: 'text', name: 'who_responded_and_equipment', nullable: true })
  whoRespondedAndEquipment!: string | null;

  @Column({ type: 'text', name: 'staff_monitored_exits', nullable: true })
  staffMonitoredExits!: YesNo | null;

  @Column({ type: 'text', name: 'building_evacuated', nullable: true })
  buildingEvacuated!: YesNo | null;

  @Column({ type: 'text', name: 'fire_extinguished', nullable: true })
  fireExtinguished!: YesNo | null;

  @Column({ type: 'text', name: 'all_clear_by', nullable: true })
  allClearBy!: string | null;

  @Column({ type: 'text', name: 'all_clear_time', nullable: true })
  allClearTime!: string | null;

  @Column({ type: 'text', name: 'all_clear_ampm', nullable: true })
  allClearAmPm!: AmPm | null;

  @Column({ type: 'text', name: 'emergency_plan_executed_correctly', nullable: true })
  emergencyPlanExecutedCorrectly!: YesNo | null;

  @Column({ type: 'text', name: 'staff_carried_out_responsibilities', nullable: true })
  staffCarriedOutResponsibilities!: YesNo | null;

  @Column({ type: 'jsonb', name: 'staff_areas_checks', nullable: true })
  staffAreasChecks!:
    | {
        hearAlarm?: boolean;
        respondPromptly?: boolean;
        followAcceptedProceduresCalmly?: boolean;
        knowProperProcedures?: boolean;
        returnToStations?: boolean;
        standByUntilAllClear?: boolean;
        hearAllClear?: boolean;
      }
    | null;

  @Column({ type: 'text', name: 'comments_problems', nullable: true })
  commentsProblems!: string | null;

  @Column({ type: 'text', name: 'participants_names', nullable: true })
  participantsNames!: string | null;

  @Column({ type: 'text', name: 'report_completed_by', nullable: true })
  reportCompletedBy!: string | null;

  @Column({ type: 'text', name: 'report_completed_by_title', nullable: true })
  reportCompletedByTitle!: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
