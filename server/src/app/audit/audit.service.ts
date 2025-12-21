// api/src/app/audit/audit.service.ts
import { Injectable, Logger } from '@nestjs/common';

export interface AuditEvent {
  ts: string;
  actorId: string;
  method: string;
  path: string;
  ip?: string;
  ua?: string;
  action?: string;
  durationMs?: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  async log(evt: AuditEvent) {
    // TODO: persist append‑only (DB/WORM/SIEM). Never store PHI payloads.
    this.logger.log(`[AUDIT] ${JSON.stringify(evt)}`);
  }
}