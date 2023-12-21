import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePoliticalBodyDto } from './dto/create-political-body.dto';
import { UpdatePoliticalBodyDto } from './dto/update-political-body.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PoliticalBody } from './entities/political-body.entity';
import { Repository } from 'typeorm';
import { FederatedEntitiesService } from 'src/federated-entities/federated-entities.service';

@Injectable()
export class PoliticalBodyService {
  constructor(
    @InjectRepository(PoliticalBody)
    private readonly politicalBodyRepository: Repository<PoliticalBody>,
    private readonly federatedEntityService: FederatedEntitiesService,
  ) {}

  async create({ name, federatedEntityId }: CreatePoliticalBodyDto) {
    if (
      await this.politicalBodyRepository.exist({
        where: { name },
        withDeleted: true,
      })
    ) {
      throw new BadRequestException(
        `Political Body ${name} already exists or once existed.`,
      );
    }

    const federatedEntity =
      await this.federatedEntityService.findOneById(federatedEntityId);

    const result = await this.politicalBodyRepository.save({
      name,
      federatedEntity,
    });
    //delete result.federatedEntity.politicalBodies;
    return result;
  }

  async findAll() {
    return await this.politicalBodyRepository
      .createQueryBuilder('politicalBody')
      .innerJoinAndSelect(
        'politicalBody.federatedEntity',
        'federatedEntity',
        'federatedEntity.deletedAt IS NULL',
      )
      .cache(true)
      .getMany();
  }

  async findOne(id: string, withDeleted = false) {
    const federatedEntity = await this.politicalBodyRepository.findOne({
      where: { id },
      cache: true,
      withDeleted,
    });

    if (!federatedEntity)
      throw new NotFoundException('Political Body not found');

    return federatedEntity;
  }

  async findOneById(id: string) {
    const politicalBody = await this.politicalBodyRepository
      .createQueryBuilder('politicalBody')
      .innerJoinAndSelect(
        'politicalBody.federatedEntity',
        'federatedEntity',
        'federatedEntity.deletedAt IS NULL',
      )
      .leftJoinAndSelect(
        'politicalBody.deedTypes',
        'deedTypes',
        'deedTypes.deletedAt IS NULL',
      )
      .where('politicalBody.id = :id', { id })
      .cache(true)
      .getOne();

    if (!politicalBody) throw new NotFoundException('Political Body not found');

    return politicalBody;
  }

  async update(
    id: string,
    { name, federatedEntityId }: UpdatePoliticalBodyDto,
  ) {
    const politicalBody = await this.findOneById(id);

    politicalBody.name = name;

    if (federatedEntityId) {
      const federatedEntity =
        await this.federatedEntityService.findOneById(federatedEntityId);

      politicalBody.federatedEntity = federatedEntity;
    }

    return this.politicalBodyRepository.save(politicalBody);
  }

  async delete(id: string) {
    return await this.politicalBodyRepository.softDelete(id);
  }

  async deletePermanently(id: string) {
    await this.findOne(id, true);
    return await this.politicalBodyRepository.delete(id);
  }

  async restore(id: string) {
    await this.findOne(id, true);
    return await this.politicalBodyRepository.recover({ id });
  }
}
