import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateConsumerCareTeamAssignmentDto {
  @IsUUID()
  consumerRecordId!: string;

  @IsOptional()
  @IsUUID()
  employeeProfileId?: string | null;

  @IsOptional()
  @IsUUID()
  clinicalContactProfileId?: string | null;

  @IsIn([
    'CASE_MANAGER',
    'RN',
    'LVN',
    'PCP',
    'PSYCHIATRIST',
    'DENTIST',
    'SPECIALIST',
    'GUARDIAN',
    'PROGRAM_MANAGER',
    'QIDP',
  ])
  role!:
    | 'CASE_MANAGER'
    | 'RN'
    | 'LVN'
    | 'PCP'
    | 'PSYCHIATRIST'
    | 'DENTIST'
    | 'SPECIALIST'
    | 'GUARDIAN'
    | 'PROGRAM_MANAGER'
    | 'QIDP';

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE';
}