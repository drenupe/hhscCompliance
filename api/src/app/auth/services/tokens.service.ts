// api/src/app/auth/services/tokens.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

type RefreshPayload = { sub: string; sid: string; tid: string };
type AccessPayload  = { sub: string; sid: string; roles?: string[] };

@Injectable()
export class TokensService {
  constructor(
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
    @InjectRepository(RefreshToken) private readonly rtRepo: Repository<RefreshToken>,
  ) {}

  private get accessSecret()  { return this.cfg.get<string>('JWT_SECRET')!; }
  private get refreshSecret() { return this.cfg.get<string>('JWT_REFRESH_SECRET') ?? this.accessSecret; }
  private get accessTtl()     { return this.cfg.get<string>('JWT_EXPIRES_IN') ?? '15m'; }
  private get refreshDays()   { return Number(this.cfg.get('REFRESH_TTL_DAYS') ?? 7); }

  async signAccess(payload: AccessPayload) {
    return this.jwt.signAsync(payload, { secret: this.accessSecret, expiresIn: this.accessTtl });
  }

  async issueRefresh(sessionId: string, userId: string) {
    const tid = randomUUID();
    const jwt = await this.jwt.signAsync(
      { sub: userId, sid: sessionId, tid } as RefreshPayload,
      { secret: this.refreshSecret, expiresIn: `${this.refreshDays}d` },
    );
    const tokenHash = await bcrypt.hash(jwt, 12);

    // Insert a complete row with tokenHash set (NOT NULL satisfied)
    await this.rtRepo.insert({
      id: tid,
      userId,
      sessionId,
      tokenHash,
      expiresAt: new Date(Date.now() + this.refreshDays * 24 * 60 * 60 * 1000),
      // add userAgent/ip if you have them at callsite
    } as any);

    return { token: jwt, record: { id: tid } };
  }

  async rotateRefresh(presented: string) {
    const decoded = await this.jwt.verifyAsync<RefreshPayload>(presented, { secret: this.refreshSecret });

    const current = await this.rtRepo.findOneBy({ id: decoded.tid, sessionId: decoded.sid });
    if (!current) throw new Error('Refresh token not found');

    const ok = await bcrypt.compare(presented, current.tokenHash);
    if (!ok) throw new Error('Refresh token mismatch');

    const newTid = randomUUID();
    const nextJwt = await this.jwt.signAsync(
      { sub: decoded.sub, sid: decoded.sid, tid: newTid } as RefreshPayload,
      { secret: this.refreshSecret, expiresIn: `${this.refreshDays}d` },
    );
    const nextHash = await bcrypt.hash(nextJwt, 12);

    await this.rtRepo.update({ id: decoded.tid }, { rotatedAt: new Date() });
    await this.rtRepo.insert({
      id: newTid,
      userId: current.userId,
      sessionId: decoded.sid,
      tokenHash: nextHash,
      expiresAt: new Date(Date.now() + this.refreshDays * 24 * 60 * 60 * 1000),
    } as any);

    return { decoded, next: { token: nextJwt, id: newTid } };
  }

  async revokeSessionTokens(sessionId: string) {
    await this.rtRepo.update({ sessionId, revokedAt: null }, { revokedAt: new Date() });
  }
}
