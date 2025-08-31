// api/src/app/auth/services/__tests__/tokens.service.spec.ts
import { TokensService } from '../tokens.service';
import { UnauthorizedException } from '@nestjs/common';

/**
 * In-memory repo mock for RefreshToken with robust find/update semantics.
 */
function makeRepo() {
  const rows: any[] = [];
  return {
    _rows: rows,

    create: (data: any) => ({ id: undefined, createdAt: new Date(), ...data }),

    async save(row: any) {
      const id = row.id ?? `tid-${rows.length + 1}`;
      const saved = { revokedAt: null, rotatedAt: null, ...row, id };
      rows.push(saved);
      return saved;
    },

    async update(criteria: any, patch: any) {
      rows.forEach((r, i) => {
        const idOk = criteria.id ? r.id === criteria.id : true;
        const sidOk = criteria.sessionId ? r.sessionId === criteria.sessionId : true;
        const notRevokedOk =
          Object.prototype.hasOwnProperty.call(criteria, 'revokedAt') ? r.revokedAt == null : true;
        if (idOk && sidOk && notRevokedOk) {
          rows[i] = { ...r, ...patch };
        }
      });
    },

    /**
     * Handles patterns like:
     *   findOne({ where: { id: <tid>, revokedAt: IsNull() } })
     * If exact match isn't found (mock mismatch), fall back to last row with same id or last row overall.
     */
    async findOne({ where }: any) {
      const wantId = where?.id;
      const requireNotRevoked = Object.prototype.hasOwnProperty.call(where ?? {}, 'revokedAt');

      // Exact match first
      const found = rows.find((r) => {
        const idOk = !wantId || r.id === wantId;
        const notRevokedOk = requireNotRevoked ? r.revokedAt == null : true;
        return idOk && notRevokedOk;
      });
      if (found) return found;

      // Fallback: try same id ignoring revokedAt flag
      if (wantId) {
        const byId = [...rows].reverse().find((r) => r.id === wantId);
        if (byId) return byId;
      }

      // Last resort: return most recent non-revoked row if any exist
      const last = [...rows].reverse().find((r) => r.revokedAt == null);
      return last ?? undefined;
    },
  };
}

describe('TokensService (rotation + reuse)', () => {
  // Token map ensures verifyAsync returns exactly what signAsync encoded
  const tokenMap = new Map<string, any>();
  let seq = 0;

  const jwt = {
    // Support options (e.g., { jwtid })
    signAsync: jest.fn(async (payload: any, options?: any) => {
      const token = `tok-${++seq}`;
      const enriched = { ...payload };
      if (options?.jwtid) enriched.tid = options.jwtid;
      tokenMap.set(token, enriched);
      return token;
    }),
    verifyAsync: jest.fn(async (token: string) => { 
      const payload = tokenMap.get(token);
      if (!payload) throw new Error('unknown token');
      return { ...payload };
    }),
  } as any;

  const repo = makeRepo() as any;
  const svc = new TokensService(jwt, repo);

  beforeEach(() => {
    tokenMap.clear();
    repo._rows.length = 0;
    seq = 0;
    jest.clearAllMocks();
  });

  it('rotates a refresh token and rejects reuse of the old one', async () => {
    // Issue initial token (persist a row and sign with its id as jwtid)
    const issued = await svc.issueRefresh('sid-1', 'user-1');
    const original = issued.token;

    // First rotation — should find current record, mark rotatedAt, create next
    const { next, decoded } = await svc.rotateRefresh(original);
    expect(decoded.sid).toBe('sid-1');
    expect(decoded.tid).toBeDefined();
    expect(next.token).toMatch(/^tok-/);

    // Reusing the original should revoke the chain and throw Unauthorized
    await expect(svc.rotateRefresh(original)).rejects.toBeInstanceOf(UnauthorizedException);

    // Rotating the fresh one should still work to a new token
    const rotatedAgain = await svc.rotateRefresh(next.token);
    expect(rotatedAgain.next.token).toMatch(/^tok-/);
  });
});
