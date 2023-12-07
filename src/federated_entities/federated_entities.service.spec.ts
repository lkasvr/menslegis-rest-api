import { Test, TestingModule } from '@nestjs/testing';
import { FederatedEntitiesService } from './federated_entities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FederatedEntity } from './entities/federated_entity.entity';
import { CreateFederatedEntityDto } from './dto/create-federated_entity.dto';
import { FEDERATED_LEVEL } from './entities/enums/federated_level.enum';
import { FEDERATIVE_UNIT } from './entities/enums/federative_unit.enum';
import { POLITICAL_POWER } from './entities/enums/political_power.enum';
import { BadRequestException } from '@nestjs/common';
import { UpdateFederatedEntityDto } from './dto/update-federated_entity.dto';

const repositoryMock = {
  findOne: jest.fn().mockImplementation(() => new FederatedEntity()),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('FederatedEntitiesService', () => {
  let service: FederatedEntitiesService;
  let createDtoMock: CreateFederatedEntityDto;
  let updateDtoMock: UpdateFederatedEntityDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FederatedEntitiesService,
        {
          provide: getRepositoryToken(FederatedEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<FederatedEntitiesService>(FederatedEntitiesService);

    createDtoMock = {
      level: FEDERATED_LEVEL.MUNICIPAL,
      name: FEDERATIVE_UNIT.BLUMENAU,
      political_power: POLITICAL_POWER.EXECUTIVE,
    };

    updateDtoMock = {
      level: FEDERATED_LEVEL.MUNICIPAL,
      name: FEDERATIVE_UNIT.BLUMENAU,
      political_power: POLITICAL_POWER.EXECUTIVE,
    };

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ____________________CREATE METHOD____________________ */
  it('should create a FederatedEntity', async () => {
    repositoryMock.findOne.mockReturnValueOnce(null);

    repositoryMock.save.mockReturnValueOnce(new FederatedEntity());

    expect(await service.create(createDtoMock)).toBeInstanceOf(FederatedEntity);
  });

  it('should not create a duplicate FederatedEntity', () => {
    repositoryMock.findOne.mockReturnValueOnce(new FederatedEntity());

    expect(service.create(createDtoMock)).rejects.toThrow(
      `${createDtoMock.political_power} power on ${createDtoMock.level} ${createDtoMock.name} already exist`,
    );
  });

  it('should throw an error for invalid municipality power', () => {
    createDtoMock.political_power = POLITICAL_POWER.JUDICIARY;

    expect(service.create(createDtoMock)).rejects.toThrow(
      `${POLITICAL_POWER.JUDICIARY} cannot be a ${FEDERATED_LEVEL.MUNICIPAL} power`,
    );
  });

  it('should throw an error for invalid federative hierarchy', () => {
    createDtoMock.level = FEDERATED_LEVEL.STATE;
    createDtoMock.name = FEDERATIVE_UNIT.UNIAO;
    createDtoMock.political_power = POLITICAL_POWER.EXECUTIVE;
    expect(service.create(createDtoMock)).rejects.toThrow(
      `${FEDERATIVE_UNIT.UNIAO} cannot be a ${FEDERATED_LEVEL.STATE} member`,
    );

    createDtoMock.level = FEDERATED_LEVEL.MUNICIPAL;
    expect(service.create(createDtoMock)).rejects.toThrow(
      `${FEDERATIVE_UNIT.UNIAO} cannot be a ${FEDERATED_LEVEL.MUNICIPAL} member`,
    );

    createDtoMock.level = FEDERATED_LEVEL.FEDERAL;
    createDtoMock.name = FEDERATIVE_UNIT.ALAGOAS;
    expect(service.create(createDtoMock)).rejects.toThrow(
      `${FEDERATIVE_UNIT.ALAGOAS} cannot be a ${FEDERATED_LEVEL.FEDERAL} member`,
    );

    createDtoMock.level = FEDERATED_LEVEL.MUNICIPAL;
    expect(service.create(createDtoMock)).rejects.toThrow(
      `${FEDERATIVE_UNIT.ALAGOAS} cannot be a ${FEDERATED_LEVEL.MUNICIPAL} member`,
    );

    createDtoMock.level = FEDERATED_LEVEL.FEDERAL;
    createDtoMock.name = FEDERATIVE_UNIT.BLUMENAU;
    expect(service.create(createDtoMock)).rejects.toThrow(
      `${FEDERATIVE_UNIT.BLUMENAU} cannot be a ${FEDERATED_LEVEL.FEDERAL} member`,
    );

    createDtoMock.level = FEDERATED_LEVEL.STATE;
    expect(service.create(createDtoMock)).rejects.toThrow(
      `${FEDERATIVE_UNIT.BLUMENAU} cannot be a ${FEDERATED_LEVEL.STATE} member`,
    );
  });

  /* ____________________FIND_ALL METHOD____________________ */
  it('should return all federated entities', async () => {
    const federatedEntities: FederatedEntity[] = [
      new FederatedEntity(),
      new FederatedEntity(),
      new FederatedEntity(),
    ];

    repositoryMock.find.mockReturnValueOnce(federatedEntities);

    const response = await service.findAll();

    expect(response).toEqual(federatedEntities);
  });

  /* ____________________FIND_ONE_BY_ID METHOD____________________ */
  it('should find a FederatedEntity by id', async () => {
    const id = '12345';
    const federatedEntity = new FederatedEntity();
    federatedEntity.id = id;

    repositoryMock.findOne.mockReturnValueOnce(federatedEntity);

    const result = await service.findOneById(id);

    expect(result).toEqual(federatedEntity);
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { id },
      cache: 1000,
    });
  });

  /* ____________________UPDATE METHOD____________________ */
  it('should update the federated entity', async () => {
    repositoryMock.update.mockReturnValueOnce(new FederatedEntity());

    expect(await service.update('12345', updateDtoMock)).toBeInstanceOf(
      FederatedEntity,
    );
  });

  it('should return an error for invalid federative hierarchy', async () => {
    updateDtoMock.level = FEDERATED_LEVEL.STATE;
    expect(await service.update('12345', updateDtoMock)).toStrictEqual(
      new BadRequestException(
        `${updateDtoMock.name} cannot be a ${updateDtoMock.level} member`,
      ).getResponse(),
    );

    const federatedEntity = new FederatedEntity();

    federatedEntity.level = FEDERATED_LEVEL.STATE;
    repositoryMock.findOne.mockReturnValueOnce(federatedEntity);
    updateDtoMock.level = null;
    await service.update('12345', updateDtoMock);
    expect(service['federatedEntity']).toBeInstanceOf(FederatedEntity);
    expect(await service.update('12345', updateDtoMock)).toStrictEqual(
      new BadRequestException(
        `${updateDtoMock.name} cannot be a ${federatedEntity.level} member`,
      ).getResponse(),
    );

    service = new FederatedEntitiesService({
      findOne: jest.fn().mockImplementation(() => {
        federatedEntity.name = FEDERATIVE_UNIT.BLUMENAU;
        return federatedEntity;
      }),
    } as any);

    updateDtoMock.level = FEDERATED_LEVEL.FEDERAL;
    updateDtoMock.name = null;
    expect(await service.update('12345', updateDtoMock)).toStrictEqual(
      new BadRequestException(
        `${federatedEntity.name} cannot be a ${updateDtoMock.level} member`,
      ).getResponse(),
    );
  });

  it('should return an error for invalid municipality power', async () => {
    updateDtoMock.political_power = POLITICAL_POWER.JUDICIARY;
    expect(await service.update('12345', updateDtoMock)).toStrictEqual(
      new BadRequestException(
        `${updateDtoMock.political_power} cannot be a ${updateDtoMock.level} power`,
      ).getResponse(),
    );

    const federatedEntity = new FederatedEntity();

    federatedEntity.level = FEDERATED_LEVEL.MUNICIPAL;
    repositoryMock.findOne.mockReturnValueOnce(federatedEntity);
    updateDtoMock.level = null;
    expect(await service.update('12345', updateDtoMock)).toStrictEqual(
      new BadRequestException(
        `${updateDtoMock.political_power} power cannot belong to ${federatedEntity.name}. This is a ${federatedEntity.level} FederatedEntity`,
      ).getResponse(),
    );

    federatedEntity.political_power = POLITICAL_POWER.JUDICIARY;
    repositoryMock.findOne.mockReturnValueOnce(federatedEntity);
    updateDtoMock.level = FEDERATED_LEVEL.MUNICIPAL;
    updateDtoMock.political_power = null;
    expect(await service.update('12345', updateDtoMock)).toStrictEqual(
      new BadRequestException(
        `${federatedEntity.political_power} cannot be a ${updateDtoMock.level} power. This FederatedEntity had a ${federatedEntity.political_power} power`,
      ).getResponse(),
    );
  });

  it('should handle unknown exceptions thrown during update', async () => {
    jest
      .spyOn(service, 'validateMunicipalityPower')
      .mockImplementationOnce(() => {
        throw new Error('Unknown error');
      });

    const result = await service.update('12345', updateDtoMock);
    expect(result).toEqual(
      new BadRequestException(new Error('Unknown error')).getResponse(),
    );
  });

  /* ____________________DELETE METHOD____________________ */
  it('should delete a FederatedEntity by id', async () => {
    const deleteSpy = jest.spyOn(repositoryMock, 'delete');

    await service.delete('12345');

    expect(deleteSpy).toHaveBeenCalledWith('12345');
  });
});
