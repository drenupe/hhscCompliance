// api/src/app/auth/types/claims.ts
export type AccessJwtClaims = { sub: string; sid: string; roles?: string[] };
export type RefreshJwtClaims = { sub: string; sid: string; typ: 'refresh' };