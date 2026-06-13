import { IsString, IsUUID, MaxLength } from 'class-validator';

export class DisableMfaDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MaxLength(500)
  reason!: string;
}