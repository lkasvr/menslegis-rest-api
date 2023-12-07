import { Test, TestingModule } from '@nestjs/testing';
import { FederatedEntitiesService } from './federated_entities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FederatedEntity } from './entities/federated_entity.entity';

// const repositoryMock = jest.fn(() => ({
//   find: jest.fn(),
// })) as any;

describe('FederatedEntitiesService', () => {
  let service: FederatedEntitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FederatedEntitiesService,
        {
          provide: getRepositoryToken(FederatedEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FederatedEntitiesService>(FederatedEntitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
