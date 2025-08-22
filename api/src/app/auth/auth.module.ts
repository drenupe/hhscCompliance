// api/src/app/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './controllers/auth.controller';
import { MfaController } from './controllers/mfa.controller';
import { EmailController } from './controllers/email.controller';

import { AuthService } from './services/auth.service';
import { TokensService } from './services/tokens.service';
import { SessionsService } from './services/sessions.service';
import { PasswordService } from './services/password.service';
import { MfaService } from './services/mfa.service';
import { EmailService } from './services/email.service';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

import { UserSession } from './entities/user-session.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { MfaSecret } from './entities/mfa-secret.entity';
import { UsersModule } from '../users/users.module';
import { LoginAttempt } from './entities/login-attempt.entity';
import { AccountProtectionService } from './services/account-protection.service';
import { RetentionModule } from './retention/retention.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(), // ✅ enables @Cron
    RetentionModule,          // ✅ our cleanup jobs
    ConfigModule,
    UsersModule, // ✅ use UsersService instead of injecting Repository<User> here
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: cs.get<string>('JWT_EXPIRES_IN') ?? '15m' },
      }),
    }),

    // No need to include User here; UsersModule already registers it
    TypeOrmModule.forFeature([
      UserSession,
      RefreshToken,
      EmailVerification,
      PasswordReset,
      MfaSecret,
      LoginAttempt
    ]),
  ],
  controllers: [AuthController, MfaController, EmailController],
  providers: [
    AuthService,
    TokensService,
    SessionsService,
    PasswordService,
    MfaService,
    EmailService,
    AccountProtectionService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, TokensService, JwtModule, PassportModule],
})
export class AuthModule {}
