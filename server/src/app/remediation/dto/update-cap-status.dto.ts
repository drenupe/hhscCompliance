import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCapStatusDto {
  @IsIn(['OPEN', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'RESOLVED', 'CLOSED'])
  status!: 'OPEN' | 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'RESOLVED' | 'CLOSED';

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  note?: string;
}