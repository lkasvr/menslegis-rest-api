import { Test, TestingModule } from '@nestjs/testing';
import { DeedController } from './deed.controller';
import { DeedService } from './deed.service';

describe('DeedController', () => {
  let controller: DeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeedController],
      providers: [DeedService],
    }).compile();

    controller = module.get<DeedController>(DeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
