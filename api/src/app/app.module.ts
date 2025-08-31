// apps/api/src/app/app.module.ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmAsyncConfig } from '../configuration/typeorm/async.config'; // See step 2
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './common/filters/http-exception.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { MetricsModule } from './observability/metrics/metrics.module';
import { MetricsInterceptor } from './observability/metrics/metrics.interceptor';
import { join } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- Ensures ConfigService is available app-wide
     envFilePath: [
    // app-specific paths first (override)
    join(process.cwd(), `api/.env.${process.env.NODE_ENV}.local`),
    join(process.cwd(), `api/.env.${process.env.NODE_ENV}`),
    join(process.cwd(), 'api/.env'),
    join(process.cwd(), `apps/api/.env.${process.env.NODE_ENV}.local`),
    join(process.cwd(), `apps/api/.env.${process.env.NODE_ENV}`),
    join(process.cwd(), 'apps/api/.env'),
    // fallbacks in repo root
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env',
  ],
     
    }),

    TypeOrmModule.forRootAsync(typeOrmAsyncConfig), // ✅ DI-aware setup
    MetricsModule,
    UsersModule, // Import your UsersModule here
    AuthModule, // Import your AuthModule here
   //AdminModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
