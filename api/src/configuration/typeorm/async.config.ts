// apps/api/src/config/typeorm/async.config.ts
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const isProd = configService.get<string>('NODE_ENV') === 'production';

    return {
      type: 'postgres',
      url: configService.get<string>('DATABASE_URL'),
      autoLoadEntities: true,
      synchronize: false, // Always false in production
      ssl: isProd
        ? { rejectUnauthorized: false }
        : false,
    };
  },
};
