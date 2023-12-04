import { Test, TestingModule } from '@nestjs/testing';
import { FederatedEntitiesService } from './federated_entities.service';

describe('FederatedEntitiesService', () => {
  let service: FederatedEntitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FederatedEntitiesService],
    }).compile();

    service = module.get<FederatedEntitiesService>(FederatedEntitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
