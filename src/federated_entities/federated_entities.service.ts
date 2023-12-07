import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFederatedEntityDto } from './dto/create-federated_entity.dto';
import { UpdateFederatedEntityDto } from './dto/update-federated_entity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FederatedEntity } from './entities/federated_entity.entity';
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

    const existsFederatedEntity = await this.federatedEntityRepository.findOne({
      where: { level, political_power, name },
    });

    if (existsFederatedEntity)
      throw new BadRequestException(
        `${political_power} on ${level} ${name} already exist`,
      );

    return this.federatedEntityRepository.save({
      level,
      political_power,
      name,
    });
  }

  async findAll() {
    return await this.federatedEntityRepository.find();
  }

  async findOneById(id: string) {
    return await this.federatedEntityRepository.findOne({
      where: { id },
      cache: 1000,
    });
  }

  async update(id: string, updateFederatedEntityDto: UpdateFederatedEntityDto) {
    try {
      await this.validateMunicipalityPower({ id, ...updateFederatedEntityDto });
      await this.validateFederativeHierarchy({
        id,
        ...updateFederatedEntityDto,
      });
      return await this.federatedEntityRepository.update(
        id,
        updateFederatedEntityDto,
      );
    } catch (error) {
      if (error instanceof BadRequestException) return error.getResponse();
      return error;
    }
  }

  async delete(id: string) {
    return await this.federatedEntityRepository.delete(id);
  }

  async validateFederativeHierarchy({ id, name, level }: IFederatedEntity) {
    if (name && level) {
      if (!this.isValidFederativeHierarchy(name, level))
        throw new BadRequestException(`${name} cannot be a ${level} member`);
      return;
    }

    if (!this.federatedEntity)
      this.federatedEntity = await this.findOneById(id);

    if (name && !level) {
      if (!this.isValidFederativeHierarchy(name, this.federatedEntity.level))
        throw new BadRequestException(
          `${name} cannot be a ${this.federatedEntity.level} member`,
        );
    }

    if (!name && level) {
      if (!this.isValidFederativeHierarchy(this.federatedEntity.name, level))
        throw new BadRequestException(
          `${this.federatedEntity.name} cannot be a ${level} member`,
        );
    }
  }

  async validateMunicipalityPower({
    id,
    political_power,
    level,
  }: IFederatedEntity) {
    if (political_power && level) {
      if (!this.isValidMunicipalityPower(political_power, level))
        throw new BadRequestException(
          `${political_power} cannot be a ${level} power`,
        );
      return;
    }

    if (!this.federatedEntity)
      this.federatedEntity = await this.findOneById(id);

    if (political_power && !level) {
      if (
        !this.isValidMunicipalityPower(
          political_power,
          this.federatedEntity.level,
        )
      )
        throw new BadRequestException(
          `${political_power} cannot be a ${this.federatedEntity.level} power. This FederatedEntity belongs to a ${this.federatedEntity.level} level`,
        );
    }

    if (!political_power && level) {
      if (
        !this.isValidMunicipalityPower(
          this.federatedEntity.political_power,
          level,
        )
      )
        throw new BadRequestException(
          `${this.federatedEntity.political_power} cannot be a ${level} power. This FederatedEntity had a ${this.federatedEntity.political_power} power`,
        );
    }
  }

  isValidFederativeHierarchy(
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

  isValidMunicipalityPower(
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
