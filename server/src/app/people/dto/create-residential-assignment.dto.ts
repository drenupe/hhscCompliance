import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateResidentialAssignmentDto {
  @IsUUID()
  providerId!: string;

  @IsUUID()
  locationId!: string;

  @IsUUID()
  consumerRecordId!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE';
}