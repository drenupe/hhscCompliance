export interface MappedImportTable {
  id: string;
  name: string;
  records: Record<string, string>[];
  recordCount: number;
}