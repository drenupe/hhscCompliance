import { KnowledgePack } from '../../models/knowledge-pack.model';
import {
  texasHcsEmergencyPreparednessBundle,
  texasHcsEmergencyPreparednessEvidenceRequirements,
  texasHcsEmergencyPreparednessQuestions,
  texasHcsEmergencyPreparednessRule,
  texasHcsEmergencyPreparednessSource,
  texasHcsEmergencyPreparednessValidationRules,
  texasHcsEmergencyPlanDocumentDefinition,
  texasHcsEmergencyPlanGuidance,
  texasHcsEmergencyPlanRenewalRule,
  texasHcsEmergencyPlanRequirement,
} from './rules/emergency-preparedness.rule';

export const TEXAS_HCS_KNOWLEDGE_PACK_ID = 'texas-hcs';
export const TEXAS_HCS_KNOWLEDGE_PACK_CODE = 'TX-HCS';
export const TEXAS_HCS_KNOWLEDGE_PACK_VERSION = '0.1.0';

export const texasHcsKnowledgePack: KnowledgePack = {
  metadata: {
    id: TEXAS_HCS_KNOWLEDGE_PACK_ID,
    code: TEXAS_HCS_KNOWLEDGE_PACK_CODE,
    name: 'Texas Home and Community-Based Services',
    description:
      'Regulatory knowledge pack for Texas Home and Community-Based Services program operations, compliance, evidence, document generation, renewals, and provider guidance.',
    jurisdiction: 'Texas',
    industry: 'Health and Human Services',
    program: 'Home and Community-Based Services',
    version: TEXAS_HCS_KNOWLEDGE_PACK_VERSION,
    tags: [
      'TEXAS',
      'HCS',
      'HHSC',
      'REGULATORY_KNOWLEDGE',
      'PROVIDER_COMPLIANCE',
    ],
  },

  sources: [texasHcsEmergencyPreparednessSource],

  rules: [texasHcsEmergencyPreparednessRule],

  requirements: [texasHcsEmergencyPlanRequirement],

  questions: [...texasHcsEmergencyPreparednessQuestions],

  evidenceRequirements: [
    ...texasHcsEmergencyPreparednessEvidenceRequirements,
  ],

  validationRules: [
    ...texasHcsEmergencyPreparednessValidationRules,
  ],

  documentDefinitions: [
    texasHcsEmergencyPlanDocumentDefinition,
  ],

  renewalRules: [texasHcsEmergencyPlanRenewalRule],

  guidance: [texasHcsEmergencyPlanGuidance],
};

/**
 * Provides the complete Emergency Preparedness bundle for consumers that need
 * one regulation without loading the entire Texas HCS knowledge pack.
 */
export const texasHcsEmergencyPreparedness =
  texasHcsEmergencyPreparednessBundle;