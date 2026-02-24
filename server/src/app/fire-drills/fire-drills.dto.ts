import { DrillShift } from './fire-drill.entity';

export type CreateFireDrillInput = {
  providerId?: string;
  locationId: string;

  dateDrillConducted: string;       // YYYY-MM-DD
  timeDrillConducted?: string | null; // "HH:MM" or null
  shift: DrillShift;

  simulatedSituations?: string[] | null;
  simulatedOtherText?: string | null;

  locations?: string[] | null;
  locationOtherText?: string | null;

  fireTypes?: string[] | null;
  fireTypeOtherText?: string | null;

  extentOfFire?: string[] | null;
  extentOfFireOtherText?: string | null;

  extentOfSmoke?: string[] | null;
  extentOfSmokeOtherText?: string | null;

  exitsUsed?: string[] | null;
  exitOtherText?: string | null;

  rallyPoint?: string | null;

  staffUsedProperJudgment?: 'YES' | 'NO' | null;
  actionsTaken?: string | null;

  fireDepartmentCalled?: 'YES' | 'NO' | null;
  fireDepartmentCalledTime?: string | null;
  fireDepartmentCalledAmPm?: 'AM' | 'PM' | null;

  residentsRemovedToSafety?: 'YES' | 'NO' | null;
  egressClear?: 'YES' | 'NO' | null;
  corridorDoorsClosed?: 'YES' | 'NO' | null;

  whoRespondedAndEquipment?: string | null;

  staffMonitoredExits?: 'YES' | 'NO' | null;
  buildingEvacuated?: 'YES' | 'NO' | null;
  fireExtinguished?: 'YES' | 'NO' | null;

  allClearBy?: string | null;
  allClearTime?: string | null;
  allClearAmPm?: 'AM' | 'PM' | null;

  emergencyPlanExecutedCorrectly?: 'YES' | 'NO' | null;
  staffCarriedOutResponsibilities?: 'YES' | 'NO' | null;

  staffAreasChecks?: {
    hearAlarm?: boolean;
    respondPromptly?: boolean;
    followAcceptedProceduresCalmly?: boolean;
    knowProperProcedures?: boolean;
    returnToStations?: boolean;
    standByUntilAllClear?: boolean;
    hearAllClear?: boolean;
  } | null;

  commentsProblems?: string | null;
  participantsNames?: string | null;

  reportCompletedBy?: string | null;
  reportCompletedByTitle?: string | null;
};

export type UpdateFireDrillInput = Partial<CreateFireDrillInput>;
