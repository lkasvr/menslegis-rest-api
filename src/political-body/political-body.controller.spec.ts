import { Test, TestingModule } from '@nestjs/testing';
import { PoliticalBodyController } from './political-body.controller';
import { PoliticalBodyService } from './political-body.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PoliticalBody } from './entities/political-body.entity';
import { FederatedEntity } from 'src/federated-entities/entities/federated-entities.entity';
import { FederatedEntitiesService } from 'src/federated-entities/federated-entities.service';

describe('PoliticalBodyController', () => {
  let controller: PoliticalBodyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoliticalBodyController],
      providers: [
        PoliticalBodyService,
        FederatedEntitiesService,
        {
          provide: getRepositoryToken(PoliticalBody),
          useValue: {},
        },
        {
          provide: getRepositoryToken(FederatedEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PoliticalBodyController>(PoliticalBodyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
