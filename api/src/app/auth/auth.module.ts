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

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: cs.get<string>('ACCESS_TOKEN_TTL') ?? '15m' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserSession, RefreshToken, EmailVerification, PasswordReset, MfaSecret]),
  ],
  controllers: [AuthController, MfaController, EmailController],
  providers: [
    AuthService,
    TokensService,
    SessionsService,
    PasswordService,
    MfaService,
    EmailService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, TokensService, JwtModule, PassportModule],
})
export class AuthModule {}