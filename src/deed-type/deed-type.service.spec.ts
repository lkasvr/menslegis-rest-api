import { Test, TestingModule } from '@nestjs/testing';
import { DeedTypeService } from './deed-type.service';

describe('DeedTypeService', () => {
  let service: DeedTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeedTypeService],
    }).compile();

    service = module.get<DeedTypeService>(DeedTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
