import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeedSubtypeDto } from './dto/create-deed-subtype.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeedSubtype } from './entities/deed-subtype.entity';
import { Repository } from 'typeorm';
import { PoliticalBodyService } from 'src/political-body/political-body.service';
import { DeedTypeService } from 'src/deed-type/deed-type.service';

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

    const politicalBody =
      await this.politicalBodyService.findOne(politicalBodyId);

    const deedType = await this.deedTypeService.findOne(deedTypeId);

    return await this.deedSubtypeRepository.save({
      name,
      politicalBody,
      deedType,
    });
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

  async findOne(id: string, withDeleted = false) {
    const deedSubtype = await this.deedSubtypeRepository.findOne({
      where: { id },
      cache: true,
      withDeleted,
    });

    if (!deedSubtype) throw new NotFoundException('Subtype not found');

    return deedSubtype;
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
      !(await this.deedSubtypeRepository.exist({
        where: { id },
        cache: true,
      }))
    )
      throw new NotFoundException('Subtype not found');

    return await this.deedSubtypeRepository.delete(id);
  }
}
