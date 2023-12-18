import { Test, TestingModule } from '@nestjs/testing';
import { DeedController } from './deed.controller';
import { DeedService } from './deed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Deed } from './entities/deed.entity';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';

describe('DeedController', () => {
  let controller: DeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeedController],
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

    controller = module.get<DeedController>(DeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
