import { IsDateString } from 'class-validator';

export class EndResidentialAssignmentDto {
  @IsDateString()
  endDate!: string;
}