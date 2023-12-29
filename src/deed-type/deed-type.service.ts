import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeedTypeDto } from './dto/create-deed-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { DeedType } from './entities/deed-type.entity';
import { PoliticalBodyService } from 'src/political-body/political-body.service';
import { DEED_TYPE } from './entities/enums/deed_type.enum';
import { FindOneOrCreateDeedTypeDto } from './dto/findOneOrCreate-deed-type.dto';

@Injectable()
export class DeedTypeService {
  constructor(
    @InjectRepository(DeedType)
    private readonly deedTypeRepository: Repository<DeedType>,
    private readonly politicalBodyService: PoliticalBodyService,
  ) {}

  async create(
    { name, politicalBodiesId }: CreateDeedTypeDto,
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(DeedType)
      : this.deedTypeRepository;

    if (politicalBodiesId.length > 3)
      throw new BadRequestException(
        'Max ratio in a create operation exceeded. Only three associations per creation are allowed',
      );

    if (await this.deedTypeExist({ name }, true)) {
      throw new BadRequestException(
        `${name} Type already exists or once existed.`,
      );
    }

    const politicalBodiesPromises = politicalBodiesId.map(
      async (politicalBodyId) => {
        const result = await this.politicalBodyService.findOne({
          id: politicalBodyId,
        });

        if (!result)
          throw new BadRequestException(
            `Political body with id '${politicalBodyId}' could not be found`,
          );

        return result;
      },
    );

    const politicalBodies = await Promise.all(politicalBodiesPromises);

    const deeType = await repository.save({
      name,
      politicalBodies,
    });

    return deeType;
  }

  // SRP - Single Responsability Principle
  async findOneOrCreate(
    { name, politicalBodiesId }: FindOneOrCreateDeedTypeDto,
    queryRunner?: QueryRunner,
  ) {
    const deedType = await this.findOne({ name });

    if (deedType) return deedType;

    if (name && politicalBodiesId.length >= 1) {
      return await this.create({ name, politicalBodiesId }, queryRunner);
    }

    throw new BadRequestException(
      'Deed type must belong at least one Political Body',
    );
  }

  async findAll() {
    return await this.deedTypeRepository.find();
  }

  async findOne(
    { id, name }: { id?: string; name?: DEED_TYPE },
    withDeleted = false,
  ): Promise<DeedType> | null {
    if (!id && !name)
      throw new InternalServerErrorException('All arguments empty');

    const deedType = await this.deedTypeRepository.findOne({
      where: { id, name },
      cache: true,
      withDeleted,
    });

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
    if (await this.deedTypeExist({ id }))
      return await this.deedTypeRepository.softDelete(id);
    throw new NotFoundException('Type not found');
  }

  async deletePermanently(id: string) {
    if (await this.deedTypeExist({ id }, true))
      return await this.deedTypeRepository.delete(id);
    throw new NotFoundException('Type not found');
  }

  async restore(id: string) {
    if (await this.deedTypeExist({ id }, true))
      return await this.deedTypeRepository.recover({ id });
    throw new NotFoundException('Type not found');
  }

  async deedTypeExist(
    { id, name }: { id?: string; name?: DEED_TYPE },
    withDeleted = false,
  ) {
    return await this.deedTypeRepository.exist({
      where: { id, name },
      withDeleted,
    });
  }
}
