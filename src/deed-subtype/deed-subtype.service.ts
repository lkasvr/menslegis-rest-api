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
    private readonly deedSubTypeRepository: Repository<DeedSubtype>,
    private readonly politicalBodyService: PoliticalBodyService,
    private readonly deedTypeService: DeedTypeService,
  ) {}

  async create({ name, deedTypeId, politicalBodyId }: CreateDeedSubtypeDto) {
    if (
      await this.deedSubTypeRepository.exist({
        where: { name },
        cache: true,
      })
    )
      throw new BadRequestException(`Subtype ${name} already exists`);

    const politicalBody =
      await this.politicalBodyService.findOne(politicalBodyId);

    const deedType = await this.deedTypeService.findOne(deedTypeId);

    return await this.deedSubTypeRepository.save({
      name,
      politicalBody,
      deedType,
    });
  }

  async findAll() {
    return await this.deedSubTypeRepository.find();
  }

  async findOneById(id: string) {
    const deedSubtype = await this.deedSubTypeRepository.findOne({
      where: { id },
      relations: {
        deedType: true,
        politicalBody: {
          federatedEntity: true,
        },
      },
      cache: true,
    });

    if (!deedSubtype) throw new NotFoundException('Subtype not found');

    return deedSubtype;
  }

  async remove(id: string) {
    if (
      !(await this.deedSubTypeRepository.exist({
        where: { id },
        cache: true,
      }))
    )
      throw new NotFoundException('Subtype not found');

    return await this.deedSubTypeRepository.delete(id);
  }
}
