import {
  RenewalUnit,
} from '../enums/regulatory.enums';

export interface RenewalRule {
  id: string;
  requirementId: string;

  interval: number;
  unit: RenewalUnit;

  reminderDaysBefore: number[];
  autoCreateDraft: boolean;
  carryForwardKnownValues: boolean;
  requireChangeConfirmation: boolean;

  ownerRole?: string;
  escalationRole?: string;

  enabled: boolean;

  createdAt?: string;
  updatedAt?: string;
}