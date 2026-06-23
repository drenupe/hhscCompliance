export class FindingCapDto {
  id!: string;

  status!: string;

  issue!: string;

  correctiveAction!: string;

  responsibleParty!: string | null;

  targetCompletionDate!: string | null;

  completedAt!: Date | null;

  createdAt!: Date;

  updatedAt!: Date;
}

export class FindingCapSummaryDto {
  complianceResultId!: string;

  ruleCode!: string;

  module!: string;

  subcategory!: string | null;

  status!: string;

  severity!: string;

  capStatus!: string;

  capCount!: number;

  caps!: FindingCapDto[];
}