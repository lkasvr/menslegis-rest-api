import { Test, TestingModule } from '@nestjs/testing';
import { FederatedEntitiesController } from './federated-entities.controller';
import { FederatedEntitiesService } from './federated-entities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FederatedEntity } from './entities/federated-entities.entity';

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

  it('should create a federated entity', async () => {
    //await expect(controller.create()).resolves.toBeInstanceOf();
  });
});
