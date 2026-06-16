import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { In, Repository } from 'typeorm';

import { RoleEntity } from '../../security/entities/role.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(RoleEntity)
    private readonly rolesRepo: Repository<RoleEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ??
        process.env.JWT_SECRET ??
        'dev-secret-change-me',
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    roles?: string[];
  }) {
    const roles = payload.roles ?? [];

    const roleEntities = roles.length
      ? await this.rolesRepo.find({
          where: {
            name: In(roles),
            status: 'ACTIVE',
          },
        })
      : [];

    return {
      id: payload.sub,
      sub: payload.sub,
      email: payload.email,
      roles,
      roleIds: roleEntities.map((role) => role.id),
    };
  }
}