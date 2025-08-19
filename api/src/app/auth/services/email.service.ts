// api/src/app/auth/services/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerification(to: string, _token: string) {
    // TODO: integrate Mailer (don’t include PHI). Link should point to your frontend to complete verification
    this.logger.log(`Sent verification link to ${to}`);
  }

  async verify(_dto: VerifyEmailDto) {
    // TODO: validate token/consume; mark user as verified
    return { verified: true };
  }

  async resendVerification() {
    // TODO: reissue token, call sendVerification
    return { resent: true };
  }
}