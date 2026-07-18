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

export interface KnowledgeRepository {
  register(pack: KnowledgePack): void;
  unregister(packId: string): void;
  clear(): void;

  hasPack(packId: string): boolean;
  getPack(packId: string): KnowledgePack | undefined;
  getAllPacks(): KnowledgePack[];
  getLoadedPackIds(): string[];

  getSource(sourceId: string): RegulatorySource | undefined;
  getRule(ruleId: string): RegulatoryRule | undefined;
  getRequirement(
    requirementId: string,
  ): RegulatoryRequirement | undefined;
  getQuestion(questionId: string): RegulatoryQuestion | undefined;

  getEvidenceRequirement(
    evidenceRequirementId: string,
  ): EvidenceRequirement | undefined;

  getValidationRule(
    validationRuleId: string,
  ): ValidationRule | undefined;

  getDocumentDefinition(
    documentDefinitionId: string,
  ): DocumentDefinition | undefined;

  getRenewalRule(
    renewalRuleId: string,
  ): RenewalRule | undefined;

  getGuidance(
    guidanceId: string,
  ): RegulatoryGuidance | undefined;

  getRequirementsForRule(
    ruleId: string,
  ): RegulatoryRequirement[];

  getQuestionsForRequirement(
    requirementId: string,
  ): RegulatoryQuestion[];

  getEvidenceForRequirement(
    requirementId: string,
  ): EvidenceRequirement[];

  getValidationRulesForRequirement(
    requirementId: string,
  ): ValidationRule[];

  getDocumentsForRequirement(
    requirementId: string,
  ): DocumentDefinition[];

  getRenewalRulesForRequirement(
    requirementId: string,
  ): RenewalRule[];

  getGuidanceForRequirement(
    requirementId: string,
  ): RegulatoryGuidance[];
}