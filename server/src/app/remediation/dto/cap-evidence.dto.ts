export class CapEvidenceDto {
  id!: string;

  capId!: string;

  complianceResultId!: string;

  fileName!: string;

  fileType!: string;

  storagePath!: string;

  evidenceType!: string;

  uploadedByUserId!: string | null;

  createdAt!: Date;
}