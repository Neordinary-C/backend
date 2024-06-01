import { Test, TestingModule } from '@nestjs/testing';
import { ShortsController } from './shorts.controller';

describe('ShortsController', () => {
  let controller: ShortsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortsController],
    }).compile();

    controller = module.get<ShortsController>(ShortsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
