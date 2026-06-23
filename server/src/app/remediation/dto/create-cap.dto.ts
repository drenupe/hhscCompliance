import { IsDateString, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCapDto {
  @IsUUID()
  complianceResultId!: string;

  @IsString()
  issue!: string;

  @IsString()
  correctiveAction!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  responsibleParty?: string;

  @IsOptional()
  @IsDateString()
  targetCompletionDate?: string;
}