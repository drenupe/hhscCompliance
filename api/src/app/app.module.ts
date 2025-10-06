// api/src/app/app.module.ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { typeOrmAsyncConfig } from '../configuration/typeorm/async.config';

// import your modules as needed
 import { AuthModule } from './auth/auth.module';
 import { UsersModule } from './users/users.module';
 import { MetricsModule } from './observability/metrics/metrics.module';
 import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
 import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
 import { HttpErrorFilter } from './common/filters/http-exception.filter';
 import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { MetricsInterceptor } from './observability/metrics/metrics.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // app-specific first
        join(process.cwd(), `api/.env.${process.env.NODE_ENV}.local`),
        join(process.cwd(), `api/.env.${process.env.NODE_ENV}`),
        join(process.cwd(), 'api/.env'),
        // common fallbacks
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env',
      ],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),

    // Your feature modules
     AuthModule,
   //  UsersModule,
   //  MetricsModule,
  ],
  providers: [
  //   { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
  //   { provide: APP_FILTER, useClass: HttpErrorFilter },
  //   { provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor },
  ],
})
export class AppModule {
  // If you have a request-id middleware:
   configure(consumer: MiddlewareConsumer) {
     consumer.apply(RequestIdMiddleware).forRoutes('*');
   }
}
