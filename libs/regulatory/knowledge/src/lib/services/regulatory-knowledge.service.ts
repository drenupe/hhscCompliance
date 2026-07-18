import assert from 'node:assert/strict';
import {
  beforeEach,
  describe,
  it,
} from 'node:test';



import { RenewalEngineService } from './renewal-engine.service';
import { KnowledgePackLoader } from '../loaders/knowledge-pack.loader';
import { TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS } from '../packs/texas-hcs/rules/emergency-preparedness.rule';
import texasHcsKnowledgePack from '../packs/texas-hcs/texas-hcs.knowledge-pack';
import { MemoryKnowledgeRepository } from '../repositories/memory-knowledge.repository';
import { KnowledgePackValidator } from '../validators/knowledge-pack.validator';
import { KnowledgeEngineService } from './knowledge-engine.service';

describe('RenewalEngineService', () => {
  let service: RenewalEngineService;

  beforeEach(() => {
    const repository =
      new MemoryKnowledgeRepository();

    const validator =
      new KnowledgePackValidator();

    const loader = new KnowledgePackLoader(
      validator,
      repository,
    );

    loader.load(texasHcsKnowledgePack);

    const knowledgeEngine =
      new KnowledgeEngineService(repository);

    service = new RenewalEngineService(
      knowledgeEngine,
    );
  });

  it('evaluates the Emergency Plan annual renewal', () => {
    const results = service.evaluate({
      requirementId:
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      lastCompletedDate: '2025-10-01',
      asOfDate: '2026-07-12',
    });

    assert.equal(results.length, 1);
    assert.equal(
      results[0].dueDate,
      '2026-10-01',
    );
    assert.equal(
      results[0].daysRemaining,
      81,
    );
    assert.equal(
      results[0].status,
      'DUE_SOON',
    );
  });

  it('marks an expired renewal as overdue', () => {
    const results = service.evaluate({
      requirementId:
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      lastCompletedDate: '2024-07-01',
      asOfDate: '2026-07-12',
    });

    assert.equal(
      results[0].status,
      'OVERDUE',
    );

    assert.equal(
      results[0].notificationRequired,
      true,
    );
  });

  it('returns current when outside the reminder window', () => {
    const results = service.evaluate({
      requirementId:
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      lastCompletedDate: '2026-07-01',
      asOfDate: '2026-07-12',
    });

    assert.equal(
      results[0].status,
      'CURRENT',
    );

    assert.equal(
      results[0].notificationRequired,
      false,
    );
  });

  it('matches an exact reminder day', () => {
    const results = service.evaluate({
      requirementId:
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      lastCompletedDate: '2025-10-10',
      asOfDate: '2026-07-12',
    });

    assert.equal(
      results[0].daysRemaining,
      90,
    );

    assert.equal(
      results[0].matchedReminderDay,
      90,
    );

    assert.equal(
      results[0].notificationRequired,
      true,
    );
  });

  it('rejects invalid dates', () => {
    assert.throws(
      () =>
        service.evaluate({
          requirementId:
            TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
          lastCompletedDate: 'not-a-date',
        }),
      {
        message:
          'Invalid lastCompletedDate "not-a-date". Expected YYYY-MM-DD.',
      },
    );
  });
});