// api/src/app/auth/utils/crypto.ts
import { createHash, randomBytes } from 'crypto';
export const randomId = (len = 16) => randomBytes(len).toString('hex');
export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');