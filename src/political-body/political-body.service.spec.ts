import { Test, TestingModule } from '@nestjs/testing';
import { PoliticalBodyService } from './political-body.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PoliticalBody } from './entities/political-body.entity';
import { FederatedEntitiesService } from 'src/federated-entities/federated-entities.service';
import { FederatedEntity } from 'src/federated-entities/entities/federated-entities.entity';
import { POLITICAL_POWER } from 'src/federated-entities/entities/enums/political_power.enum';
import { FEDERATED_LEVEL } from 'src/federated-entities/entities/enums/federated_level.enum';
import { FEDERATIVE_UNIT } from 'src/federated-entities/entities/enums/federative_unit.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const repositoryMock = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('PoliticalBodyService', () => {
  let service: PoliticalBodyService;
  let federatedEntitiesService: FederatedEntitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FederatedEntitiesService,
        PoliticalBodyService,
        {
          provide: getRepositoryToken(PoliticalBody),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(FederatedEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<PoliticalBodyService>(PoliticalBodyService);
    federatedEntitiesService = module.get<FederatedEntitiesService>(
      FederatedEntitiesService,
    );

    const federatedEntity = new FederatedEntity();
    federatedEntity.id = '1';
    federatedEntity.political_power = POLITICAL_POWER.EXECUTIVE;
    federatedEntity.level = FEDERATED_LEVEL.MUNICIPAL;
    federatedEntity.name = FEDERATIVE_UNIT.BELO_HORIZONTE;
    jest
      .spyOn(federatedEntitiesService, 'findOneById')
      .mockImplementation(() => {
        return Promise.resolve(federatedEntity);
      });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ____________________CREATE METHOD____________________ */
  it('should create a PoliticalBody', async () => {
    repositoryMock.findOne.mockReturnValueOnce(null);
    const politicalBody = new PoliticalBody();
    politicalBody.name = 'Test';
    repositoryMock.save.mockReturnValueOnce(politicalBody);

    await expect(
      service.create({
        name: 'Test',
        federatedEntityId: '1',
      }),
    ).resolves.toEqual(politicalBody);
  });

  it('should not create a duplicate PoliticalBody', async () => {
    repositoryMock.findOne.mockReturnValueOnce(new PoliticalBody());

    await expect(
      service.create({ name: 'Test', federatedEntityId: '1' }),
    ).rejects.toThrow(
      new BadRequestException(
        `Political Body Test already exists or once existed.`,
      ),
    );
  });

  /* ____________________FIND_ALL METHOD____________________ */
  it('should return all political bodies', async () => {
    const politicalBodies: PoliticalBody[] = [
      new PoliticalBody(),
      new PoliticalBody(),
      new PoliticalBody(),
    ];

    repositoryMock.find.mockReturnValueOnce(politicalBodies);

    const response = await service.findAll();

    expect(response).toEqual(politicalBodies);
  });

  /* ____________________FIND_ONE_BY_ID METHOD____________________ */
  it('should find a Political Body by id', async () => {
    const id = '12345';
    const politicalBody = new PoliticalBody();
    politicalBody.id = id;

    repositoryMock.findOne.mockReturnValueOnce(politicalBody);

    const result = await service.findOneById(id);
    expect(result).toEqual(politicalBody);
  });

  it('should throw an exception when attempt to find a Political Body by id', async () => {
    repositoryMock.findOne.mockReturnValueOnce(null);

    await expect(service.findOneById('12345')).rejects.toThrow(
      new NotFoundException('Political Body not found'),
    );
  });

  /* ____________________UPDATE METHOD____________________ */
  it('should update the political body', async () => {
    const politicalBody = new PoliticalBody();
    repositoryMock.findOne.mockReturnValueOnce(politicalBody);
    politicalBody.name = 'Test';
    repositoryMock.save.mockReturnValueOnce(politicalBody);

    expect(
      await service.update('12345', { name: 'Test', federatedEntityId: '1' }),
    ).toBeInstanceOf(PoliticalBody);
  });
});
