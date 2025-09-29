// api/src/main.ts
import 'reflect-metadata';
import {
  Logger,
  ValidationPipe,
  VersioningType,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

function parseOrigins(csv?: string): (string | RegExp)[] {
  if (!csv) return [];
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      // allow regex notation:  /^https:\/\/.*\.example\.com$/
      if (s.startsWith('/') && s.endsWith('/')) {
        try {
          const body = s.slice(1, -1);
          return new RegExp(body);
        } catch {
          return s;
        }
      }
      return s;
    });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const globalPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  // basic hardening & perf
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // versioning (URL style: /v1/*)
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  // serialization & validation
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
    }),
  );

  // CORS allowlist
  const origins = [
    ...parseOrigins(process.env.CORS_ORIGINS),
    ...(process.env.NODE_ENV === 'development'
      ? ['http://localhost:4200', 'http://127.0.0.1:4200']
      : []),
  ];
  app.enableCors({
    origin: origins.length ? origins : true, // default to all in dev if nothing set
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
  });

  // trust proxy if behind Vercel/Render or a proxy
  try {
    const express = app.getHttpAdapter().getInstance();
    if (express?.set) express.set('trust proxy', 1);
  } catch {
    /* noop */
  }

  // Swagger (toggle via ENV)
  const enableSwagger =
    (process.env.ENABLE_SWAGGER ?? '').toLowerCase() === 'true' ||
    process.env.NODE_ENV !== 'production';

  if (enableSwagger) {
    const cfg = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer(`/${globalPrefix}`)
      .build();

    const doc = SwaggerModule.createDocument(app, cfg);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, doc);
  }

  // graceful shutdown
  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 App:  http://localhost:${port}/${globalPrefix}`);
  if (enableSwagger) {
    Logger.log(`📘 Docs: http://localhost:${port}/${globalPrefix}/docs`);
  }
}

bootstrap();
