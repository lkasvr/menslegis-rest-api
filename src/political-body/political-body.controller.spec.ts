import { Test, TestingModule } from '@nestjs/testing';
import { PoliticalBodyController } from './political-body.controller';
import { PoliticalBodyService } from './political-body.service';

describe('PoliticalBodyController', () => {
  let controller: PoliticalBodyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoliticalBodyController],
      providers: [PoliticalBodyService],
    }).compile();

    controller = module.get<PoliticalBodyController>(PoliticalBodyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
