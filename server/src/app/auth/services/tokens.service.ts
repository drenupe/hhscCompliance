import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(params: {
    userId: string;
    email: string;
    roles?: string[];
  }): Promise<string> {
    return this.jwtService.signAsync({
      sub: params.userId,
      email: params.email,
      roles: params.roles ?? [],
    });
  }
}