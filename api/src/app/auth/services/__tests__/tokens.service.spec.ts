// api/src/app/auth/services/__tests__/tokens.service.spec.ts
jest.mock('bcrypt', () => ({
  hash: async (data: any) => `h:${data}`,
  compare: async (presented: any, stored: any) => stored === `h:${presented}`,
}));

import { TokensService } from '../tokens.service';

/** Repo mock compatible with TokensService (insert/findOneBy/update) */
function makeRepo() {
  const rows: any[] = [];
  return {
    _rows: rows,
    async insert(row: any) {
      const id = row.id ?? `tid-${rows.length + 1}`;
      rows.push({
        id,
        userId: row.userId,
        sessionId: row.sessionId,
        tokenHash: row.tokenHash,
        expiresAt: row.expiresAt ?? new Date(Date.now() + 7 * 864e5),
        revokedAt: row.revokedAt ?? null,
        rotatedAt: row.rotatedAt ?? null,
        createdAt: row.createdAt ?? new Date(),
      });
      return { identifiers: [{ id }] };
    },
    async findOneBy(where: any) {
      const { id, sessionId } = where ?? {};
      return rows.find((r) => {
        const idOk = id ? r.id === id : true;
        const sidOk = sessionId ? r.sessionId === sessionId : true;
        return idOk && sidOk;
      });
    },
    async update(criteria: any, patch: any) {
      rows.forEach((r, i) => {
        const idOk = criteria.id ? r.id === criteria.id : true;
        const sidOk = criteria.sessionId ? r.sessionId === criteria.sessionId : true;
        if (idOk && sidOk) rows[i] = { ...r, ...patch };
      });
    },
  };
}

describe('TokensService (refresh rotation)', () => {
  const tokenMap = new Map<string, any>();
  let seq = 0;

  const jwt = {
    signAsync: jest.fn(async (payload: any) => {
      const token = `tok-${++seq}`;
      tokenMap.set(token, { ...payload });
      return token;
    }),
    verifyAsync: jest.fn(async (token: string) => {
      const payload = tokenMap.get(token);
      if (!payload) throw new Error('unknown token');
      return { ...payload };
    }),
  } as any;

  const cfg = {
    get: (k: string) =>
      ({
        JWT_SECRET: 'test-access',
        JWT_REFRESH_SECRET: 'test-refresh',
        JWT_EXPIRES_IN: '15m',
        REFRESH_TTL_DAYS: 7,
      } as Record<string, any>)[k],
  } as any;

  const repo = makeRepo() as any;
  const svc = new TokensService(jwt, cfg, repo);

  beforeEach(() => {
    tokenMap.clear();
    repo._rows.length = 0;
    seq = 0;
    jest.clearAllMocks();
  });

  it('rotates a refresh token and can rotate again from the new token', async () => {
    const issued = await svc.issueRefresh('sid-1', 'user-1');
    const original = issued.token;

    const { next, decoded } = await svc.rotateRefresh(original);
    expect(decoded.sid).toBe('sid-1');

    const oldRow = repo._rows.find((r: any) => r.id === decoded.tid);
    expect(oldRow?.rotatedAt).toBeTruthy();

    const rotatedAgain = await svc.rotateRefresh(next.token);
    expect(rotatedAgain.next.token).toMatch(/^tok-/);
  });
});
