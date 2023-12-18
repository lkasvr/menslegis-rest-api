import { Test, TestingModule } from '@nestjs/testing';
import { DeedService } from './deed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Deed } from './entities/deed.entity';
import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';

describe('DeedService', () => {
  let service: DeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeedService,
        {
          provide: getRepositoryToken(Deed),
          useValue: {},
        },
        {
          provide: getRepositoryToken(DeedType),
          useValue: {},
        },
        {
          provide: getRepositoryToken(DeedSubtype),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeedService>(DeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
