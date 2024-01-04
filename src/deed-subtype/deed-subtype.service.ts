import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeedSubtypeDto } from './dto/create-deed-subtype.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeedSubtype } from './entities/deed-subtype.entity';
import { QueryRunner, Repository } from 'typeorm';
import { PoliticalBodyService } from 'src/political-body/political-body.service';
import { DeedTypeService } from 'src/deed-type/deed-type.service';
import { FindOneOrCreateDeedSubtypeDto } from './dto/findOneOrCreate-deed-subtype.dto';

@Injectable()
export class DeedSubtypeService {
  constructor(
    @InjectRepository(DeedSubtype)
    private readonly deedSubtypeRepository: Repository<DeedSubtype>,
    private readonly politicalBodyService: PoliticalBodyService,
    private readonly deedTypeService: DeedTypeService,
  ) {}

  async create({ name, deedTypeId, politicalBodyId }: CreateDeedSubtypeDto) {
    if (
      await this.deedSubtypeRepository.exist({
        where: { name },
        cache: true,
      })
    )
      throw new BadRequestException(`${name} Subtype already exists`);

    const politicalBody = await this.politicalBodyService.findOne({
      id: politicalBodyId,
    });

    if (!politicalBody) throw new NotFoundException('Political Body not found');

    const deedType = await this.deedTypeService.findOne(
      { id: deedTypeId },
      false,
    );

    if (!deedType) throw new NotFoundException('Type not found');

    return await this.deedSubtypeRepository.save({
      name,
      politicalBody,
      deedType,
    });
  }

  async findOneOrCreate(
    { name, deedType, politicalBody }: FindOneOrCreateDeedSubtypeDto,
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(DeedSubtype)
      : this.deedSubtypeRepository;

    const deedSubtype = await this.findOne({ name }, false, queryRunner);

    if (deedSubtype) return deedSubtype;

    if (name && deedType && politicalBody)
      return await repository.save({ name, deedType, politicalBody });

    throw new BadRequestException(
      'Deed subtype must belong at one Deed type and Political Body',
    );
  }

  async findAll() {
    return await this.deedSubtypeRepository
      .createQueryBuilder('deedSubtype')
      .innerJoinAndSelect(
        'deedSubtype.politicalBody',
        'politicalBody',
        'politicalBody.deletedAt IS NULL',
      )
      .innerJoinAndSelect(
        'deedSubtype.deedType',
        'deedType',
        'deedType.deletedAt IS NULL',
      )
      .cache(true)
      .getMany();
  }

  async findOne(
    { id, name }: { id?: string; name?: string },
    withDeleted = false,
    queryRunner?: QueryRunner,
  ) {
    if (!id && !name)
      throw new InternalServerErrorException('All arguments empty');

    const repository = queryRunner
      ? queryRunner.manager.getRepository(DeedSubtype)
      : this.deedSubtypeRepository;

    return await repository.findOne({
      where: { id, name },
      withDeleted,
    });
  }

  async findOneById(id: string) {
    const deedSubtype = await this.deedSubtypeRepository.findOne({
      where: { id },
      relations: {
        politicalBody: {
          federatedEntity: true,
        },
        deedType: true,
      },
      cache: true,
    });

    if (!deedSubtype.politicalBody || !deedSubtype.deedType)
      throw new NotFoundException('Subtype not found');

    return deedSubtype;
  }

  async delete(id: string) {
    if (
      await this.deedSubtypeRepository.exist({
        where: { id },
        cache: true,
      })
    )
      return await this.deedSubtypeRepository.delete(id);

    throw new NotFoundException('Subtype not found');
  }
}
