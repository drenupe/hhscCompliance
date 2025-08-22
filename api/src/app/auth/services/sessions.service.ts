// api/src/app/auth/services/sessions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { UserSession } from '../entities/user-session.entity';

@Injectable()
export class SessionsService {
  constructor(@InjectRepository(UserSession) private repo: Repository<UserSession>) {}

  create(userId: string, meta: { ip?: string; ua?: string }) {
    const s = this.repo.create({ userId, ip: meta.ip, userAgent: meta.ua });
    return this.repo.save(s);
  }
  revoke(sessionId: string) {
    return this.repo.update({ id: sessionId, revokedAt: IsNull() }, { revokedAt: new Date() });
  }
  revokeAllForUser(userId: string) {
    return this.repo.update({ userId, revokedAt: IsNull() }, { revokedAt: new Date() });
  }
  findActiveById(id: string) {
    return this.repo.findOne({ where: { id, revokedAt: IsNull() } });
  }
}
