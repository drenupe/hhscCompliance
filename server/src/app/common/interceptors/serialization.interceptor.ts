import { CallHandler, ExecutionContext, Injectable, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AppSerializationInterceptor extends ClassSerializerInterceptor {
  constructor(reflector: Reflector) {
    super(reflector);
  }
  intercept(context: ExecutionContext, next: CallHandler) {
    return super.intercept(context, next);
  }
}
