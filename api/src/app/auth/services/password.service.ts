// api/src/app/auth/services/password.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly rounds = parseInt(process.env.PASSWORD_HASH_ROUNDS ?? '12', 10);

  async hash(plain: string) { return bcrypt.hash(plain, this.rounds); }
  async compare(plain: string, hash: string) { return bcrypt.compare(plain, hash); }

  // Reset flow placeholders — wire to EmailService + repository
  async requestReset(email: string) { /* issue token, email it, store hash */ return { requested: true }; }
  async resetPassword(token: string, newPassword: string) { /* verify token, update user */ return { success: true }; }
}