import { KnowledgePackLoader } from '../loaders/knowledge-pack.loader';
import { texasHcsKnowledgePack } from '../packs/texas-hcs/texas-hcs.knowledge-pack';
import { TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS } from '../packs/texas-hcs/rules/emergency-preparedness.rule';
import { MemoryKnowledgeRepository } from '../repositories/memory-knowledge.repository';
import { KnowledgePackValidator } from '../validators/knowledge-pack.validator';
import { KnowledgeEngineService } from './knowledge-engine.service';
import { DocumentGeneratorService } from './document-generator.service';

describe('DocumentGeneratorService', () => {
  let service: DocumentGeneratorService;

  beforeEach(() => {
    const repository = new MemoryKnowledgeRepository();
    const validator = new KnowledgePackValidator();
    const loader = new KnowledgePackLoader(
      validator,
      repository,
    );

    loader.load(texasHcsKnowledgePack);

    const knowledgeEngine =
      new KnowledgeEngineService(repository);

    service = new DocumentGeneratorService(
      knowledgeEngine,
    );
  });

  it('returns the available Emergency Plan document definition', () => {
    const documents = service.getAvailableDocuments(
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    );

    expect(documents).toHaveLength(1);
    expect(documents[0].id).toBe(
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.document,
    );
  });

  it('generates a typed Emergency Plan document', () => {
    const document = service.generate({
      requirementId:
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      outputFormat: 'PDF',
      answers: {
        emergencyCoordinatorName: 'Andre McCaskill',
        evacuationProcedure:
          'Evacuate through the nearest safe exit and report to the designated assembly point.',
        shelterInPlaceProcedure:
          'Move individuals to the designated interior shelter area.',
        emergencyPlanApprovalDate: '2026-07-12',
      },
      context: {
        locationCode: 'HEAV',
        effectiveDate: '2026-07-12',
        residenceName: 'Rockheaven Residence',
      },
    });

    expect(document.requirementId).toBe(
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
    );

    expect(document.documentDefinition.id).toBe(
      TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.document,
    );

    expect(document.outputFormat).toBe('PDF');
    expect(document.fileName).toBe(
      'HEAV-emergency-plan-2026-07-12.pdf',
    );
    expect(document.sections.length).toBeGreaterThan(0);
    expect(document.generatedAt).toBeTruthy();
  });

  it('returns document sections in display order', () => {
    const document = service.generate({
      requirementId:
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      outputFormat: 'HTML',
      answers: {},
      context: {
        locationCode: 'HEAV',
        effectiveDate: '2026-07-12',
      },
    });

    const displayOrders = document.sections.map(
      (section) => section.displayOrder,
    );

    expect(displayOrders).toEqual(
      [...displayOrders].sort(
        (left, right) => left - right,
      ),
    );
  });

  it('rejects unsupported output formats', () => {
    const documentDefinition =
      service.getAvailableDocuments(
        TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
      )[0];

    documentDefinition.outputFormats = ['PDF'];

    expect(() =>
      service.generate({
        requirementId:
          TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.requirement,
        outputFormat: 'DOCX',
        answers: {},
        context: {
          locationCode: 'HEAV',
          effectiveDate: '2026-07-12',
        },
      }),
    ).toThrow(
      `Document "${documentDefinition.id}" does not support output format "DOCX".`,
    );
  });

  it('rejects unknown requirements', () => {
    expect(() =>
      service.generate({
        requirementId: 'unknown-requirement',
        outputFormat: 'PDF',
        answers: {},
      }),
    ).toThrow(
      'No document definitions were found for requirement "unknown-requirement".',
    );
  });
});