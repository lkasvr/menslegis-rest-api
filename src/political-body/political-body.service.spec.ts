import { Test, TestingModule } from '@nestjs/testing';
import { PoliticalBodyService } from './political-body.service';

describe('PoliticalBodyService', () => {
  let service: PoliticalBodyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoliticalBodyService],
    }).compile();

    service = module.get<PoliticalBodyService>(PoliticalBodyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
