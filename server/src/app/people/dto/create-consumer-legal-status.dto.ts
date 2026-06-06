// server/src/app/people/dto/create-consumer-legal-status.dto.ts

import { IsDateString, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateConsumerLegalStatusDto {
  @IsUUID()
  consumerRecordId!: string;

  @IsString()
  @MaxLength(100)
  legalStatusType!: string;

  @IsOptional()
  @IsDateString()
  courtOrderDate?: string;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  status?: string;
}