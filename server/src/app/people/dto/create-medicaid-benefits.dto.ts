// server/src/app/people/dto/create-medicaid-benefits.dto.ts

import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateMedicaidBenefitsDto {
  @IsUUID()
  consumerRecordId!: string;

  @IsString()
  @MaxLength(64)
  medicaidNumber!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  waiverProgram?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mcoName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  eligibilityStatus?: string;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsDateString()
  renewalDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}