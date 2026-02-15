export type YesNo = 'YES' | 'NO';
export type AmPm = 'AM' | 'PM';

export type SimulatedSituation = 'FIRE' | 'SMOKE' | 'OTHER';
export type DrillLocation = 'KITCHEN' | 'DINING' | 'LOBBY' | 'OFFICE' | 'BEDROOM' | 'OTHER';
export type FireType = 'BED' | 'WASTEBASKET' | 'KITCHEN_RANGE' | 'LAUNDRY' | 'OTHER';

export type ExtentOfFire =
  | 'LARGE'
  | 'SMALL'
  | 'EXPLOSION'
  | 'ELECTRICAL'
  | 'PAPER'
  | 'WOOD'
  | 'CONTROLLABLE'
  | 'OTHER';

export type ExtentOfSmoke =
  | 'NOXIOUS'
  | 'WHOLE_ROOM'
  | 'CORRIDOR'
  | 'HEAVY'
  | 'LIGHT'
  | 'SMOLDERING'
  | 'OTHER';

export type ExitUsed =
  | 'FRONT_DOOR'
  | 'BACK_DOOR'
  | 'SIDE_DOOR'
  | 'GARAGE_DOOR'
  | 'WINDOW'
  | 'OTHER';

export type DrillShift = 'DAY' | 'EVENING' | 'NIGHT';

export interface FireDrillDto {
  id: string;
  providerId: string;
  locationId: string;

  // Header (Report Completed By block includes these)
  dateDrillConducted: string; // YYYY-MM-DD
  timeDrillConducted: string | null; // "HH:MM" (24h) or null
  shift: DrillShift;

  // Before drill
  simulatedSituations: SimulatedSituation[];
  simulatedOtherText: string | null;

  locations: DrillLocation[];
  locationOtherText: string | null;

  fireTypes: FireType[];
  fireTypeOtherText: string | null;

  extentOfFire: ExtentOfFire[];
  extentOfFireOtherText: string | null;

  extentOfSmoke: ExtentOfSmoke[];
  extentOfSmokeOtherText: string | null;

  exitsUsed: ExitUsed[];
  exitOtherText: string | null;

  rallyPoint: string | null;

  // After drill
  staffUsedProperJudgment: YesNo | null;
  actionsTaken: string | null;

  fireDepartmentCalled: YesNo | null;
  fireDepartmentCalledTime: string | null; // "HH:MM"
  fireDepartmentCalledAmPm: AmPm | null;

  residentsRemovedToSafety: YesNo | null;
  egressClear: YesNo | null;
  corridorDoorsClosed: YesNo | null;

  whoRespondedAndEquipment: string | null;

  staffMonitoredExits: YesNo | null;
  buildingEvacuated: YesNo | null;
  fireExtinguished: YesNo | null;

  allClearBy: string | null;
  allClearTime: string | null; // "HH:MM"
  allClearAmPm: AmPm | null;

  emergencyPlanExecutedCorrectly: YesNo | null;
  staffCarriedOutResponsibilities: YesNo | null;

  // Q15 checkboxes (Form 4719)
  staffAreasChecks: {
    hearAlarm: boolean;
    respondPromptly: boolean;
    followAcceptedProceduresCalmly: boolean; // "calmly, smoothly and efficiently"
    knowProperProcedures: boolean;           // "seem to know their proper procedures"
    returnToStations: boolean;
    standByUntilAllClear: boolean;
    hearAllClear: boolean;
  };

  commentsProblems: string | null;
  participantsNames: string | null;

  reportCompletedBy: string | null;
  reportCompletedByTitle: string | null;

  createdAt: string;
  updatedAt: string;
}

export type CreateFireDrillInput = Omit<
  FireDrillDto,
  'id' | 'providerId' | 'createdAt' | 'updatedAt'
> & { providerId?: string };

export type UpdateFireDrillInput = Partial<CreateFireDrillInput>;

export type FireDrillForm4719 = Omit<CreateFireDrillInput, 'providerId'>;

export const FIRE_DRILL_4719_DEFAULTS: FireDrillForm4719 = {
  locationId: '',
  dateDrillConducted: '',
  timeDrillConducted: null,
  shift: 'DAY',

  simulatedSituations: [],
  simulatedOtherText: null,

  locations: [],
  locationOtherText: null,

  fireTypes: [],
  fireTypeOtherText: null,

  extentOfFire: [],
  extentOfFireOtherText: null,

  extentOfSmoke: [],
  extentOfSmokeOtherText: null,

  exitsUsed: [],
  exitOtherText: null,

  rallyPoint: null,

  staffUsedProperJudgment: null,
  actionsTaken: null,

  fireDepartmentCalled: null,
  fireDepartmentCalledTime: null,
  fireDepartmentCalledAmPm: null,

  residentsRemovedToSafety: null,
  egressClear: null,
  corridorDoorsClosed: null,

  whoRespondedAndEquipment: null,

  staffMonitoredExits: null,
  buildingEvacuated: null,
  fireExtinguished: null,

  allClearBy: null,
  allClearTime: null,
  allClearAmPm: null,

  emergencyPlanExecutedCorrectly: null,
  staffCarriedOutResponsibilities: null,

  staffAreasChecks: {
    hearAlarm: false,
    respondPromptly: false,
    followAcceptedProceduresCalmly: false,
    knowProperProcedures: false,
    returnToStations: false,
    standByUntilAllClear: false,
    hearAllClear: false,
  },

  commentsProblems: null,
  participantsNames: null,

  reportCompletedBy: null,
  reportCompletedByTitle: null,
};
