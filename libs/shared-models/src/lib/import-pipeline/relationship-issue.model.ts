export interface RelationshipIssue {
  severity: 'error' | 'warning';
  message: string;
  source: string;
}