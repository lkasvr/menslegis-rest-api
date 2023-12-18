import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeedTypeDto } from './dto/create-deed-type.dto';
import { UpdateDeedTypeDto } from './dto/update-deed-type.dto';
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
    if (
      await this.deedTypeRepository.exist({
        where: { name },
        withDeleted: true,
      })
    ) {
      throw new BadRequestException(
        `Type ${name} already exists or once existed.`,
      );
    }

    if (politicalBodiesId.length > 3)
      throw new BadRequestException(
        'Max ratio in a create operation exceeded. Only three associations per creation are allowed',
      );

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

    console.log(politicalBodies);

    const deeType = await this.deedTypeRepository.save({
      name,
      politicalBodies,
    });

    return deeType;
  }

  async findAll() {
    return this.deedTypeRepository.find();
  }

  private async findOne(id: string, withDeleted = false) {
    const federatedEntity = await this.deedTypeRepository.findOne({
      where: { id },
      cache: true,
      withDeleted,
    });

    if (!federatedEntity) throw new NotFoundException('Type not found');

    return federatedEntity;
  }

  async findOneById(id: string) {
    const politicalBody = await this.deedTypeRepository.findOne({
      where: { id },
      relations: {
        politicalBodies: {
          federatedEntity: true,
        },
      },
      cache: true,
    });

    if (!politicalBody) throw new NotFoundException('Type not found');

    return politicalBody;
  }

  update(id: string, updateDeedTypeDto: UpdateDeedTypeDto) {
    return `This action updates a #${id}, ${updateDeedTypeDto.name} deedType`;
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
