import { Test, TestingModule } from '@nestjs/testing';
import { DeedSubtypeController } from './deed-subtype.controller';
import { DeedSubtypeService } from './deed-subtype.service';

describe('DeedSubtypeController', () => {
  let controller: DeedSubtypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeedSubtypeController],
      providers: [DeedSubtypeService],
    }).compile();

    controller = module.get<DeedSubtypeController>(DeedSubtypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
