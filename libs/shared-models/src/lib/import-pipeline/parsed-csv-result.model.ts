export interface ParsedCsvResult {
  fileName: string;
  headers: string[];
  rows: Record<string, string>[];
  rowCount: number;
}