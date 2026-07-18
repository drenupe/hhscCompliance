import {
  RegulatorySourceType,
  RegulatoryStatus,
} from '../enums/regulatory.enums';

export interface RegulatorySource {
  id: string;
  code: string;
  name: string;
  publisher: string;
  sourceType: RegulatorySourceType;
  jurisdiction: string;
  version: string;
  status: RegulatoryStatus;
  effectiveDate?: string;
  expirationDate?: string;
  publishedDate?: string;
  sourceUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}