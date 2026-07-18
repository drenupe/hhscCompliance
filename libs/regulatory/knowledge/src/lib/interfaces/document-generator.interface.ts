import { DocumentOutputFormat } from '../enums/regulatory.enums';
import { DocumentDefinition } from '../models/document-definition.model';

export interface DocumentGenerationRequest {
  requirementId: string;
  documentDefinitionId?: string;
  outputFormat: DocumentOutputFormat;
  answers: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface GeneratedDocumentSection {
  id: string;
  key: string;
  title: string;
  displayOrder: number;
  template: string;
  data: Record<string, unknown>;
}

export interface GeneratedDocument {
  documentDefinition: DocumentDefinition;
  requirementId: string;
  outputFormat: DocumentOutputFormat;
  fileName: string;
  sections: GeneratedDocumentSection[];
  generatedAt: string;
  data: Record<string, unknown>;
}

export interface DocumentGenerator {
  generate(request: DocumentGenerationRequest): GeneratedDocument;
  getAvailableDocuments(requirementId: string): DocumentDefinition[];
}