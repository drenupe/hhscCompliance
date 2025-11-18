// api/src/app/app.module.ts
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

import { configuration } from '../configuration/configuration';
import { typeOrmAsyncConfig } from '../configuration/typeorm/async.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { RaciModule } from './raci/raci.module';
// import { UsersModule } from './users/users.module';
// import { MetricsModule } from './observability/metrics/metrics.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
// import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
// import { HttpErrorFilter } from './common/filters/http-exception.filter';
// import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
// import { MetricsInterceptor } from './observability/metrics/metrics.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],                  // 🔑 use your zod-based config
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

    // 🔌 DB connection (uses `configuration()` + async.config)
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),

    // feature modules
    AuthModule,
    RaciModule,
    // UsersModule,
    // MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
    // { provide: APP_FILTER, useClass: HttpErrorFilter },
    // { provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
