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
import { KnowledgeRepository } from './knowledge-repository.interface';

export class MemoryKnowledgeRepository implements KnowledgeRepository {
  private readonly packs = new Map<string, KnowledgePack>();
  private readonly sources = new Map<string, RegulatorySource>();
  private readonly rules = new Map<string, RegulatoryRule>();
  private readonly requirements = new Map<string, RegulatoryRequirement>();
  private readonly questions = new Map<string, RegulatoryQuestion>();
  private readonly evidenceRequirements = new Map<
    string,
    EvidenceRequirement
  >();
  private readonly validationRules = new Map<string, ValidationRule>();
  private readonly documentDefinitions = new Map<
    string,
    DocumentDefinition
  >();
  private readonly renewalRules = new Map<string, RenewalRule>();
  private readonly guidance = new Map<string, RegulatoryGuidance>();

  register(pack: KnowledgePack): void {
    this.unregister(pack.metadata.id);

    this.packs.set(pack.metadata.id, pack);

    pack.sources.forEach((item) => this.sources.set(item.id, item));
    pack.rules.forEach((item) => this.rules.set(item.id, item));
    pack.requirements.forEach((item) =>
      this.requirements.set(item.id, item),
    );
    pack.questions.forEach((item) =>
      this.questions.set(item.id, item),
    );
    pack.evidenceRequirements.forEach((item) =>
      this.evidenceRequirements.set(item.id, item),
    );
    pack.validationRules.forEach((item) =>
      this.validationRules.set(item.id, item),
    );
    pack.documentDefinitions.forEach((item) =>
      this.documentDefinitions.set(item.id, item),
    );
    pack.renewalRules.forEach((item) =>
      this.renewalRules.set(item.id, item),
    );
    pack.guidance.forEach((item) =>
      this.guidance.set(item.id, item),
    );
  }

  unregister(packId: string): void {
    const pack = this.packs.get(packId);

    if (!pack) {
      return;
    }

    pack.sources.forEach((item) => this.sources.delete(item.id));
    pack.rules.forEach((item) => this.rules.delete(item.id));
    pack.requirements.forEach((item) =>
      this.requirements.delete(item.id),
    );
    pack.questions.forEach((item) =>
      this.questions.delete(item.id),
    );
    pack.evidenceRequirements.forEach((item) =>
      this.evidenceRequirements.delete(item.id),
    );
    pack.validationRules.forEach((item) =>
      this.validationRules.delete(item.id),
    );
    pack.documentDefinitions.forEach((item) =>
      this.documentDefinitions.delete(item.id),
    );
    pack.renewalRules.forEach((item) =>
      this.renewalRules.delete(item.id),
    );
    pack.guidance.forEach((item) =>
      this.guidance.delete(item.id),
    );

    this.packs.delete(packId);
  }

  clear(): void {
    this.packs.clear();
    this.sources.clear();
    this.rules.clear();
    this.requirements.clear();
    this.questions.clear();
    this.evidenceRequirements.clear();
    this.validationRules.clear();
    this.documentDefinitions.clear();
    this.renewalRules.clear();
    this.guidance.clear();
  }

  hasPack(packId: string): boolean {
    return this.packs.has(packId);
  }

  getPack(packId: string): KnowledgePack | undefined {
    return this.packs.get(packId);
  }

  getAllPacks(): KnowledgePack[] {
    return Array.from(this.packs.values());
  }

  getLoadedPackIds(): string[] {
    return Array.from(this.packs.keys());
  }

  getSource(sourceId: string): RegulatorySource | undefined {
    return this.sources.get(sourceId);
  }

  getRule(ruleId: string): RegulatoryRule | undefined {
    return this.rules.get(ruleId);
  }

  getRequirement(
    requirementId: string,
  ): RegulatoryRequirement | undefined {
    return this.requirements.get(requirementId);
  }

  getQuestion(
    questionId: string,
  ): RegulatoryQuestion | undefined {
    return this.questions.get(questionId);
  }

  getEvidenceRequirement(
    evidenceRequirementId: string,
  ): EvidenceRequirement | undefined {
    return this.evidenceRequirements.get(evidenceRequirementId);
  }

  getValidationRule(
    validationRuleId: string,
  ): ValidationRule | undefined {
    return this.validationRules.get(validationRuleId);
  }

  getDocumentDefinition(
    documentDefinitionId: string,
  ): DocumentDefinition | undefined {
    return this.documentDefinitions.get(documentDefinitionId);
  }

  getRenewalRule(
    renewalRuleId: string,
  ): RenewalRule | undefined {
    return this.renewalRules.get(renewalRuleId);
  }

  getGuidance(
    guidanceId: string,
  ): RegulatoryGuidance | undefined {
    return this.guidance.get(guidanceId);
  }

  getRequirementsForRule(
    ruleId: string,
  ): RegulatoryRequirement[] {
    return Array.from(this.requirements.values()).filter(
      (requirement) => requirement.ruleId === ruleId,
    );
  }

  getQuestionsForRequirement(
    requirementId: string,
  ): RegulatoryQuestion[] {
    return Array.from(this.questions.values())
      .filter(
        (question) =>
          question.requirementId === requirementId,
      )
      .sort(
        (left, right) =>
          left.displayOrder - right.displayOrder,
      );
  }

  getEvidenceForRequirement(
    requirementId: string,
  ): EvidenceRequirement[] {
    return Array.from(
      this.evidenceRequirements.values(),
    ).filter(
      (evidence) =>
        evidence.requirementId === requirementId,
    );
  }

  getValidationRulesForRequirement(
    requirementId: string,
  ): ValidationRule[] {
    return Array.from(this.validationRules.values())
      .filter(
        (rule) =>
          rule.requirementId === requirementId,
      )
      .sort(
        (left, right) =>
          (left.displayOrder ?? 0) -
          (right.displayOrder ?? 0),
      );
  }

  getDocumentsForRequirement(
    requirementId: string,
  ): DocumentDefinition[] {
    return Array.from(
      this.documentDefinitions.values(),
    ).filter((document) =>
      document.requirementIds.includes(requirementId),
    );
  }

  getRenewalRulesForRequirement(
    requirementId: string,
  ): RenewalRule[] {
    return Array.from(this.renewalRules.values()).filter(
      (rule) =>
        rule.requirementId === requirementId,
    );
  }

  getGuidanceForRequirement(
    requirementId: string,
  ): RegulatoryGuidance[] {
    return Array.from(this.guidance.values()).filter(
      (item) =>
        item.requirementId === requirementId,
    );
  }
}