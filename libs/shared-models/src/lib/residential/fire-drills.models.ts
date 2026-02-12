export type FireDrillOutcome = 'SUCCESS' | 'ISSUES';

export type FireDrillLogDto = {
  id: string;
  locationId: string;
  occurredAt: string; // ISO
  sleepingHours: boolean;
  staffPresent: string; // free text for now
  evacuationTimeSec?: number | null;
  outcome: FireDrillOutcome;
  issues?: string | null;
  correctiveAction?: string | null;
  createdAt: string; // ISO
};

export type CreateFireDrillLogInput = {
  locationId: string;
  occurredAt: string; // ISO
  sleepingHours: boolean;
  staffPresent: string;
  evacuationTimeSec?: number | null;
  outcome: FireDrillOutcome;
  issues?: string | null;
  correctiveAction?: string | null;
};

export type UpdateFireDrillLogInput = Partial<Omit<CreateFireDrillLogInput, 'locationId'>>;

export type FireDrillsListParams = {
  locationId?: string;
  from?: string; // ISO optional
  to?: string;   // ISO optional
};
