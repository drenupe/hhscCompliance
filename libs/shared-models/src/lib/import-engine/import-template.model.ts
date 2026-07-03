import { ImportStatus } from './import-status.enum';

export type ImportTemplateRequirement = 'required' | 'recommended' | 'optional';

export interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  requirement: ImportTemplateRequirement;
  expectedFileName: string;
  status: ImportStatus;
  uploaded: boolean;
  recordsFound?: number;
}