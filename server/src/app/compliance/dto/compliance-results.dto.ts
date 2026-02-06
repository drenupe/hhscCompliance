import { IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateComplianceResultDto {
  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsString()
  locationId?: string | null;

  @IsIn(['RESIDENTIAL', 'CONSUMER', 'EMPLOYEE', 'PROVIDER'])
  entityType!: 'RESIDENTIAL' | 'CONSUMER' | 'EMPLOYEE' | 'PROVIDER';

  @IsString()
  entityId!: string;

  @IsString()
  @MaxLength(60)
  module!: string;

  // Optional grouping inside module (ex: FIRE under RESIDENTIAL)
  @IsOptional()
  @IsString()
  @MaxLength(80)
  subcategory?: string | null;

  @IsString()
  @MaxLength(80)
  ruleCode!: string;

  @IsIn(['COMPLIANT', 'NON_COMPLIANT', 'UNKNOWN'])
  status!: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';

  @IsIn(['LOW', 'MED', 'HIGH', 'CRITICAL'])
  severity!: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

  @IsOptional()
  @IsString()
  @MaxLength(800)
  message?: string | null;

  @IsOptional()
  routeCommands?: any[] | null;

  @IsOptional()
  queryParams?: Record<string, any> | null;

  @IsOptional()
  lastCheckedAt?: string | null;
}

export class UpdateComplianceResultDto {
  @IsOptional()
  @IsIn(['COMPLIANT', 'NON_COMPLIANT', 'UNKNOWN'])
  status?: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';

  @IsOptional()
  @IsIn(['LOW', 'MED', 'HIGH', 'CRITICAL'])
  severity?: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

  @IsOptional()
  @IsString()
  @MaxLength(800)
  message?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  subcategory?: string | null;

  @IsOptional()
  routeCommands?: any[] | null;

  @IsOptional()
  queryParams?: Record<string, any> | null;

  @IsOptional()
  lastCheckedAt?: string | null;
}
