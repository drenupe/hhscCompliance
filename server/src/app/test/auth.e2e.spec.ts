import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';

describe('Auth E2E (agent)', () => {
  let app: INestApplication;
  let agent: ReturnType<typeof request.agent>;
  let ds: DataSource;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.setGlobalPrefix(process.env.API_PREFIX || 'api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    ds = app.get(DataSource);
    await ds.query(
      `TRUNCATE TABLE refresh_tokens, user_sessions, users, login_attempts RESTART IDENTITY CASCADE;`
    );

    agent = request.agent(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('register → login → me', async () => {
    const email = `e2e_${Date.now()}@test.local`;
    const password = 'Passw0rd!';

    await agent.post('/api/auth/register').send({ email, password }).expect(201);

    const { body } = await agent.post('/api/auth/login').send({ email, password }).expect(200);
    const access = body.accessToken as string;

    await agent.get('/api/auth/me').set('Authorization', `Bearer ${access}`).expect(200);
  });
});
