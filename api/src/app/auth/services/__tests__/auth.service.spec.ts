// api/src/app/test/auth.e2e.spec.ts
jest.mock('bcrypt', () => ({
  hash: async (d: any) => `h:${d}`,
  compare: async (p: any, s: any) => s === `h:${p}`,
}));

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-access';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh';
process.env.JWT_EXPIRES_IN = '15m';
process.env.REFRESH_TTL_DAYS = '7';
process.env.API_PREFIX = 'api';
process.env.ENABLE_SWAGGER = 'false';

jest.setTimeout(30000);

import request from 'supertest';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';

describe('Auth E2E (agentless)', () => {
  let app: INestApplication;
  let server: any; // avoid supertest typings entirely

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();

    const prefix = process.env.API_PREFIX || 'api';
    app.setGlobalPrefix(prefix);
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register → login → me', async () => {
    const base = `/${process.env.API_PREFIX || 'api'}/v1`;
    const email = `e2e_${Date.now()}@test.dev`;
    const password = 'Passw0rd!';

    await request(server).post(`${base}/auth/register`).send({ email, password }).expect(201);

    const login = await request(server).post(`${base}/auth/login`).send({ email, password }).expect(200);
    const access = login.body.accessToken as string;

    await request(server)
      .get(`${base}/auth/me`)
      .set('Authorization', `Bearer ${access}`)
      .expect(200);
  });
});
