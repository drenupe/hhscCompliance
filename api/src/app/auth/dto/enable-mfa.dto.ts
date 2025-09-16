// api/src/app/auth/dto/enable-mfa.dto.ts
import { IsIn, IsOptional, IsString, Length } from 'class-validator';
export class EnableMfaDto {
  @IsIn(['totp','webauthn']) type!: 'totp' | 'webauthn';
  @IsOptional() @IsString() deviceName?: string;

  /** Optional: if present, we verify and enable immediately; if absent, we return otpauthUrl */
  @IsOptional()
  @IsString()
  @Length(6, 10)
  code?: string;
}