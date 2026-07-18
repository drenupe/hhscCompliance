import { DocumentDefinition } from './document-definition.model';
import { EvidenceRequirement } from './evidence-requirement.model';
import { RegulatoryGuidance } from './regulatory-guidance.model';
import { RegulatoryQuestion } from './regulatory-question.model';
import { RegulatoryRequirement } from './regulatory-requirement.model';
import { RegulatoryRule } from './regulatory-rule.model';
import { RegulatorySource } from './regulatory-source.model';
import { RenewalRule } from './renewal-rule.model';
import { ValidationRule } from './validation-rule.model';

export interface KnowledgePackMetadata {
  id: string;
  code: string;
  name: string;
  description?: string;

  jurisdiction: string;
  industry: string;
  program?: string;

  version: string;
  effectiveDate?: string;
  publishedAt?: string;

  tags?: string[];
}

export interface KnowledgePack {
  metadata: KnowledgePackMetadata;

  sources: RegulatorySource[];
  rules: RegulatoryRule[];
  requirements: RegulatoryRequirement[];
  questions: RegulatoryQuestion[];
  evidenceRequirements: EvidenceRequirement[];
  validationRules: ValidationRule[];
  documentDefinitions: DocumentDefinition[];
  renewalRules: RenewalRule[];
  guidance: RegulatoryGuidance[];
}