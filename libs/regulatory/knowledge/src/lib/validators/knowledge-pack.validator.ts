import {
  KnowledgePack,
} from '../models/knowledge-pack.model';
import { RegulatoryQuestion } from '../models/regulatory-question.model';
import { RegulatoryRequirement } from '../models/regulatory-requirement.model';
import { ValidationRule } from '../models/validation-rule.model';

export interface KnowledgePackValidationIssue {
  code: string;
  message: string;
  path: string;
  severity: 'ERROR' | 'WARNING';
}

export interface KnowledgePackValidationResult {
  valid: boolean;
  errors: KnowledgePackValidationIssue[];
  warnings: KnowledgePackValidationIssue[];
}

export class KnowledgePackValidator {
  validate(pack: KnowledgePack): KnowledgePackValidationResult {
    const issues: KnowledgePackValidationIssue[] = [];

    this.validateMetadata(pack, issues);
    this.validateUniqueIds(pack, issues);
    this.validateRules(pack, issues);
    this.validateRequirements(pack, issues);
    this.validateQuestions(pack, issues);
    this.validateEvidenceRequirements(pack, issues);
    this.validateValidationRules(pack, issues);
    this.validateDocumentDefinitions(pack, issues);
    this.validateRenewalRules(pack, issues);
    this.validateGuidance(pack, issues);

    const errors = issues.filter((issue) => issue.severity === 'ERROR');
    const warnings = issues.filter((issue) => issue.severity === 'WARNING');

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateMetadata(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    if (!this.hasValue(pack.metadata?.id)) {
      this.addError(issues, 'PACK_ID_REQUIRED', 'Pack ID is required.', 'metadata.id');
    }

    if (!this.hasValue(pack.metadata?.code)) {
      this.addError(
        issues,
        'PACK_CODE_REQUIRED',
        'Pack code is required.',
        'metadata.code',
      );
    }

    if (!this.hasValue(pack.metadata?.name)) {
      this.addError(
        issues,
        'PACK_NAME_REQUIRED',
        'Pack name is required.',
        'metadata.name',
      );
    }

    if (!this.hasValue(pack.metadata?.version)) {
      this.addError(
        issues,
        'PACK_VERSION_REQUIRED',
        'Pack version is required.',
        'metadata.version',
      );
    }

    if (!this.hasValue(pack.metadata?.jurisdiction)) {
      this.addError(
        issues,
        'PACK_JURISDICTION_REQUIRED',
        'Pack jurisdiction is required.',
        'metadata.jurisdiction',
      );
    }

    if (!this.hasValue(pack.metadata?.industry)) {
      this.addError(
        issues,
        'PACK_INDUSTRY_REQUIRED',
        'Pack industry is required.',
        'metadata.industry',
      );
    }
  }

  private validateUniqueIds(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    this.checkDuplicateIds(pack.sources, 'sources', issues);
    this.checkDuplicateIds(pack.rules, 'rules', issues);
    this.checkDuplicateIds(pack.requirements, 'requirements', issues);
    this.checkDuplicateIds(pack.questions, 'questions', issues);
    this.checkDuplicateIds(
      pack.evidenceRequirements,
      'evidenceRequirements',
      issues,
    );
    this.checkDuplicateIds(pack.validationRules, 'validationRules', issues);
    this.checkDuplicateIds(
      pack.documentDefinitions,
      'documentDefinitions',
      issues,
    );
    this.checkDuplicateIds(pack.renewalRules, 'renewalRules', issues);
    this.checkDuplicateIds(pack.guidance, 'guidance', issues);
  }

  private validateRules(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const sourceIds = new Set(pack.sources.map((source) => source.id));
    const ruleIds = new Set(pack.rules.map((rule) => rule.id));

    pack.rules.forEach((rule, index) => {
      const path = `rules[${index}]`;

      if (!this.hasValue(rule.sourceId)) {
        this.addError(
          issues,
          'RULE_SOURCE_REQUIRED',
          'Rule sourceId is required.',
          `${path}.sourceId`,
        );
      } else if (!sourceIds.has(rule.sourceId)) {
        this.addError(
          issues,
          'RULE_SOURCE_NOT_FOUND',
          `Rule references unknown source "${rule.sourceId}".`,
          `${path}.sourceId`,
        );
      }

      if (
        rule.parentRuleId &&
        !ruleIds.has(rule.parentRuleId)
      ) {
        this.addError(
          issues,
          'RULE_PARENT_NOT_FOUND',
          `Rule references unknown parent rule "${rule.parentRuleId}".`,
          `${path}.parentRuleId`,
        );
      }

      if (!this.hasValue(rule.code)) {
        this.addError(
          issues,
          'RULE_CODE_REQUIRED',
          'Rule code is required.',
          `${path}.code`,
        );
      }

      if (!this.hasValue(rule.citation)) {
        this.addError(
          issues,
          'RULE_CITATION_REQUIRED',
          'Rule citation is required.',
          `${path}.citation`,
        );
      }

      if (!this.hasValue(rule.title)) {
        this.addError(
          issues,
          'RULE_TITLE_REQUIRED',
          'Rule title is required.',
          `${path}.title`,
        );
      }
    });
  }

  private validateRequirements(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const ruleIds = new Set(pack.rules.map((rule) => rule.id));

    pack.requirements.forEach((requirement, index) => {
      const path = `requirements[${index}]`;

      if (!ruleIds.has(requirement.ruleId)) {
        this.addError(
          issues,
          'REQUIREMENT_RULE_NOT_FOUND',
          `Requirement references unknown rule "${requirement.ruleId}".`,
          `${path}.ruleId`,
        );
      }

      if (!this.hasValue(requirement.code)) {
        this.addError(
          issues,
          'REQUIREMENT_CODE_REQUIRED',
          'Requirement code is required.',
          `${path}.code`,
        );
      }

      if (!this.hasValue(requirement.title)) {
        this.addError(
          issues,
          'REQUIREMENT_TITLE_REQUIRED',
          'Requirement title is required.',
          `${path}.title`,
        );
      }

      if (!this.hasValue(requirement.description)) {
        this.addError(
          issues,
          'REQUIREMENT_DESCRIPTION_REQUIRED',
          'Requirement description is required.',
          `${path}.description`,
        );
      }

      if (!requirement.domains?.length) {
        this.addError(
          issues,
          'REQUIREMENT_DOMAIN_REQUIRED',
          'Requirement must apply to at least one provider domain.',
          `${path}.domains`,
        );
      }

      if (
        requirement.frequency === 'CUSTOM' &&
        !this.isPositiveNumber(requirement.customFrequencyDays)
      ) {
        this.addError(
          issues,
          'CUSTOM_FREQUENCY_DAYS_REQUIRED',
          'Custom frequency requires customFrequencyDays greater than zero.',
          `${path}.customFrequencyDays`,
        );
      }
    });
  }

  private validateQuestions(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const requirementsById = new Map<string, RegulatoryRequirement>(
      pack.requirements.map((requirement) => [requirement.id, requirement]),
    );

    const keysByRequirement = new Map<string, Set<string>>();

    pack.questions.forEach((question, index) => {
      const path = `questions[${index}]`;

      if (!requirementsById.has(question.requirementId)) {
        this.addError(
          issues,
          'QUESTION_REQUIREMENT_NOT_FOUND',
          `Question references unknown requirement "${question.requirementId}".`,
          `${path}.requirementId`,
        );
      }

      if (!this.hasValue(question.key)) {
        this.addError(
          issues,
          'QUESTION_KEY_REQUIRED',
          'Question key is required.',
          `${path}.key`,
        );
      }

      if (!this.hasValue(question.label)) {
        this.addError(
          issues,
          'QUESTION_LABEL_REQUIRED',
          'Question label is required.',
          `${path}.label`,
        );
      }

      if (!Number.isInteger(question.displayOrder) || question.displayOrder < 0) {
        this.addError(
          issues,
          'QUESTION_DISPLAY_ORDER_INVALID',
          'Question displayOrder must be a non-negative integer.',
          `${path}.displayOrder`,
        );
      }

      this.validateQuestionOptions(question, path, issues);

      const existingKeys =
        keysByRequirement.get(question.requirementId) ?? new Set<string>();

      if (existingKeys.has(question.key)) {
        this.addError(
          issues,
          'QUESTION_KEY_DUPLICATE',
          `Question key "${question.key}" is duplicated within requirement "${question.requirementId}".`,
          `${path}.key`,
        );
      }

      existingKeys.add(question.key);
      keysByRequirement.set(question.requirementId, existingKeys);
    });
  }

  private validateQuestionOptions(
    question: RegulatoryQuestion,
    path: string,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const optionRequired =
      question.inputType === 'SINGLE_SELECT' ||
      question.inputType === 'MULTI_SELECT';

    if (optionRequired && !question.options?.length) {
      this.addError(
        issues,
        'QUESTION_OPTIONS_REQUIRED',
        `${question.inputType} questions require at least one option.`,
        `${path}.options`,
      );
    }

    const optionValues = new Set<string>();

    question.options?.forEach((option, optionIndex) => {
      const optionPath = `${path}.options[${optionIndex}]`;

      if (!this.hasValue(option.label)) {
        this.addError(
          issues,
          'QUESTION_OPTION_LABEL_REQUIRED',
          'Question option label is required.',
          `${optionPath}.label`,
        );
      }

      if (!this.hasValue(option.value)) {
        this.addError(
          issues,
          'QUESTION_OPTION_VALUE_REQUIRED',
          'Question option value is required.',
          `${optionPath}.value`,
        );
      } else if (optionValues.has(option.value)) {
        this.addError(
          issues,
          'QUESTION_OPTION_VALUE_DUPLICATE',
          `Question option value "${option.value}" is duplicated.`,
          `${optionPath}.value`,
        );
      }

      optionValues.add(option.value);
    });
  }

  private validateEvidenceRequirements(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const requirementIds = new Set(
      pack.requirements.map((requirement) => requirement.id),
    );

    pack.evidenceRequirements.forEach((evidence, index) => {
      const path = `evidenceRequirements[${index}]`;

      if (!requirementIds.has(evidence.requirementId)) {
        this.addError(
          issues,
          'EVIDENCE_REQUIREMENT_NOT_FOUND',
          `Evidence references unknown requirement "${evidence.requirementId}".`,
          `${path}.requirementId`,
        );
      }

      if (!this.hasValue(evidence.code)) {
        this.addError(
          issues,
          'EVIDENCE_CODE_REQUIRED',
          'Evidence code is required.',
          `${path}.code`,
        );
      }

      if (!this.hasValue(evidence.title)) {
        this.addError(
          issues,
          'EVIDENCE_TITLE_REQUIRED',
          'Evidence title is required.',
          `${path}.title`,
        );
      }

      if (
        evidence.minimumCount !== undefined &&
        evidence.minimumCount < 0
      ) {
        this.addError(
          issues,
          'EVIDENCE_MINIMUM_COUNT_INVALID',
          'Evidence minimumCount cannot be negative.',
          `${path}.minimumCount`,
        );
      }
    });
  }

  private validateValidationRules(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const requirementsById = new Map<string, RegulatoryRequirement>(
      pack.requirements.map((requirement) => [requirement.id, requirement]),
    );

    pack.validationRules.forEach((rule, index) => {
      const path = `validationRules[${index}]`;

      if (!requirementsById.has(rule.requirementId)) {
        this.addError(
          issues,
          'VALIDATION_REQUIREMENT_NOT_FOUND',
          `Validation rule references unknown requirement "${rule.requirementId}".`,
          `${path}.requirementId`,
        );
      }

      if (!this.hasValue(rule.code)) {
        this.addError(
          issues,
          'VALIDATION_CODE_REQUIRED',
          'Validation rule code is required.',
          `${path}.code`,
        );
      }

      if (!this.hasValue(rule.targetPath)) {
        this.addError(
          issues,
          'VALIDATION_TARGET_REQUIRED',
          'Validation rule targetPath is required.',
          `${path}.targetPath`,
        );
      }

      if (!this.hasValue(rule.errorMessage)) {
        this.addError(
          issues,
          'VALIDATION_MESSAGE_REQUIRED',
          'Validation rule errorMessage is required.',
          `${path}.errorMessage`,
        );
      }

      this.validateRuleConfiguration(rule, path, issues);
    });
  }

  private validateRuleConfiguration(
    rule: ValidationRule,
    path: string,
    issues: KnowledgePackValidationIssue[],
  ): void {
    if (
      rule.ruleType === 'MIN_VALUE' &&
      rule.minValue === undefined
    ) {
      this.addError(
        issues,
        'VALIDATION_MIN_VALUE_REQUIRED',
        'MIN_VALUE validation requires minValue.',
        `${path}.minValue`,
      );
    }

    if (
      rule.ruleType === 'MAX_VALUE' &&
      rule.maxValue === undefined
    ) {
      this.addError(
        issues,
        'VALIDATION_MAX_VALUE_REQUIRED',
        'MAX_VALUE validation requires maxValue.',
        `${path}.maxValue`,
      );
    }

    if (
      rule.ruleType === 'PATTERN' &&
      !this.hasValue(rule.pattern)
    ) {
      this.addError(
        issues,
        'VALIDATION_PATTERN_REQUIRED',
        'PATTERN validation requires pattern.',
        `${path}.pattern`,
      );
    }

    if (
      rule.ruleType === 'RELATIONSHIP' &&
      !this.hasValue(rule.relatedPath)
    ) {
      this.addError(
        issues,
        'VALIDATION_RELATED_PATH_REQUIRED',
        'RELATIONSHIP validation requires relatedPath.',
        `${path}.relatedPath`,
      );
    }

    if (
      rule.ruleType === 'CUSTOM' &&
      !this.hasValue(rule.customValidatorKey)
    ) {
      this.addError(
        issues,
        'CUSTOM_VALIDATOR_KEY_REQUIRED',
        'CUSTOM validation requires customValidatorKey.',
        `${path}.customValidatorKey`,
      );
    }
  }

  private validateDocumentDefinitions(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const requirementIds = new Set(
      pack.requirements.map((requirement) => requirement.id),
    );

    pack.documentDefinitions.forEach((document, index) => {
      const path = `documentDefinitions[${index}]`;

      if (!this.hasValue(document.code)) {
        this.addError(
          issues,
          'DOCUMENT_CODE_REQUIRED',
          'Document code is required.',
          `${path}.code`,
        );
      }

      if (!this.hasValue(document.title)) {
        this.addError(
          issues,
          'DOCUMENT_TITLE_REQUIRED',
          'Document title is required.',
          `${path}.title`,
        );
      }

      if (!this.hasValue(document.templateKey)) {
        this.addError(
          issues,
          'DOCUMENT_TEMPLATE_KEY_REQUIRED',
          'Document templateKey is required.',
          `${path}.templateKey`,
        );
      }

      if (!document.requirementIds?.length) {
        this.addError(
          issues,
          'DOCUMENT_REQUIREMENT_REQUIRED',
          'Document must reference at least one requirement.',
          `${path}.requirementIds`,
        );
      }

      document.requirementIds?.forEach((requirementId, requirementIndex) => {
        if (!requirementIds.has(requirementId)) {
          this.addError(
            issues,
            'DOCUMENT_REQUIREMENT_NOT_FOUND',
            `Document references unknown requirement "${requirementId}".`,
            `${path}.requirementIds[${requirementIndex}]`,
          );
        }
      });

      if (!document.outputFormats?.length) {
        this.addError(
          issues,
          'DOCUMENT_OUTPUT_FORMAT_REQUIRED',
          'Document must define at least one output format.',
          `${path}.outputFormats`,
        );
      }

      if (document.publishToBinder && !this.hasValue(document.binderSectionKey)) {
        this.addWarning(
          issues,
          'DOCUMENT_BINDER_SECTION_MISSING',
          'Document publishes to a binder but has no binderSectionKey.',
          `${path}.binderSectionKey`,
        );
      }
    });
  }

  private validateRenewalRules(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const requirementIds = new Set(
      pack.requirements.map((requirement) => requirement.id),
    );

    pack.renewalRules.forEach((renewal, index) => {
      const path = `renewalRules[${index}]`;

      if (!requirementIds.has(renewal.requirementId)) {
        this.addError(
          issues,
          'RENEWAL_REQUIREMENT_NOT_FOUND',
          `Renewal rule references unknown requirement "${renewal.requirementId}".`,
          `${path}.requirementId`,
        );
      }

      if (!Number.isInteger(renewal.interval) || renewal.interval <= 0) {
        this.addError(
          issues,
          'RENEWAL_INTERVAL_INVALID',
          'Renewal interval must be a positive integer.',
          `${path}.interval`,
        );
      }

      renewal.reminderDaysBefore.forEach((days, reminderIndex) => {
        if (!Number.isInteger(days) || days < 0) {
          this.addError(
            issues,
            'RENEWAL_REMINDER_INVALID',
            'Renewal reminder days must be non-negative integers.',
            `${path}.reminderDaysBefore[${reminderIndex}]`,
          );
        }
      });
    });
  }

  private validateGuidance(
    pack: KnowledgePack,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const requirementIds = new Set(
      pack.requirements.map((requirement) => requirement.id),
    );

    pack.guidance.forEach((guidance, index) => {
      const path = `guidance[${index}]`;

      if (!requirementIds.has(guidance.requirementId)) {
        this.addError(
          issues,
          'GUIDANCE_REQUIREMENT_NOT_FOUND',
          `Guidance references unknown requirement "${guidance.requirementId}".`,
          `${path}.requirementId`,
        );
      }

      if (!this.hasValue(guidance.summary)) {
        this.addError(
          issues,
          'GUIDANCE_SUMMARY_REQUIRED',
          'Guidance summary is required.',
          `${path}.summary`,
        );
      }
    });
  }

  private checkDuplicateIds(
    items: Array<{ id: string }>,
    collectionName: string,
    issues: KnowledgePackValidationIssue[],
  ): void {
    const ids = new Set<string>();

    items.forEach((item, index) => {
      if (!this.hasValue(item.id)) {
        this.addError(
          issues,
          'ID_REQUIRED',
          `${collectionName} item ID is required.`,
          `${collectionName}[${index}].id`,
        );

        return;
      }

      if (ids.has(item.id)) {
        this.addError(
          issues,
          'DUPLICATE_ID',
          `Duplicate ID "${item.id}" found in ${collectionName}.`,
          `${collectionName}[${index}].id`,
        );
      }

      ids.add(item.id);
    });
  }

  private addError(
    issues: KnowledgePackValidationIssue[],
    code: string,
    message: string,
    path: string,
  ): void {
    issues.push({
      code,
      message,
      path,
      severity: 'ERROR',
    });
  }

  private addWarning(
    issues: KnowledgePackValidationIssue[],
    code: string,
    message: string,
    path: string,
  ): void {
    issues.push({
      code,
      message,
      path,
      severity: 'WARNING',
    });
  }

  private hasValue(value: unknown): boolean {
    return String(value ?? '').trim().length > 0;
  }

  private isPositiveNumber(value: number | undefined): boolean {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
  }
}