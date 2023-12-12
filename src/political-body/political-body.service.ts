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
    const politicalBodyExists = await this.politicalBodyRepository.findOne({
      where: { name },
      withDeleted: true,
    });

    if (politicalBodyExists) {
      throw new BadRequestException(
        `Political Body ${name} already exists or once existed.`,
      );
    }

    const federatedEntity = await this.federatedEntityService.findOneById(
      federatedEntityId,
      false,
    );

    return this.politicalBodyRepository.save({ name, federatedEntity });
  }

  async findAll() {
    return await this.politicalBodyRepository.find({
      relations: {
        federatedEntity: {
          politicalBodies: false,
        },
        deedTypes: {
          politicalBodies: false,
          deeds: false,
          deedSubtypes: true,
        },
        deed: {
          politicalBody: false,
          author: true,
          deedType: true,
          deedSubtype: true,
        },
        authors: {
          politicalBody: false,
          deeds: false,
        },
      },
      relationLoadStrategy: 'query',
    });
  }

  async findOneById(id: string, withDeleted?: boolean) {
    const politicalBody = await this.politicalBodyRepository.findOne({
      where: { id },
      cache: 1000,
      withDeleted,
    });

    if (!politicalBody) throw new NotFoundException('Political Body not found');

    return politicalBody;
  }

  async update(
    id: string,
    { name, federatedEntityId }: UpdatePoliticalBodyDto,
  ) {
    const politicalBody = await this.findOneById(id, false);

    politicalBody.name = name;

    if (federatedEntityId) {
      const federatedEntity = await this.federatedEntityService.findOneById(
        federatedEntityId,
        false,
      );

      politicalBody.federatedEntity = federatedEntity;
    }

    return this.politicalBodyRepository.save(politicalBody);
  }

  remove(id: number) {
    return `This action removes a #${id} politicalBody`;
  }
}
