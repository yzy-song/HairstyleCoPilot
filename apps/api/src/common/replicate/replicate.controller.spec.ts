import { Test, TestingModule } from '@nestjs/testing';
import { ReplicateController } from './replicate.controller';

describe('ReplicateController', () => {
  let controller: ReplicateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReplicateController],
    }).compile();

    controller = module.get<ReplicateController>(ReplicateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
