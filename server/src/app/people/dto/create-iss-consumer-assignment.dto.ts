import { IsDateString, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIssConsumerAssignmentDto {
  @IsUUID()
  consumereRecordId!: string;

  @IsInt()
  issProviderId!: number;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE';
}