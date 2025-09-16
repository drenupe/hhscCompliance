import { MiddlewareConsumer, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmAsyncConfig } from '../configuration/typeorm/async.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './common/filters/http-exception.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { MetricsModule } from './observability/metrics/metrics.module';
import { MetricsInterceptor } from './observability/metrics/metrics.interceptor';
import { join } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

const IS_TEST = process.env.NODE_ENV === 'test';

// Keep provider order, but only register MetricsInterceptor outside tests
const appProviders: Provider[] = [
  ...(!IS_TEST ? [{ provide: APP_INTERCEPTOR, useClass: MetricsInterceptor }] : []),
  { provide: APP_FILTER, useClass: HttpErrorFilter },
  { provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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

    // ✅ In tests use sqlite :memory:, otherwise use your existing async PG config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cs: ConfigService) => {
        if (IS_TEST) {
          return {
            type: 'sqlite' as const,
            database: ':memory:',
            dropSchema: true,
            autoLoadEntities: true,
            synchronize: true,
            logging: false,
            keepConnectionAlive: true, // smoother e2e runs
            retryAttempts: 1,          // fail fast on misconfig
          };
        }
        const factory = (typeOrmAsyncConfig as any)?.useFactory;
        return factory ? await factory(cs) : (typeOrmAsyncConfig as any);
      },
    }),

    // ⛔️ Skip metrics module in tests to reduce open handles
    ...(IS_TEST ? [] : [MetricsModule]),

    UsersModule,
    AuthModule,
    // AdminModule,
  ],
  providers: appProviders,
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
