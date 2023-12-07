import { Test, TestingModule } from '@nestjs/testing';
import { FederatedEntitiesController } from './federated_entities.controller';
import { FederatedEntitiesService } from './federated_entities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FederatedEntity } from './entities/federated_entity.entity';

describe('FederatedEntitiesController', () => {
  let controller: FederatedEntitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FederatedEntitiesController],
      providers: [
        FederatedEntitiesService,
        {
          provide: getRepositoryToken(FederatedEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FederatedEntitiesController>(
      FederatedEntitiesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
