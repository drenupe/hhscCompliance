import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateEmployeeProfileDto {
  @IsUUID()
  personId!: string;

  @IsUUID()
  providerId!: string;

  @IsOptional()
  @IsString()
  employeeNumber?: string | null;

  @IsOptional()
  @IsString()
  jobTitle?: string | null;

  @IsOptional()
  @IsDateString()
  hireDate?: string | null;

  @IsOptional()
  @IsDateString()
  terminationDate?: string | null;

  @IsOptional()
  @IsString()
  credentials?: string | null;

  @IsOptional()
  @IsBoolean()
  isDirectCare?: boolean;

  @IsOptional()
  @IsBoolean()
  isCaseManager?: boolean;

  @IsOptional()
  @IsBoolean()
  isNurse?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresBackgroundCheck?: boolean;

  @IsOptional()
  @IsDateString()
  backgroundCheckDate?: string | null;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_LEAVE';
}