import {
  ApplicabilityCondition,
} from './regulatory-requirement.model';

import {
  QuestionInputType,
} from '../enums/regulatory.enums';

export interface RegulatoryQuestionOption {
  label: string;
  value: string;
  description?: string;
}

export interface RegulatoryQuestion {
  id: string;
  requirementId: string;

  key: string;
  label: string;
  helpText?: string;
  rationale?: string;

  inputType: QuestionInputType;

  required: boolean;
  defaultValue?: unknown;

  options?: RegulatoryQuestionOption[];
  conditions?: ApplicabilityCondition[];

  sourcePath?: string;
  displayOrder: number;

  placeholder?: string;
  example?: string;

  createdAt?: string;
  updatedAt?: string;
}