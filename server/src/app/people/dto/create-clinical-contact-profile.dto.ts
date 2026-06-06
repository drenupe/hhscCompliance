import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClinicalContactProfileDto {
  @IsUUID()
  personId!: string;

  @IsUUID()
  providerId!: string;

  @IsString()
  type!:
    | 'PCP'
    | 'RN'
    | 'LVN'
    | 'PSYCHIATRIST'
    | 'DENTIST'
    | 'SPECIALIST';

  @IsOptional()
  @IsString()
  organization?: string | null;

  @IsOptional()
  @IsString()
  npi?: string | null;

  @IsOptional()
  @IsString()
  licenseNumber?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  fax?: string | null;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE';
}