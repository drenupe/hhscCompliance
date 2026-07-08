import { Injectable } from '@angular/core';

import { RelationshipIssue } from './relationship-engine.service';
import { MappedImportTable } from './import-mapper.service';

export interface ImportReport {
  totalTables: number;
  totalRecords: number;
  errors: number;
  warnings: number;
  issues: RelationshipIssue[];
}

@Injectable({
  providedIn: 'root',
})
export class ImportReportService {
  createReport(
    tables: MappedImportTable[],
    issues: RelationshipIssue[],
  ): ImportReport {
    return {
      totalTables: tables.length,
      totalRecords: tables.reduce(
        (total, table) => total + table.recordCount,
        0,
      ),
      errors: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      issues,
    };
  }
}