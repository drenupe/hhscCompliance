import { RegulatoryStatus } from '../enums/regulatory.enums';

export interface RegulatoryRuleReference {
  sourceId: string;
  citation: string;
  title?: string;
  url?: string;
}

export interface RegulatoryRule {
  id: string;
  sourceId: string;
  parentRuleId?: string;

  code: string;
  citation: string;
  title: string;
  description?: string;

  chapter?: string;
  subchapter?: string;
  section?: string;
  subsection?: string;

  version: string;
  status: RegulatoryStatus;

  effectiveDate?: string;
  expirationDate?: string;

  references?: RegulatoryRuleReference[];
  tags?: string[];

  createdAt?: string;
  updatedAt?: string;
}