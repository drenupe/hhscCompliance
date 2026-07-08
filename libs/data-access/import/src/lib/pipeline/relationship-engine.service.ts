import { Injectable } from '@angular/core';

import { MappedImportTable } from './import-mapper.service';

export interface RelationshipIssue {
  severity: 'error' | 'warning';
  message: string;
  source: string;
}

@Injectable({
  providedIn: 'root',
})
export class RelationshipEngineService {
  evaluate(tables: MappedImportTable[]): RelationshipIssue[] {
    const issues: RelationshipIssue[] = [];

    for (const table of tables) {
      if (!table.recordCount) {
        issues.push({
          severity: 'warning',
          source: table.name,
          message: 'No records were found in this import file.',
        });
      }

      const duplicateIds = this.findDuplicateIds(table.records);

      for (const id of duplicateIds) {
        issues.push({
          severity: 'error',
          source: table.name,
          message: `Duplicate record id found: ${id}`,
        });
      }
    }

    return issues;
  }

  private findDuplicateIds(records: Record<string, string>[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const record of records) {
      const id =
        record['id'] ||
        record['employee_id'] ||
        record['consumer_id'] ||
        record['location_id'];

      if (!id) {
        continue;
      }

      if (seen.has(id)) {
        duplicates.add(id);
      }

      seen.add(id);
    }

    return [...duplicates];
  }
}