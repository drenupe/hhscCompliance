export type DrillShift = 'DAY' | 'EVENING' | 'NIGHT';
export type DrillType = 'FIRE' | 'SEVERE_WEATHER' | 'OTHER';

export interface FireDrillDto {
  id: string;
  providerId: string;
  locationId: string;

  drillDate: string; // YYYY-MM-DD
  shift: DrillShift;
  drillType: DrillType;

  evacuationTimeSeconds: number | null;

  issuesNoted: string | null;
  correctiveAction: string | null;

  conductedBy: string | null;
  reviewedBy: string | null;

  createdAt: string;
  updatedAt: string;
}

export type CreateFireDrillInput = {
  providerId?: string;
  locationId: string;

  drillDate: string;
  shift: DrillShift;
  drillType: DrillType;

  evacuationTimeSeconds?: number | null;

  issuesNoted?: string | null;
  correctiveAction?: string | null;

  conductedBy?: string | null;
  reviewedBy?: string | null;
};

export type UpdateFireDrillInput = Partial<CreateFireDrillInput>;
