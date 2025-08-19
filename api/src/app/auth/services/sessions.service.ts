// api/src/app/auth/services/sessions.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsService {
  async create(userId: string, _meta: { ip?: string; ua?: string; deviceName?: string }) {
    // TODO: persist to DB; return session and family ids
    return { id: `sess_${Date.now()}`, familyId: `fam_${userId}` };
  }
  async revoke(_sessionId: string) { /* TODO */ }
  async revokeFamily(_familyId: string) { /* TODO */ }
  async enforceMaxDevices(_userId: string) { /* TODO */ }
  async flagReuse(_familyId: string, _evidence: any) { /* TODO */ }
}