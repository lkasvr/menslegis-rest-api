import { Injectable } from '@nestjs/common';
import { CreateFederatedEntityDto } from './dto/create-federated_entity.dto';
import { UpdateFederatedEntityDto } from './dto/update-federated_entity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FederatedEntity } from './entities/federated_entity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FederatedEntitiesService {
  constructor(
    @InjectRepository(FederatedEntity)
    private readonly federatedEntityRepository: Repository<FederatedEntity>,
  ) {}

  async create(createFederatedEntityDto: CreateFederatedEntityDto) {
    return this.federatedEntityRepository.save(createFederatedEntityDto);
  }

  async findAll() {
    return await this.federatedEntityRepository.find();
  }

  async findOneById(id: string) {
    return await this.federatedEntityRepository.findOneBy({ id });
  }

  async update(id: string, updateFederatedEntityDto: UpdateFederatedEntityDto) {
    const { political_power, level } = updateFederatedEntityDto;

    return await this.federatedEntityRepository.save({
      id,
      political_power,
      level,
    });
  }

  async delete(id: string) {
    return await this.federatedEntityRepository.delete(id);
  }
}
