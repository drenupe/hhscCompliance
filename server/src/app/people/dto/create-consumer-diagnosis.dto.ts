// server/src/app/people/dto/create-consumer-diagnosis.dto.ts

import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateConsumerDiagnosisDto {
  @IsUUID()
  consumerRecordId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  icd10Code?: string;

  @IsString()
  @MaxLength(255)
  diagnosisName!: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsDateString()
  resolvedDate?: string;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE' | 'RESOLVED';

  @IsOptional()
  @IsString()
  notes?: string;
}