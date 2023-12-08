import { Test, TestingModule } from '@nestjs/testing';
import { DeedTypeController } from './deed-type.controller';
import { DeedTypeService } from './deed-type.service';

describe('DeedTypeController', () => {
  let controller: DeedTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeedTypeController],
      providers: [DeedTypeService],
    }).compile();

    controller = module.get<DeedTypeController>(DeedTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
