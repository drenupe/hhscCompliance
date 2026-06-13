import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class VerifyMfaDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MaxLength(32)
  token!: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  type?: 'TOTP' | 'BACKUP_CODE';
}