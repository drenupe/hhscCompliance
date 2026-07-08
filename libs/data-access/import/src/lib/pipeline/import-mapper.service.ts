import { Injectable } from '@angular/core';

import { ParsedCsvResult } from './csv-parser.service';

export interface MappedImportTable {
  id: string;
  name: string;
  records: Record<string, string>[];
  recordCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImportMapperService {
  map(templateId: string, parsed: ParsedCsvResult): MappedImportTable {
    return {
      id: templateId,
      name: parsed.fileName,
      records: parsed.rows.map((row) => this.normalizeRow(row)),
      recordCount: parsed.rowCount,
    };
  }

  private normalizeRow(row: Record<string, string>): Record<string, string> {
    return Object.entries(row).reduce<Record<string, string>>(
      (normalized, [key, value]) => {
        normalized[this.normalizeKey(key)] = value.trim();
        return normalized;
      },
      {},
    );
  }

  private normalizeKey(key: string): string {
    return key
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }
}