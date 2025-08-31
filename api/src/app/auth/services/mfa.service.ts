// api/src/app/auth/services/mfa.service.ts
import { Injectable } from '@nestjs/common';
import { EnableMfaDto } from '../dto/enable-mfa.dto';
import { VerifyMfaDto } from '../dto/verify-mfa.dto';

@Injectable()
export class MfaService {
  async enable(_dto: EnableMfaDto) {
    // TODO: generate secret (e.g., with otplib/speakeasy), persist; return otpauth URL/QR data
    return { secret: 'BASE32SECRET', otpauthUrl: 'otpauth://totp/App:email?secret=BASE32SECRET&issuer=App' };
  }
  async verify(_dto: VerifyMfaDto) {
    // TODO: verify TOTP code/WebAuthn assertion; persist enabledAt
    return { verified: true };
  }
  async disable() {
    // TODO: remove secret/disable MFA
    return { disabled: true };
  }
}