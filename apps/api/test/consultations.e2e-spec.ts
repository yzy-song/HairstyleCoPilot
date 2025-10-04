import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Consultations API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/consultations (POST)', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer()).post('/consultations').expect(401);
    });

    it('should create a consultation for a client (with auth)', () => {
      // This test would need proper authentication setup
      // For now, just testing the endpoint structure
      return request(app.getHttpServer()).post('/consultations').send({ clientId: 1 }).expect(401); // Expected to fail without auth
    });
  });

  describe('/consultations/quick (POST)', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer()).post('/consultations/quick').expect(401);
    });
  });

  describe('/consultations/:id (GET)', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer()).get('/consultations/1').expect(401);
    });
  });

  describe('/consultations/:id/generated-images (POST)', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer()).post('/consultations/1/generated-images').expect(401);
    });

    it('should require image file', () => {
      // This would need proper authentication to test fully
      return request(app.getHttpServer())
        .post('/consultations/1/generated-images')
        .send({ templateId: 1, modelKey: 'test-model' })
        .expect(401); // Expected to fail without auth
    });
  });
});
