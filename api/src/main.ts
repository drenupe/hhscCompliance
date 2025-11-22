// api/src/main.ts
import {
  Logger,
  ValidationPipe,
  VersioningType,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

function parseOrigins(csv?: string): string[] {
  return (csv ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: true,
    });

    app.set('trust proxy', 1);

    const globalPrefix = process.env.API_PREFIX || 'api';
    app.setGlobalPrefix(globalPrefix);
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);
    app.enableCors({
      origin: allowedOrigins.length ? allowedOrigins : false,
      credentials: true,
    });

    

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    const enableSwagger =
      process.env.ENABLE_SWAGGER === 'true' ||
      process.env.NODE_ENV !== 'production';

    if (enableSwagger) {
      const config = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer(`/${globalPrefix}`)
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
    }

    app.enableShutdownHooks();

    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port, '0.0.0.0');

    Logger.log(`🚀 App:  http://localhost:${port}/${globalPrefix}`);
    if (enableSwagger) {
      Logger.log(`📘 Docs: http://localhost:${port}/${globalPrefix}/docs`);
    }
  } catch (err) {
    // 🔥 THIS WILL SHOW YOU WHY IT'S CRASHING
    Logger.error('❌ Nest failed to start', err);
    // Make sure the process exits non-zero
    process.exit(1);
  }
}

bootstrap();
