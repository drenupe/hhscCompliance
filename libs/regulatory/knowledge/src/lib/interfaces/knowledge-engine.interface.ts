import { DocumentDefinition } from '../models/document-definition.model';
import { EvidenceRequirement } from '../models/evidence-requirement.model';
import { KnowledgePack } from '../models/knowledge-pack.model';
import { RegulatoryGuidance } from '../models/regulatory-guidance.model';
import { RegulatoryQuestion } from '../models/regulatory-question.model';
import { RegulatoryRequirement } from '../models/regulatory-requirement.model';
import { RegulatoryRule } from '../models/regulatory-rule.model';
import { RegulatorySource } from '../models/regulatory-source.model';
import { RenewalRule } from '../models/renewal-rule.model';
import { ValidationRule } from '../models/validation-rule.model';

export interface RequirementKnowledge {
  requirement: RegulatoryRequirement;

  questions: RegulatoryQuestion[];

  evidenceRequirements: EvidenceRequirement[];

  validationRules: ValidationRule[];

  documentDefinitions: DocumentDefinition[];

  renewalRules: RenewalRule[];

  guidance: RegulatoryGuidance[];
}

export interface RuleKnowledge {
  rule: RegulatoryRule;

  source?: RegulatorySource;

  requirements: RequirementKnowledge[];
}

export interface KnowledgeEngine {
  // Knowledge Packs
  getPack(
    packId: string,
  ): KnowledgePack | undefined;

  getLoadedPackIds(): string[];

  // Sources
  getSource(
    sourceId: string,
  ): RegulatorySource | undefined;

  // Rules
  getRule(
    ruleId: string,
  ): RegulatoryRule | undefined;

  getRequirements(
    ruleId: string,
  ): RegulatoryRequirement[];

  // Requirements
  getRequirement(
    requirementId: string,
  ): RegulatoryRequirement | undefined;

  // Questions
  getQuestions(
    requirementId: string,
  ): RegulatoryQuestion[];

  // Evidence
  getEvidence(
    requirementId: string,
  ): EvidenceRequirement[];

  // Validation
  getValidation(
    requirementId: string,
  ): ValidationRule[];

  // Documents
  getGeneratedDocuments(
    requirementId: string,
  ): DocumentDefinition[];

  // Renewals
  getRenewal(
    requirementId: string,
  ): RenewalRule[];

  // Guidance
  getGuidance(
    requirementId: string,
  ): RegulatoryGuidance[];

  // Aggregates
  getRequirementKnowledge(
    requirementId: string,
  ): RequirementKnowledge | undefined;

  getRuleKnowledge(
    ruleId: string,
  ): RuleKnowledge | undefined;
}