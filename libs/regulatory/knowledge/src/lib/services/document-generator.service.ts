import {
  DocumentGenerationRequest,
  DocumentGenerator,
  GeneratedDocument,
  GeneratedDocumentSection,
} from '../interfaces/document-generator.interface';
import { KnowledgeEngine } from '../interfaces/knowledge-engine.interface';
import { DocumentDefinition } from '../models/document-definition.model';

export class DocumentGeneratorService implements DocumentGenerator {
  constructor(private readonly knowledgeEngine: KnowledgeEngine) {}

  generate(request: DocumentGenerationRequest): GeneratedDocument {
    const documentDefinition = this.resolveDocumentDefinition(request);

    if (!documentDefinition.outputFormats.includes(request.outputFormat)) {
      throw new Error(
        `Document "${documentDefinition.id}" does not support output format "${request.outputFormat}".`,
      );
    }

    const data = {
      ...(request.context ?? {}),
      ...request.answers,
    };

    return {
      documentDefinition,
      requirementId: request.requirementId,
      outputFormat: request.outputFormat,
      fileName: this.buildFileName(
        documentDefinition,
        data,
        request.outputFormat,
      ),
      sections: this.buildSections(documentDefinition, data),
      generatedAt: new Date().toISOString(),
      data,
    };
  }

  getAvailableDocuments(requirementId: string): DocumentDefinition[] {
    return this.knowledgeEngine.getGeneratedDocuments(requirementId);
  }

  private resolveDocumentDefinition(
    request: DocumentGenerationRequest,
  ): DocumentDefinition {
    const documents = this.getAvailableDocuments(request.requirementId);

    if (!documents.length) {
      throw new Error(
        `No document definitions were found for requirement "${request.requirementId}".`,
      );
    }

    if (!request.documentDefinitionId) {
      if (documents.length > 1) {
        throw new Error(
          `Requirement "${request.requirementId}" has multiple document definitions. Provide documentDefinitionId.`,
        );
      }

      return documents[0];
    }

    const document = documents.find(
      (item) => item.id === request.documentDefinitionId,
    );

    if (!document) {
      throw new Error(
        `Document definition "${request.documentDefinitionId}" was not found for requirement "${request.requirementId}".`,
      );
    }

    return document;
  }

  private buildSections(
    documentDefinition: DocumentDefinition,
    data: Record<string, unknown>,
  ): GeneratedDocumentSection[] {
    return [...documentDefinition.sections]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((section) => ({
        id: section.id,
        key: section.key,
        title: section.title,
        displayOrder: section.displayOrder,
        template: section.template,
        data,
      }));
  }

  private buildFileName(
    documentDefinition: DocumentDefinition,
    data: Record<string, unknown>,
    outputFormat: DocumentGenerationRequest['outputFormat'],
  ): string {
    const template =
      documentDefinition.fileNameTemplate ?? documentDefinition.code;

    const resolved = template.replace(
      /{{\s*([^{}]+)\s*}}/g,
      (_match, rawKey: string) => {
        const key = rawKey.trim();
        const value = this.resolvePath(data, key);

        return value === undefined || value === null
          ? key
          : this.sanitize(String(value));
      },
    );

    return `${this.sanitize(resolved)}.${outputFormat.toLowerCase()}`;
  }

  private resolvePath(
    source: Record<string, unknown>,
    path: string,
  ): unknown {
    return path.split('.').reduce<unknown>((current, segment) => {
      if (
        current === null ||
        current === undefined ||
        typeof current !== 'object'
      ) {
        return undefined;
      }

      return (current as Record<string, unknown>)[segment];
    }, source);
  }

  private sanitize(value: string): string {
    return value
      .trim()
      .replace(/[<>:"/\\|?*]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}