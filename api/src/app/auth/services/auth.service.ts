// api/src/app/auth/services/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { SessionsService } from './sessions.service';
import { TokensService } from './tokens.service';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';

type TokenBundle = {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
};

type IssueMeta = {
  ip?: string;
  ua?: string;
  roles?: string[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly passwords: PasswordService,
    private readonly sessions: SessionsService,
    private readonly tokens: TokensService,
    private readonly users: UsersService,
  ) {}

  /** Register a new user (throws 409 if email already exists). */
  async register(email: string, password: string): Promise<User> {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await this.passwords.hash(password);
    return this.users.createUser(email, passwordHash);
  }

  /** Validate email/password (throws 401 if invalid). */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.passwords.verify(password, (user as User).passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  /**
   * Issue access/refresh tokens for a user.
   * IMPORTANT: TokensService MUST hash & persist the refresh token (tokenHash NOT NULL).
   */
  async issueTokensForUser(userId: string, meta: IssueMeta): Promise<TokenBundle> {
    const session = await this.sessions.create(userId, { ip: meta.ip, ua: meta.ua });

    // Access token (roles default to [])
    const accessToken = await this.tokens.signAccess({
      sub: userId,
      sid: session.id,
      roles: meta.roles ?? [],
    });

    // Refresh token – MUST be hashed & stored by TokensService to avoid DB NOT NULL errors.
    // Ensure your TokensService.issueRefresh(...) persists tokenHash to the refresh_tokens table.
    const { token: refreshToken } = await this.tokens.issueRefresh(session.id, userId);

    return { accessToken, refreshToken, sessionId: session.id };
  }

  /** Rotate refresh token and return fresh access + refresh. */
// AuthService.refresh
async refresh(presentedRefresh: string) {
  const { next, decoded } = await this.tokens.rotateRefresh(presentedRefresh);
  // Refresh payload is minimal: { sub, sid }
  const user = await this.users.findById(decoded.sub); // or getRoles(decoded.sub)
  const roles = (user as User)?.roles ?? [];           // adjust to your user shape

  const access = await this.tokens.signAccess({
    sub: decoded.sub,
    sid: decoded.sid,
    roles,
  });

  return { accessToken: access, refreshToken: next.token };
}


  /** Revoke a session and all associated refresh tokens. */
  async logout(sessionId: string): Promise<{ success: true }> {
    await this.sessions.revoke(sessionId);
    await this.tokens.revokeSessionTokens(sessionId);
    return { success: true };
  }

  /** Convenience: full login flow (optional helper). */
  async login(email: string, password: string, meta: IssueMeta): Promise<TokenBundle> {
    const user = await this.validateUser(email, password);
    return this.issueTokensForUser((user as User).id, meta);
  }
}
