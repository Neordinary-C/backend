import { Test, TestingModule } from '@nestjs/testing';
import { ShortsService } from './shorts.service';

describe('ShortsService', () => {
  let service: ShortsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortsService],
    }).compile();

    service = module.get<ShortsService>(ShortsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
