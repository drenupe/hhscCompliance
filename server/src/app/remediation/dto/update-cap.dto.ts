import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCapDto {
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'RESOLVED', 'CLOSED'])
  status?: string;

  @IsOptional()
  @IsString()
  issue?: string;

  @IsOptional()
  @IsString()
  correctiveAction?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  responsibleParty?: string;

  @IsOptional()
  @IsDateString()
  targetCompletionDate?: string;
}