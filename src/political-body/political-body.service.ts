import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePoliticalBodyDto } from './dto/create-political-body.dto';
import { UpdatePoliticalBodyDto } from './dto/update-political-body.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PoliticalBody } from './entities/political-body.entity';
import { QueryRunner, Repository } from 'typeorm';
import { FederatedEntitiesService } from 'src/federated-entities/federated-entities.service';

@Injectable()
export class PoliticalBodyService {
  constructor(
    @InjectRepository(PoliticalBody)
    private readonly politicalBodyRepository: Repository<PoliticalBody>,
    private readonly federatedEntityService: FederatedEntitiesService,
  ) {}

  async create({ name, federatedEntityId }: CreatePoliticalBodyDto) {
    if (await this.politicalBodyExist({ name }, true)) {
      throw new BadRequestException(
        `${name} Political Body already exists or once existed.`,
      );
    }

    const federatedEntity = await this.federatedEntityService.findOne({
      id: federatedEntityId,
    });
    if (!federatedEntity)
      throw new NotFoundException('Federated Entity not found');

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

  async findOne(
    {
      id,
      name,
      federatedEntityId,
    }: { id?: string; name?: string; federatedEntityId?: string },
    withDeleted = false,
    queryRunner?: QueryRunner,
  ): Promise<PoliticalBody> | null {
    if (!id && !name && !federatedEntityId)
      throw new InternalServerErrorException('All arguments empty');

    const repository = queryRunner
      ? queryRunner.manager.getRepository(PoliticalBody)
      : this.politicalBodyRepository;

    const politicalBody = await repository.findOne({
      where: { id, name, federatedEntity: { id: federatedEntityId } },
      relations: {
        deedTypes: {
          deedSubtypes: true,
        },
      },
      withDeleted,
      cache: true,
    });

    return politicalBody;
  }

  async findOneById(id: string) {
    const politicalBody = await this.politicalBodyRepository.findOne({
      where: {
        id,
      },
      relations: {
        federatedEntity: true,
        authors: true,
        deeds: true,
        deedTypes: true,
        deedSubtypes: true,
      },
      cache: true,
    });

    if (!politicalBody.federatedEntity || !politicalBody.deedTypes)
      throw new NotFoundException('Political Body not found');

    return politicalBody;
  }

  async update(
    id: string,
    { name, federatedEntityId }: UpdatePoliticalBodyDto,
  ) {
    const politicalBody = await this.findOne({ id });
    if (!politicalBody) throw new NotFoundException('Political Body not found');

    politicalBody.name = name;

    if (federatedEntityId) {
      const federatedEntity = await this.federatedEntityService.findOne({
        id: federatedEntityId,
      });

      if (!federatedEntity)
        throw new NotFoundException('Federated Entity not found');

      politicalBody.federatedEntity = federatedEntity;
    }

    return await this.politicalBodyRepository.save(politicalBody);
  }

  async delete(id: string) {
    if (await this.politicalBodyExist({ id }))
      return await this.politicalBodyRepository.softDelete(id);

    throw new NotFoundException('Political Body not found');
  }

  async deletePermanently(id: string) {
    if (await this.politicalBodyExist({ id }, true))
      return await this.politicalBodyRepository.delete(id);
    throw new NotFoundException('Political Body not found');
  }

  async restore(id: string) {
    if (await this.politicalBodyExist({ id }, true))
      return await this.politicalBodyRepository.recover({ id });
    throw new NotFoundException('Political Body not found');
  }

  async politicalBodyExist(
    {
      id,
      name,
      federatedEntityId,
    }: { id?: string; name?: string; federatedEntityId?: string },
    withDeleted = false,
  ) {
    return await this.politicalBodyRepository.exist({
      where: { id, name, federatedEntity: { id: federatedEntityId } },
      withDeleted,
    });
  }
}
