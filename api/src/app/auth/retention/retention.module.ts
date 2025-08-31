import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRetentionController } from './admin-retention.controller'; // ✅ add
import { EmailVerification } from '../entities/email-verification.entity';
import { LoginAttempt } from '../entities/login-attempt.entity';
import { PasswordReset } from '../entities/password-reset.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UserSession } from '../entities/user-session.entity';
import { RetentionService } from './retention.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSession,
      RefreshToken,
      LoginAttempt,
      EmailVerification,
      PasswordReset,
    ]),
  ],
  controllers: [AdminRetentionController], // ✅ add
  providers: [RetentionService],
  exports: [RetentionService],
})
export class RetentionModule {}
