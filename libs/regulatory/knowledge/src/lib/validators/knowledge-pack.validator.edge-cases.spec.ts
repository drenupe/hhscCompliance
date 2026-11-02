import { texasHcsKnowledgePack } from '../packs/texas-hcs/texas-hcs.knowledge-pack';
import { KnowledgePackValidator } from './knowledge-pack.validator';

describe('KnowledgePackValidator edge cases', () => {
  let validator: KnowledgePackValidator;

  beforeEach(() => {
    validator = new KnowledgePackValidator();
  });

  it('rejects a fractional evidence minimumCount', () => {
    const pack = {
      ...texasHcsKnowledgePack,
      evidenceRequirements: texasHcsKnowledgePack.evidenceRequirements.map(
        (evidence, index) =>
          index === 0 ? { ...evidence, minimumCount: 1.5 } : evidence,
      ),
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'evidenceRequirements[0].minimumCount',
          severity: 'ERROR',
        }),
      ]),
    );
  });

  it('rejects a non-finite MIN_VALUE configuration', () => {
    const baseRule = texasHcsKnowledgePack.validationRules[0];

    if (!baseRule) {
      throw new Error('A base validation rule is required for this test.');
    }

    const testRule = {
      ...baseRule,
      id: 'edge-min-value-non-finite',
      code: 'EDGE-MIN-NON-FINITE',
      ruleType: 'MIN_VALUE' as const,
      minValue: Number.NaN,
    };

    const pack = {
      ...texasHcsKnowledgePack,
      validationRules: [...texasHcsKnowledgePack.validationRules, testRule],
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: `validationRules[${pack.validationRules.length - 1}].minValue`,
          severity: 'ERROR',
        }),
      ]),
    );
  });

  it('rejects an invalid regular-expression pattern', () => {
    const baseRule = texasHcsKnowledgePack.validationRules[0];

    if (!baseRule) {
      throw new Error('A base validation rule is required for this test.');
    }

    const testRule = {
      ...baseRule,
      id: 'edge-pattern-invalid',
      code: 'EDGE-PATTERN-INVALID',
      ruleType: 'PATTERN' as const,
      pattern: '[',
    };

    const pack = {
      ...texasHcsKnowledgePack,
      validationRules: [...texasHcsKnowledgePack.validationRules, testRule],
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: `validationRules[${pack.validationRules.length - 1}].pattern`,
          severity: 'ERROR',
        }),
      ]),
    );
  });

  it('reports a missing binder section as a warning, not an error', () => {
    const pack = {
      ...texasHcsKnowledgePack,
      documentDefinitions: texasHcsKnowledgePack.documentDefinitions.map(
        (document, index) =>
          index === 0
            ? {
                ...document,
                publishToBinder: true,
                binderSectionKey: undefined,
              }
            : document,
      ),
    };

    const result = validator.validate(pack);

    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'DOCUMENT_BINDER_SECTION_MISSING',
          severity: 'WARNING',
        }),
      ]),
    );

    expect(result.errors).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'DOCUMENT_BINDER_SECTION_MISSING',
        }),
      ]),
    );
  });
});
