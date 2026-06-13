import { IsString, IsUUID, MaxLength } from 'class-validator';

export class EnableMfaDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MaxLength(10)
  token!: string;
}