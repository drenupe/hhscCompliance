import { texasHcsKnowledgePack } from '../packs/texas-hcs/texas-hcs.knowledge-pack';
import { KnowledgePack } from '../models/knowledge-pack.model';
import { KnowledgePackValidator } from './knowledge-pack.validator';

describe('KnowledgePackValidator', () => {
  let validator: KnowledgePackValidator;

  beforeEach(() => {
    validator = new KnowledgePackValidator();
  });

  it('validates the Texas HCS knowledge pack', () => {
    const result = validator.validate(texasHcsKnowledgePack);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects a pack with missing metadata', () => {
    const pack: KnowledgePack = {
      ...texasHcsKnowledgePack,
      metadata: {
        ...texasHcsKnowledgePack.metadata,
        id: '',
      },
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'PACK_ID_REQUIRED',
          path: 'metadata.id',
        }),
      ]),
    );
  });

  it('rejects duplicate IDs within a collection', () => {
    const firstQuestion = texasHcsKnowledgePack.questions[0];

    const pack: KnowledgePack = {
      ...texasHcsKnowledgePack,
      questions: [
        ...texasHcsKnowledgePack.questions,
        {
          ...firstQuestion,
          key: `${firstQuestion.key}-duplicate`,
        },
      ],
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'DUPLICATE_ID',
        }),
      ]),
    );
  });

  it('rejects a rule that references an unknown source', () => {
    const pack: KnowledgePack = {
      ...texasHcsKnowledgePack,
      rules: texasHcsKnowledgePack.rules.map((rule, index) =>
        index === 0
          ? {
              ...rule,
              sourceId: 'unknown-source',
            }
          : rule,
      ),
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'RULE_SOURCE_NOT_FOUND',
        }),
      ]),
    );
  });

  it('rejects a requirement that references an unknown rule', () => {
    const pack: KnowledgePack = {
      ...texasHcsKnowledgePack,
      requirements: texasHcsKnowledgePack.requirements.map(
        (requirement, index) =>
          index === 0
            ? {
                ...requirement,
                ruleId: 'unknown-rule',
              }
            : requirement,
      ),
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'REQUIREMENT_RULE_NOT_FOUND',
        }),
      ]),
    );
  });

  it('rejects select questions without options', () => {
    const targetQuestion =
      texasHcsKnowledgePack.questions.find(
        (question) => question.inputType === 'MULTI_SELECT',
      );

    expect(targetQuestion).toBeDefined();

    const pack: KnowledgePack = {
      ...texasHcsKnowledgePack,
      questions: texasHcsKnowledgePack.questions.map((question) =>
        question.id === targetQuestion?.id
          ? {
              ...question,
              options: [],
            }
          : question,
      ),
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'QUESTION_OPTIONS_REQUIRED',
        }),
      ]),
    );
  });

  it('rejects documents that reference unknown requirements', () => {
    const pack: KnowledgePack = {
      ...texasHcsKnowledgePack,
      documentDefinitions:
        texasHcsKnowledgePack.documentDefinitions.map(
          (document, index) =>
            index === 0
              ? {
                  ...document,
                  requirementIds: ['unknown-requirement'],
                }
              : document,
        ),
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'DOCUMENT_REQUIREMENT_NOT_FOUND',
        }),
      ]),
    );
  });

  it('rejects invalid renewal intervals', () => {
    const pack: KnowledgePack = {
      ...texasHcsKnowledgePack,
      renewalRules: texasHcsKnowledgePack.renewalRules.map(
        (renewal, index) =>
          index === 0
            ? {
                ...renewal,
                interval: 0,
              }
            : renewal,
      ),
    };

    const result = validator.validate(pack);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'RENEWAL_INTERVAL_INVALID',
        }),
      ]),
    );
  });
});