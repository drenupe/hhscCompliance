// api/src/app/auth/services/tokens.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface IssueTokensInput { userId: string; sessionId: string; }
export interface Tokens { accessToken: string; refreshToken: string; }

@Injectable()
export class TokensService {
  constructor(private jwt: JwtService, private cs: ConfigService) {}

  async issue(input: IssueTokensInput): Promise<Tokens> {
    const accessToken = await this.jwt.signAsync({ sub: input.userId, sid: input.sessionId });
    const refreshToken = await this.signRefresh({ sub: input.userId, sid: input.sessionId, typ: 'refresh' });
    return { accessToken, refreshToken };
  }

  async rotate(oldRefresh: string, _meta: { ip?: string; ua?: string }): Promise<Tokens> {
    // TODO: verify old, check reuse, revoke if needed, create new chain
    const payload = await this.jwt.verifyAsync(oldRefresh, { secret: this.cs.get<string>('JWT_REFRESH_SECRET') });
    const accessToken = await this.jwt.signAsync({ sub: payload.sub, sid: payload.sid });
    const refreshToken = await this.signRefresh({ sub: payload.sub, sid: payload.sid, typ: 'refresh' });
    return { accessToken, refreshToken };
  }

  private signRefresh(payload: any) {
    return this.jwt.signAsync(payload, {
      secret: this.cs.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.cs.get<string>('REFRESH_TOKEN_TTL') ?? '30d',
    });
  }
}