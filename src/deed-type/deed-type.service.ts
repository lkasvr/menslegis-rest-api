import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeedTypeDto } from './dto/create-deed-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeedType } from './entities/deed-type.entity';
import { PoliticalBodyService } from 'src/political-body/political-body.service';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';

@Injectable()
export class DeedTypeService {
  constructor(
    @InjectRepository(DeedType)
    private readonly deedTypeRepository: Repository<DeedType>,
    private readonly politicalBodyService: PoliticalBodyService,
  ) {}

  async create({ name, politicalBodiesId }: CreateDeedTypeDto) {
    if (politicalBodiesId.length > 3)
      throw new BadRequestException(
        'Max ratio in a create operation exceeded. Only three associations per creation are allowed',
      );

    if (
      await this.deedTypeRepository.exist({
        where: { name },
        withDeleted: true,
      })
    ) {
      throw new BadRequestException(
        `${name} Type already exists or once existed.`,
      );
    }

    const politicalBodiesPromises = politicalBodiesId.map((politicalBodyId) =>
      this.politicalBodyService.findOneById(politicalBodyId).catch(() => {
        throw new Error(
          `Political body with id '${politicalBodyId}' could not be found`,
        );
      }),
    );

    let politicalBodies: PoliticalBody[];
    try {
      politicalBodies = await Promise.all(politicalBodiesPromises);
    } catch (error) {
      if (error instanceof Error) throw new BadRequestException(error.message);
    }

    const deeType = await this.deedTypeRepository.save({
      name,
      politicalBodies,
    });

    return deeType;
  }

  async findAll() {
    return await this.deedTypeRepository.find();
  }

  async findOne(id: string, withDeleted = false) {
    const deedType = await this.deedTypeRepository.findOne({
      where: { id },
      cache: true,
      withDeleted,
    });

    if (!deedType) throw new NotFoundException('Type not found');

    return deedType;
  }

  async findOneById(id: string) {
    const deedType = await this.deedTypeRepository.findOne({
      where: { id },
      relations: {
        politicalBodies: {
          federatedEntity: true,
        },
      },
      cache: true,
    });

    if (!deedType) throw new NotFoundException('Type not found');

    return deedType;
  }

  async delete(id: string) {
    return await this.deedTypeRepository.softDelete(id);
  }

  async deletePermanently(id: string) {
    await this.findOne(id, true);
    return await this.deedTypeRepository.delete(id);
  }

  async restore(id: string) {
    await this.findOne(id, true);
    return await this.deedTypeRepository.recover({ id });
  }
}
