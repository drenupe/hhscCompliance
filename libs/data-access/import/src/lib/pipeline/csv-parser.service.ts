import { Injectable } from '@angular/core';

export interface ParsedCsvResult {
  fileName: string;
  headers: string[];
  rows: Record<string, string>[];
  rowCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CsvParserService {
  async parse(file: File): Promise<ParsedCsvResult> {
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return {
        fileName: file.name,
        headers: [],
        rows: [],
        rowCount: 0,
      };
    }

    const headers = this.parseLine(lines[0]);

    const rows = lines.slice(1).map((line) => {
      const values = this.parseLine(line);

      return headers.reduce<Record<string, string>>((row, header, index) => {
        row[header] = values[index] ?? '';
        return row;
      }, {});
    });

    return {
      fileName: file.name,
      headers,
      rows,
      rowCount: rows.length,
    };
  }

  private parseLine(line: string): string[] {
    return line
      .split(',')
      .map((value) => value.trim().replace(/^"|"$/g, ''));
  }
}