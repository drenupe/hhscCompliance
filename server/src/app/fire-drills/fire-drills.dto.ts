import { DrillShift, DrillType } from './fire-drill.entity';

export type CreateFireDrillInput = {
  providerId?: string;
  locationId: string;

  drillDate: string; // YYYY-MM-DD
  shift: DrillShift;
  drillType: DrillType;

  evacuationTimeSeconds?: number | null;
  staffPresent?: any[] | null;
  consumersPresent?: any[] | null;

  issuesNoted?: string | null;
  correctiveAction?: string | null;

  conductedBy?: string | null;
  reviewedBy?: string | null;
};

export type UpdateFireDrillInput = Partial<CreateFireDrillInput>;
