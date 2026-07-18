import { KnowledgePack } from '../../models/knowledge-pack.model';

import {
  texasHcsEmergencyPreparednessBundle,
  texasHcsEmergencyPreparednessSource,
  texasHcsEmergencyPreparednessRule,
  texasHcsEmergencyPlanRequirement,
  texasHcsEmergencyPreparednessQuestions,
  texasHcsEmergencyPreparednessEvidenceRequirements,
  texasHcsEmergencyPreparednessValidationRules,
  texasHcsEmergencyPlanDocumentDefinition,
  texasHcsEmergencyPlanRenewalRule,
  texasHcsEmergencyPlanGuidance,
} from './rules/emergency-preparedness.rule';

export const TEXAS_HCS_KNOWLEDGE_PACK_ID = 'texas-hcs';
export const TEXAS_HCS_KNOWLEDGE_PACK_VERSION = '1.0.0';

export const texasHcsKnowledgePack: KnowledgePack = {
metadata: {
  id: TEXAS_HCS_KNOWLEDGE_PACK_ID,
  code: 'TX-HCS',
  name: 'Texas Home and Community-Based Services',
  description:
    'Texas HHSC Home and Community-Based Services Regulatory Knowledge Pack.',
  jurisdiction: 'Texas',
  industry: 'Health and Human Services',
  program: 'Home and Community-Based Services',
  version: TEXAS_HCS_KNOWLEDGE_PACK_VERSION,
  tags: [
    'Texas',
    'HHSC',
    'HCS',
    'Regulatory Knowledge',
  ],
},

  sources: [
    texasHcsEmergencyPreparednessSource,
  ],

  rules: [
    texasHcsEmergencyPreparednessRule,
  ],

  requirements: [
    texasHcsEmergencyPlanRequirement,
  ],

  questions: [
    ...texasHcsEmergencyPreparednessQuestions,
  ],

  evidenceRequirements: [
    ...texasHcsEmergencyPreparednessEvidenceRequirements,
  ],

  validationRules: [
    ...texasHcsEmergencyPreparednessValidationRules,
  ],

  documentDefinitions: [
    texasHcsEmergencyPlanDocumentDefinition,
  ],

  renewalRules: [
    texasHcsEmergencyPlanRenewalRule,
  ],

  guidance: [
    texasHcsEmergencyPlanGuidance,
  ],
};

/**
 * Convenience export while developing.
 *
 * Eventually every regulation will have its own bundle and the
 * Knowledge Pack Loader will assemble these automatically.
 */
export const texasHcsEmergencyPreparedness =
  texasHcsEmergencyPreparednessBundle;

export default texasHcsKnowledgePack;