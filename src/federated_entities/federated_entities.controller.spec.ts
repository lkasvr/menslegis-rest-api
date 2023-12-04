import { Test, TestingModule } from '@nestjs/testing';
import { FederatedEntitiesController } from './federated_entities.controller';
import { FederatedEntitiesService } from './federated_entities.service';

describe('FederatedEntitiesController', () => {
  let controller: FederatedEntitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FederatedEntitiesController],
      providers: [FederatedEntitiesService],
    }).compile();

    controller = module.get<FederatedEntitiesController>(
      FederatedEntitiesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
