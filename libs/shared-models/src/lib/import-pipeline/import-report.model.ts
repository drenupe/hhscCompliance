import { RelationshipIssue } from './relationship-issue.model';

export interface ImportReport {
  totalTables: number;
  totalRecords: number;
  errors: number;
  warnings: number;
  issues: RelationshipIssue[];
}