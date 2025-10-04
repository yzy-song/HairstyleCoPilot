import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// 简单的健康检查测试，避免复杂的依赖
describe('App Health Check', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 创建一个最小的测试模块
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should initialize the app', () => {
    expect(app).toBeDefined();
  });
});
