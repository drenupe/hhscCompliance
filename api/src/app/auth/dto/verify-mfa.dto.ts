// api/src/app/auth/dto/verify-mfa.dto.ts
import { IsOptional, IsString } from 'class-validator';
export class VerifyMfaDto {
  @IsString() code!: string; // TOTP or WebAuthn assertion payload reference
  @IsOptional() @IsString() backupCode?: string;
}