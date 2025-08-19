import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { SessionsService } from './sessions.service';
import { PasswordService } from './password.service';
import { UsersService } from '../../users/services/users.services';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private passwords: PasswordService,
    private tokens: TokensService,
    private sessions: SessionsService,
  ) {}

  /** Used by LocalStrategy. Validates credentials and returns a minimal user shape */
  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await this.passwords.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return { id: user.id, email: user.email, roles: (user as any).roles ?? [] };
  }

  /** Enterprise: issue tokens after successful guard-authenticated login */
  async issueTokensForUser(userId: string, meta?: { ip?: string; ua?: string }) {
    const session = await this.sessions.create(userId, { ip: meta?.ip, ua: meta?.ua });
    const tokens = await this.tokens.issue({ userId, sessionId: session.id });
    return { ...tokens };
  }

  /** Legacy direct login (still usable if you call it elsewhere) */
  async login(dto: { email: string; password: string }) {
    const user = await this.validateUser(dto.email, dto.password);
    return this.issueTokensForUser(user.id);
  }

  async refresh(refreshToken: string) {
    return this.tokens.rotate(refreshToken, {});
  }

  async refreshWithMeta(refreshToken: string, meta?: { ip?: string; ua?: string }) {
    // Hook for anomaly detection: compare meta with session/device data
    return this.tokens.rotate(refreshToken, { ip: meta?.ip, ua: meta?.ua });
  }

  async logoutCurrentSession() {
    // TODO: extract sessionId from request context and revoke it
    return { success: true };
  }
}
