// api/src/app/common/middleware/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const header =
      (req.headers['x-request-id'] as string | undefined) ||
      (req.headers['x-requestid'] as string | undefined);
    const id = header || randomUUID();
    req.id = id;
    res.setHeader('X-Request-Id', id);
    next();
  }
}
