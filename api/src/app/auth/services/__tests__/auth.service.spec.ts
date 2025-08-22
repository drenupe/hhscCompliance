// api/src/app/auth/services/__tests__/auth.service.spec.ts
import { UsersService } from '../../../users/services/users.service';
import { AuthService } from '../auth.service';
import { PasswordService } from '../password.service';
import { SessionsService } from '../sessions.service';
import { TokensService } from '../tokens.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  const users: Partial<UsersService> = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };
  const sessions: Partial<SessionsService> = {
    create: jest.fn().mockResolvedValue({ id: 'sid-1' }),
  };
  const tokens: Partial<TokensService> = {
    signAccess: jest.fn().mockResolvedValue('access.jwt'),
    issueRefresh: jest.fn().mockResolvedValue({ token: 'refresh.jwt', record: { id: 'tid-1' } }),
  };
  const passwords = new PasswordService();

  const svc = new AuthService(
    passwords as any,
    sessions as any,
    tokens as any,
    users as any,
  );

  beforeEach(() => jest.clearAllMocks());

  it('registers when email unused', async () => {
    (users.findByEmail as jest.Mock).mockResolvedValue(null);
    (users.createUser as jest.Mock).mockImplementation(async (email: string, passwordHash: string) => ({
      id: 'u1', email, passwordHash, roles: ['user'],
    }));

    const u = await svc.register('a@b.com', 'StrongPassw0rd!');
    expect(u.id).toBe('u1');
    expect(users.createUser).toHaveBeenCalled();
  });

  it('throws on duplicate email', async () => {
    (users.findByEmail as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.com', passwordHash: 'x' });
    await expect(svc.register('a@b.com', 'x')).rejects.toBeInstanceOf(ConflictException);
  });

  it('validates user credentials', async () => {
    const hash = await passwords.hash('Pa$$w0rd!');
    (users.findByEmail as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.com', passwordHash: hash });

    const u = await svc.validateUser('a@b.com', 'Pa$$w0rd!');
    expect(u.id).toBe('u1');
  });

  it('rejects invalid password', async () => {
    const hash = await passwords.hash('correct');
    (users.findByEmail as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.com', passwordHash: hash });
    await expect(svc.validateUser('a@b.com', 'wrong')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('issues tokens for user', async () => {
    const out = await svc.issueTokensForUser('u1', { ip: '1.2.3.4', ua: 'jest' });
    expect(out).toEqual({ accessToken: 'access.jwt', refreshToken: 'refresh.jwt', sessionId: 'sid-1' });
  });
});
