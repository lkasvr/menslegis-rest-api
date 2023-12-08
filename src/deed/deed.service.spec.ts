import { Test, TestingModule } from '@nestjs/testing';
import { DeedService } from './deed.service';

describe('DeedService', () => {
  let service: DeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeedService],
    }).compile();

    service = module.get<DeedService>(DeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
