// server/src/app/people/dto/create-consumer-guardian.dto.ts

import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateConsumerGuardianDto {
  @IsUUID()
  consumerRecordId!: string;

  @IsString()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  relationship?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isPrimaryGuardian?: boolean;

  @IsOptional()
  @IsBoolean()
  isEmergencyContact?: boolean;

  @IsOptional()
  @IsBoolean()
  hasMedicalDecisionAuthority?: boolean;

  @IsOptional()
  @IsBoolean()
  hasFinancialDecisionAuthority?: boolean;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE';

  @IsOptional()
  @IsString()
  notes?: string;
}