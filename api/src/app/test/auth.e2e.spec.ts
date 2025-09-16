// api/src/app/test/auth.e2e.spec.ts
// (keep the env + jest.setTimeout + bcrypt mock unchanged)

// Use CommonJS-style import so types line up with supertest's defs
import request = require('supertest');
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('Auth E2E (agent)', () => {
  let app: INestApplication;

  // 👇 Let TS infer the exact type that your supertest returns
  let agent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();

    const prefix = process.env.API_PREFIX || 'api';
    app.setGlobalPrefix(prefix);
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();

    // 👇 This now types correctly
    agent = request.agent(app.getHttpServer());
  }, 30000);

  afterAll(async () => {
    await app?.close();
  }, 15000);

  it('register → login → me', async () => {
    const base = `/${process.env.API_PREFIX || 'api'}/v1`;

    const email = `e2e_${Date.now()}@test.dev`;
    const password = 'Passw0rd!';

    await agent.post(`${base}/auth/register`).send({ email, password }).expect(201);

    const { body } = await agent.post(`${base}/auth/login`).send({ email, password }).expect(200);
    const access = body.accessToken as string;

    await agent.get(`${base}/auth/me`).set('Authorization', `Bearer ${access}`).expect(200);
    }, 30000);
});
