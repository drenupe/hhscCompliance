// api/src/app/hipaa/hipaa.module.ts
import { Module } from '@nestjs/common';
import { SafeExceptionFilter } from './filters/safe-exception.filter';
import { PhiRedactInterceptor } from './interceptors/phi-redact.interceptor';

@Module({ providers: [PhiRedactInterceptor, SafeExceptionFilter], exports: [PhiRedactInterceptor, SafeExceptionFilter] })
export class HIPAAModule {}