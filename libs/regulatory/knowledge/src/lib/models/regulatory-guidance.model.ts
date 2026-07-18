export interface RegulatoryGuidance {
  id: string;
  requirementId: string;

  summary: string;
  rationale?: string;
  implementationGuidance?: string;
  commonErrors?: string[];
  bestPractices?: string[];
  examples?: string[];

  providerFacingExplanation?: string;
  staffFacingExplanation?: string;
  executiveExplanation?: string;

  createdAt?: string;
  updatedAt?: string;
}