export type SetupMethodType = 'import' | 'manual' | 'customer-success';

export interface SetupMethod {
  type: SetupMethodType;
  title: string;
  badge?: string;
  description: string;
  bullets: string[];
  cta: string;
}