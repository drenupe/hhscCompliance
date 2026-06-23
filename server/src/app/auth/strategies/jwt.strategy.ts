import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
  roles?: string[];
  roleIds?: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'super-long-random-string',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      sub: payload.sub,
      userId: payload.sub,
      id: payload.sub,
      email: payload.email,
      roles: payload.roles ?? [],
      roleIds: payload.roleIds ?? payload.roles ?? [],
    };
  }
}