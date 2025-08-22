// api/src/app/auth/strategies/jwt-refresh.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(cfg: ConfigService) {
    const secret =
      cfg.get<string>('JWT_REFRESH_SECRET') ??
      cfg.get<string>('JWT_SECRET') ??            // fallback for convenience
      cfg.get<string>('jwt.refreshSecret');

    if (!secret) throw new Error('JWT_REFRESH_SECRET / JWT_SECRET missing');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
}