// api/src/app/auth/dto/enable-mfa.dto.ts
import { IsIn, IsOptional, IsString } from 'class-validator';
export class EnableMfaDto {
  @IsIn(['totp','webauthn']) type!: 'totp' | 'webauthn';
  @IsOptional() @IsString() deviceName?: string;
}