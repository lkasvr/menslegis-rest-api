import { Test, TestingModule } from '@nestjs/testing';
import { DeedSubtypeService } from './deed-subtype.service';

describe('DeedSubtypeService', () => {
  let service: DeedSubtypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeedSubtypeService],
    }).compile();

    service = module.get<DeedSubtypeService>(DeedSubtypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
