import {
  KnowledgeEngine,
  RequirementKnowledge,
  RuleKnowledge,
} from '../interfaces/knowledge-engine.interface';

import { KnowledgeRepository } from '../repositories/knowledge-repository.interface';

import { KnowledgePack } from '../models/knowledge-pack.model';
import { RegulatorySource } from '../models/regulatory-source.model';
import { RegulatoryRule } from '../models/regulatory-rule.model';
import { RegulatoryRequirement } from '../models/regulatory-requirement.model';
import { RegulatoryQuestion } from '../models/regulatory-question.model';
import { EvidenceRequirement } from '../models/evidence-requirement.model';
import { ValidationRule } from '../models/validation-rule.model';
import { DocumentDefinition } from '../models/document-definition.model';
import { RenewalRule } from '../models/renewal-rule.model';
import { RegulatoryGuidance } from '../models/regulatory-guidance.model';

export class KnowledgeEngineService implements KnowledgeEngine {
  constructor(
    private readonly repository: KnowledgeRepository,
  ) {}

  // --------------------------------------------------------------------------
  // Knowledge Packs
  // --------------------------------------------------------------------------

  getPack(packId: string): KnowledgePack | undefined {
    return this.repository.getPack(packId);
  }

  getLoadedPackIds(): string[] {
    return this.repository.getLoadedPackIds();
  }

  // --------------------------------------------------------------------------
  // Sources
  // --------------------------------------------------------------------------

  getSource(sourceId: string): RegulatorySource | undefined {
    return this.repository.getSource(sourceId);
  }

  // --------------------------------------------------------------------------
  // Rules
  // --------------------------------------------------------------------------

  getRule(ruleId: string): RegulatoryRule | undefined {
    return this.repository.getRule(ruleId);
  }

  getRequirements(ruleId: string): RegulatoryRequirement[] {
    return this.repository.getRequirementsForRule(ruleId);
  }

  // --------------------------------------------------------------------------
  // Requirements
  // --------------------------------------------------------------------------

  getRequirement(
    requirementId: string,
  ): RegulatoryRequirement | undefined {
    return this.repository.getRequirement(requirementId);
  }

  // --------------------------------------------------------------------------
  // Questions
  // --------------------------------------------------------------------------

  getQuestions(
    requirementId: string,
  ): RegulatoryQuestion[] {
    return this.repository.getQuestionsForRequirement(
      requirementId,
    );
  }

  // --------------------------------------------------------------------------
  // Evidence
  // --------------------------------------------------------------------------

  getEvidence(
    requirementId: string,
  ): EvidenceRequirement[] {
    return this.repository.getEvidenceForRequirement(
      requirementId,
    );
  }

  // --------------------------------------------------------------------------
  // Validation
  // --------------------------------------------------------------------------

  getValidation(
    requirementId: string,
  ): ValidationRule[] {
    return this.repository.getValidationRulesForRequirement(
      requirementId,
    );
  }

  // --------------------------------------------------------------------------
  // Documents
  // --------------------------------------------------------------------------

  getGeneratedDocuments(
    requirementId: string,
  ): DocumentDefinition[] {
    return this.repository.getDocumentsForRequirement(
      requirementId,
    );
  }

  // --------------------------------------------------------------------------
  // Renewal
  // --------------------------------------------------------------------------

  getRenewal(
    requirementId: string,
  ): RenewalRule[] {
    return this.repository.getRenewalRulesForRequirement(
      requirementId,
    );
  }

  // --------------------------------------------------------------------------
  // Guidance
  // --------------------------------------------------------------------------

  getGuidance(
    requirementId: string,
  ): RegulatoryGuidance[] {
    return this.repository.getGuidanceForRequirement(
      requirementId,
    );
  }

  // --------------------------------------------------------------------------
  // Aggregate Views
  // --------------------------------------------------------------------------

  getRequirementKnowledge(
    requirementId: string,
  ): RequirementKnowledge | undefined {
    const requirement =
      this.repository.getRequirement(requirementId);

    if (!requirement) {
      return undefined;
    }

    return {
      requirement,
      questions: this.getQuestions(requirementId),
      evidenceRequirements: this.getEvidence(requirementId),
      validationRules: this.getValidation(requirementId),
      documentDefinitions:
        this.getGeneratedDocuments(requirementId),
      renewalRules: this.getRenewal(requirementId),
      guidance: this.getGuidance(requirementId),
    };
  }

  getRuleKnowledge(
    ruleId: string,
  ): RuleKnowledge | undefined {
    const rule = this.getRule(ruleId);

    if (!rule) {
      return undefined;
    }

    const requirements =
      this.getRequirements(ruleId);

    return {
      rule,
      source: this.getSource(rule.sourceId),
      requirements: requirements.map(
        (requirement): RequirementKnowledge => ({
          requirement,
          questions: this.getQuestions(requirement.id),
          evidenceRequirements: this.getEvidence(
            requirement.id,
          ),
          validationRules: this.getValidation(
            requirement.id,
          ),
          documentDefinitions:
            this.getGeneratedDocuments(
              requirement.id,
            ),
          renewalRules: this.getRenewal(
            requirement.id,
          ),
          guidance: this.getGuidance(
            requirement.id,
          ),
        }),
      ),
    };
  }
}