// api/src/app/common/decorators/ip.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const RequestIp = createParamDecorator((_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().ip);