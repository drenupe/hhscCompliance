import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddCapNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  note!: string;
}