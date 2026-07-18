import {
  EvidenceType,
  RequirementFrequency,
} from '../enums/regulatory.enums';

export interface EvidenceRequirement {
  id: string;
  requirementId: string;

  code: string;
  title: string;
  description?: string;

  evidenceType: EvidenceType;
  required: boolean;

  frequency?: RequirementFrequency;
  customFrequencyDays?: number;

  acceptedMimeTypes?: string[];
  minimumCount?: number;
  maximumAgeDays?: number;

  requiresApproval?: boolean;
  requiresSignature?: boolean;
  requiresExpirationDate?: boolean;

  binderSectionKey?: string;
  tags?: string[];

  createdAt?: string;
  updatedAt?: string;
}