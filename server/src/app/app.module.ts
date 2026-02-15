// server/src/app/app.module.ts
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
import { IssModule } from './iss/iss.module';
import { ConsumersModule } from './consumers/consumers.module';

import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { ProvidersModule } from './providers/providers.module';
import { RolesGuard } from './auth/roles.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { ComplianceResultsModule } from './compliance/compliance-results.module';
import { ComplianceEngineModule } from './compliance-engine/compliance-engine.module';



const NODE_ENV = process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], // Zod-based config loader
      envFilePath: [
        // Prefer env files colocated with the server app
        join(process.cwd(), `server/.env.${NODE_ENV}.local`),
        join(process.cwd(), `server/.env.${NODE_ENV}`),
        join(process.cwd(), 'server/.env'),

        // Fallback to workspace root env files
        join(process.cwd(), `.env.${NODE_ENV}.local`),
        join(process.cwd(), `.env.${NODE_ENV}`),
        join(process.cwd(), '.env'),
      ],
      // optional, but often helpful if you use ${VAR} references inside .env files
      expandVariables: true,
    }),

    // 🔌 DB connection (uses `configuration()` + async.config)
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),

    // Feature modules
    AuthModule,
    RaciModule,
    IssModule,
    ConsumersModule,
    ProvidersModule,
    DashboardModule,
    ComplianceResultsModule,
    ComplianceEngineModule
  ],
  controllers: [AppController],
  providers: [AppService,RolesGuard],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
