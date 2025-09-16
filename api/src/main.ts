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
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // If running behind a proxy (Render, Nginx, Cloudflare), this is needed for secure cookies & real IPs.
  app.set('trust proxy', 1);

  // Versioning & prefix → /api/v1/*
  const globalPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Security + perf
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS (disabled unless explicitly configured to avoid "*" + credentials)
  const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN);
  app.enableCors({
    origin: allowedOrigins.length ? allowedOrigins : false,
    credentials: true,
  });

  // Validation + serialization
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

  // Swagger (disable in prod unless explicitly enabled)
  const enableSwagger =
    process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production';

  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      // 👇 Important: point Swagger to the versioned base so "Try it out" calls /api/v1/*
      .addServer(`/${globalPrefix}/v1`)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Base:  http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🔢 v1:    http://localhost:${port}/${globalPrefix}/v1`);
  if (enableSwagger)
    Logger.log(`📘 Docs: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
