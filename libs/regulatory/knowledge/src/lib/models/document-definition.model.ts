import {
  DocumentOutputFormat,
  ProviderDomain,
} from '../enums/regulatory.enums';

export interface DocumentSectionDefinition {
  id: string;
  key: string;
  title: string;
  description?: string;
  template: string;
  displayOrder: number;
  required: boolean;
}

export interface DocumentDefinition {
  id: string;
  code: string;
  title: string;
  description?: string;

  requirementIds: string[];
  domains: ProviderDomain[];

  templateKey: string;
  version: string;

  outputFormats: DocumentOutputFormat[];
  sections: DocumentSectionDefinition[];

  requiresApproval: boolean;
  requiresSignature: boolean;
  publishToBinder: boolean;

  binderSectionKey?: string;
  fileNameTemplate?: string;

  effectiveDatePath?: string;
  expirationDatePath?: string;

  createdAt?: string;
  updatedAt?: string;
}