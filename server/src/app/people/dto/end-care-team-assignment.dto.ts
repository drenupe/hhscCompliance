import { IsDateString } from 'class-validator';

export class EndCareTeamAssignmentDto {
  @IsDateString()
  endDate!: string;
}