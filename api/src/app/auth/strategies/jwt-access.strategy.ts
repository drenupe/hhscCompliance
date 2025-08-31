// api/src/app/auth/strategies/jwt-access.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

type AccessPayload = { sub: string; sid: string; roles?: string[] };

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_SECRET'),
      clockTolerance: 5,
    });
  }
  validate(p: AccessPayload) {
    // This becomes req.user
    return { sub: p.sub, sid: p.sid, roles: p.roles ?? [] };
  }
}
