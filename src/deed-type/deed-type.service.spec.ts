import { Test, TestingModule } from '@nestjs/testing';
import { DeedTypeService } from './deed-type.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeedType } from './entities/deed-type.entity';

const repositoryMock = {
  findOne: jest.fn().mockImplementation(() => new DeedType()),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
describe('DeedTypeService', () => {
  let service: DeedTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeedTypeService,
        {
          provide: getRepositoryToken(DeedType),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<DeedTypeService>(DeedTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
