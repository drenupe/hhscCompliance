// api/src/app/auth/services/password.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 12);

@Injectable()
export class PasswordService {
  async hash(plain: string) {
    return bcrypt.hash(plain, ROUNDS);
  }
  async verify(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}
