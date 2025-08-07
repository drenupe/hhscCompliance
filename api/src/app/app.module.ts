// apps/api/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmAsyncConfig } from '../configuration/typeorm/async.config'; // See step 2

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- Ensures ConfigService is available app-wide
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    TypeOrmModule.forRootAsync(typeOrmAsyncConfig), // ✅ DI-aware setup
  ],
})
export class AppModule {}
