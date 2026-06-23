import { IsString, IsUUID } from 'class-validator';

export class AddFindingNoteDto {
  @IsUUID()
  complianceResultId!: string;

  @IsString()
  note!: string;
}