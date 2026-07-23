import assert = require('node:assert/strict');

import { KnowledgePackLoader } from '../loaders/knowledge-pack.loader';
import { texasHcsKnowledgePack } from '../packs/texas-hcs/texas-hcs.knowledge-pack';
import { TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS } from '../packs/texas-hcs/rules/emergency-preparedness.rule';
import { MemoryKnowledgeRepository } from '../repositories/memory-knowledge.repository';
import { KnowledgePackValidator } from '../validators/knowledge-pack.validator';
import { KnowledgeEngineService } from './knowledge-engine.service';

describe('KnowledgeEngineService', () => {
  let service: KnowledgeEngineService;

  beforeEach(() => {
    const repository =
      new MemoryKnowledgeRepository();

    const loader =
      new KnowledgePackLoader(
        new KnowledgePackValidator(),
        repository,
      );

    loader.load(texasHcsKnowledgePack);

    service =
      new KnowledgeEngineService(repository);
  });

  it('loads the Texas HCS Knowledge Pack', () => {
    assert.deepEqual(
      service.getLoadedPackIds(),
      ['texas-hcs'],
    );

    const pack =
      service.getPack('texas-hcs');

    assert.ok(pack);

    assert.equal(
      pack.metadata.code,
      'TX-HCS',
    );
  });

  it('returns the Emergency Preparedness rule', () => {
    const rule = service.getRule(
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.rule,
    );

    assert.ok(rule);

    assert.equal(
      rule.code,
      'TX-HCS-EMERGENCY-PREPAREDNESS',
    );
  });

  it('returns the Emergency Plan requirement', () => {
    const requirement =
      service.getRequirement(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      );

    assert.ok(requirement);

    assert.equal(
      requirement.code,
      'TX-HCS-EP-001',
    );
  });

  it('returns Emergency Plan questions in display order', () => {
    const questions =
      service.getQuestions(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      );

    assert.ok(
      questions.length > 0,
    );

    const displayOrders =
      questions.map(
        (question) =>
          question.displayOrder,
      );

    assert.deepEqual(
      displayOrders,
      [...displayOrders].sort(
        (left, right) =>
          left - right,
      ),
    );
  });

  it('returns Emergency Plan evidence requirements', () => {
    const evidence =
      service.getEvidence(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      );

    assert.ok(
      evidence.length > 0,
    );

    assert.ok(
      evidence.some(
        (item) =>
          item.id ===
          TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS
            .evidence.emergencyPlan,
      ),
    );
  });

  it('returns Emergency Plan validation rules', () => {
    const validation =
      service.getValidation(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      );

    assert.ok(
      validation.length > 0,
    );

    assert.ok(
      validation.every(
        (rule) =>
          rule.requirementId ===
          TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      ),
    );
  });

  it('returns the Emergency Plan document definition', () => {
    const documents =
      service.getGeneratedDocuments(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      );

    assert.equal(
      documents.length,
      1,
    );

    assert.equal(
      documents[0].id,
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.document,
    );
  });

  it('returns the Emergency Plan renewal rule', () => {
    const renewals =
      service.getRenewal(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      );

    assert.equal(
      renewals.length,
      1,
    );

    assert.equal(
      renewals[0].id,
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.renewal,
    );
  });

  it('returns Emergency Plan guidance', () => {
    const guidance =
      service.getGuidance(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      );

    assert.equal(
      guidance.length,
      1,
    );

    assert.equal(
      guidance[0].id,
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.guidance,
    );
  });

  it('returns complete requirement knowledge', () => {
    const knowledge =
      service.getRequirementKnowledge(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      );

    assert.ok(knowledge);

    assert.ok(
      knowledge.questions.length > 0,
    );

    assert.ok(
      knowledge.evidenceRequirements.length > 0,
    );

    assert.ok(
      knowledge.validationRules.length > 0,
    );

    assert.equal(
      knowledge.documentDefinitions.length,
      1,
    );

    assert.equal(
      knowledge.renewalRules.length,
      1,
    );

    assert.equal(
      knowledge.guidance.length,
      1,
    );
  });

  it('returns complete rule knowledge', () => {
    const knowledge =
      service.getRuleKnowledge(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.rule,
      );

    assert.ok(knowledge);
    assert.ok(knowledge.source);

    assert.equal(
      knowledge.requirements.length,
      1,
    );

    assert.equal(
      knowledge.requirements[0]
        .requirement.id,
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    );
  });

  it('returns undefined for unknown IDs', () => {
    assert.equal(
      service.getRule(
        'unknown-rule',
      ),
      undefined,
    );

    assert.equal(
      service.getRequirementKnowledge(
        'unknown-requirement',
      ),
      undefined,
    );

    assert.equal(
      service.getRuleKnowledge(
        'unknown-rule',
      ),
      undefined,
    );
  });
});
