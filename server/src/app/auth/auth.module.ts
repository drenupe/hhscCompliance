import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from '../security/entities/role.entity';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PasswordService } from './services/password.service';
import { TokensService } from './services/tokens.service';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,

    TypeOrmModule.forFeature([
      RoleEntity,
    ]),

    PassportModule,

    JwtModule.register({
      secret:
        process.env.JWT_SECRET ??
        'dev-secret-change-me',

      signOptions: {
        expiresIn: '8h',
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    PasswordService,
    TokensService,
    JwtStrategy,
  ],

  exports: [
    AuthService,
    PasswordService,
    TokensService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}