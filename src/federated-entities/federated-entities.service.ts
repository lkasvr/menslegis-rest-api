import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFederatedEntityDto } from './dto/create-federated-entity.dto';
import { UpdateFederatedEntityDto } from './dto/update-federated-entity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FederatedEntity } from './entities/federated-entities.entity';
import { Repository } from 'typeorm';
import { FEDERATIVE_UNIT } from './entities/enums/federative_unit.enum';
import { FEDERATED_LEVEL } from './entities/enums/federated_level.enum';
import { POLITICAL_POWER } from './entities/enums/political_power.enum';

export interface IFederatedEntity {
  id: string;
  political_power?: POLITICAL_POWER;
  level?: FEDERATED_LEVEL;
  name?: FEDERATIVE_UNIT;
}

@Injectable()
export class FederatedEntitiesService {
  private federatedEntity: FederatedEntity;

  constructor(
    @InjectRepository(FederatedEntity)
    private readonly federatedEntityRepository: Repository<FederatedEntity>,
  ) {}

  async create({ level, political_power, name }: CreateFederatedEntityDto) {
    if (!this.isValidMunicipalityPower(political_power, level))
      throw new BadRequestException(
        `${political_power} cannot be a ${level} power`,
      );

    if (!this.isValidFederativeHierarchy(name, level))
      throw new BadRequestException(`${name} cannot be a ${level} member`);

    if (
      await this.federatedEntityRepository.exist({
        where: { level, political_power, name },
        withDeleted: true,
      })
    )
      throw new BadRequestException(
        `${political_power} power on ${name} ${level} already exist or there once was`,
      );

    return await this.federatedEntityRepository.save({
      level,
      political_power,
      name,
    });
  }

  async findAll() {
    return await this.federatedEntityRepository.find({
      relations: {
        politicalBodies: true,
      },
      relationLoadStrategy: 'query',
    });
  }

  async findOne(
    { id, name }: { id?: string; name?: FEDERATIVE_UNIT },
    withDeleted = false,
  ) {
    if (!id && !name)
      throw new InternalServerErrorException('All arguments empty');

    return await this.federatedEntityRepository.findOne({
      where: { id, name },
      withDeleted,
    });
  }

  async findOneById(id: string) {
    const federatedEntity = await this.federatedEntityRepository.findOne({
      where: { id },
      relations: {
        politicalBodies: {
          federatedEntity: false,
          authors: false,
          deedTypes: false,
          deeds: false,
        },
      },
    });

    if (!federatedEntity)
      throw new NotFoundException('Federated Entity not found');

    return federatedEntity;
  }

  async update(id: string, updateFederatedEntityDto: UpdateFederatedEntityDto) {
    try {
      await this.validateMunicipalityPower({ id, ...updateFederatedEntityDto });
      await this.validateFederativeHierarchy({
        id,
        ...updateFederatedEntityDto,
      });

      await this.federatedEntityRepository.update(id, updateFederatedEntityDto);

      return this.findOneById(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.detail);
    }
  }

  async delete(id: string) {
    if (await this.federatedEntityExist(id, true))
      return await this.federatedEntityRepository.softDelete(id);
    throw new NotFoundException('Federated Entity not found');
  }

  async deletePermanently(id: string) {
    if (await this.federatedEntityExist(id, true))
      return await this.federatedEntityRepository.delete(id);
    throw new NotFoundException('Federated Entity not found');
  }

  async restore(id: string) {
    if (await this.federatedEntityExist(id, true))
      return await this.federatedEntityRepository.recover({ id });
    throw new NotFoundException('Federated Entity not found');
  }

  async federatedEntityExist(id: string, withDeleted = false) {
    return await this.federatedEntityRepository.exist({
      where: { id },
      withDeleted,
    });
  }

  async validateFederativeHierarchy({ id, name, level }: IFederatedEntity) {
    if (name && level && !this.isValidFederativeHierarchy(name, level))
      throw new BadRequestException(`${name} cannot be a ${level} member`);

    if (!this.federatedEntity)
      this.federatedEntity = await this.findOne({ id });

    if (!this.federatedEntity)
      throw new NotFoundException('Federated Entity not found');

    if (
      name &&
      !level &&
      !this.isValidFederativeHierarchy(name, this.federatedEntity.level)
    )
      throw new BadRequestException(
        `${name} cannot be a ${this.federatedEntity.level} member`,
      );

    if (
      !name &&
      level &&
      !this.isValidFederativeHierarchy(this.federatedEntity.name, level)
    )
      throw new BadRequestException(
        `${this.federatedEntity.name} cannot be a ${level} member`,
      );
  }

  async validateMunicipalityPower({
    id,
    political_power,
    level,
  }: IFederatedEntity) {
    if (
      political_power &&
      level &&
      !this.isValidMunicipalityPower(political_power, level)
    ) {
      throw new BadRequestException(
        `${political_power} cannot be a ${level} power`,
      );
    }

    if (!this.federatedEntity)
      this.federatedEntity = await this.findOne({ id });

    if (!this.federatedEntity)
      throw new NotFoundException('Federated Entity not found');

    if (
      political_power &&
      !level &&
      !this.isValidMunicipalityPower(
        political_power,
        this.federatedEntity.level,
      )
    )
      throw new BadRequestException(
        `${political_power} power cannot belong to ${this.federatedEntity.name}. This is a ${this.federatedEntity.level} FederatedEntity`,
      );

    if (
      !political_power &&
      level &&
      !this.isValidMunicipalityPower(
        this.federatedEntity.political_power,
        level,
      )
    )
      throw new BadRequestException(
        `${this.federatedEntity.political_power} cannot be a ${level} power. This FederatedEntity had a ${this.federatedEntity.political_power} power`,
      );
  }

  public isValidFederativeHierarchy(
    federativeUnit: FEDERATIVE_UNIT,
    federatedLevel: FEDERATED_LEVEL,
  ) {
    if (
      federativeUnit === FEDERATIVE_UNIT.UNIAO &&
      federatedLevel !== FEDERATED_LEVEL.FEDERAL
    )
      return false;

    if (federativeUnit.length === 2 && federatedLevel !== FEDERATED_LEVEL.STATE)
      return false;

    if (
      federativeUnit.length > 2 &&
      federativeUnit !== FEDERATIVE_UNIT.UNIAO &&
      federatedLevel !== FEDERATED_LEVEL.MUNICIPAL
    )
      return false;

    return true;
  }

  public isValidMunicipalityPower(
    politicalPower: POLITICAL_POWER,
    federatedLevel: FEDERATED_LEVEL,
  ) {
    if (
      politicalPower === POLITICAL_POWER.JUDICIARY &&
      federatedLevel === FEDERATED_LEVEL.MUNICIPAL
    )
      return false;
    return true;
  }
}
