// api/src/app/authorization/guards/policies.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PoliciesGuard implements CanActivate {
  // Wire your CASL ability or custom policy checks here
  canActivate(_ctx: ExecutionContext): boolean { return true; }
}