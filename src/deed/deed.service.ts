import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deed } from './entities/deed.entity';
import { AuthorService } from 'src/author/author.service';
import { PoliticalBodyService } from 'src/political-body/political-body.service';
import { DeedTypeService } from 'src/deed-type/deed-type.service';
import { DeedSubtypeService } from 'src/deed-subtype/deed-subtype.service';
import { Author } from 'src/author/entities/author.entity';

@Injectable()
export class DeedService {
  private maxMadeAuthorsRelationPerReq = 10;

  constructor(
    @InjectRepository(Deed)
    private readonly deedRepository: Repository<Deed>,
    private readonly politicalBodyService: PoliticalBodyService,
    private readonly authorService: AuthorService,
    private readonly deedTypeService: DeedTypeService,
    private readonly deedSubtypeService: DeedSubtypeService,
  ) {}

  async create({
    name,
    politicalBodyId,
    authorsIds,
    deedTypeId,
    deedSubtypeId,
  }: CreateDeedDto) {
    if (authorsIds.length > this.maxMadeAuthorsRelationPerReq)
      throw new BadRequestException(
        `Max ratio in a create operation exceeded. Only ${this.maxMadeAuthorsRelationPerReq} associations per creation are allowed`,
      );

    if (
      await this.deedRepository.exist({
        where: {
          name,
          deedType: { id: deedTypeId },
          deedSubtype: { id: deedSubtypeId },
        },
      })
    )
      throw new BadRequestException(`${name} Deed already exists.`);

    const politicalBody =
      await this.politicalBodyService.findOneById(politicalBodyId);
    if (
      !politicalBody.deedTypes.some(
        (deedType) =>
          deedType?.id === deedTypeId &&
          deedType.deedSubtypes.some(
            (deedSubtype) => deedSubtype?.id === deedSubtypeId,
          ),
      )
    )
      throw new BadRequestException(
        `${name} Deed cannot belong to a type outside the scope of the same body politic and the subtype must also belong to the type's scope.`,
      );

    const authorsPromises = authorsIds.map((authorId) =>
      this.authorService.findOne(authorId).catch(() => {
        throw new Error(`Author with id '${authorId}' could not be found`);
      }),
    );

    let authors: Author[];
    try {
      authors = await Promise.all(authorsPromises);
    } catch (error) {
      if (error instanceof Error) throw new BadRequestException(error.message);
    }

    const deedType = await this.deedTypeService.findOne(deedTypeId);

    const deedSubtype = await this.deedSubtypeService.findOne(deedSubtypeId);

    return await this.deedRepository.save({
      name,
      politicalBody,
      authors,
      deedType,
      deedSubtype,
    });
  }

  async findAll() {
    return await this.deedRepository.find();
  }

  async findOneById(id: string) {
    const deed = await this.deedRepository.findOne({
      where: { id },
      relations: {
        politicalBody: {
          federatedEntity: true,
        },
        deedType: true,
        deedSubtype: true,
        authors: true,
      },
      cache: true,
    });

    if (!deed.politicalBody || !deed.deedType || !deed.deedSubtype)
      throw new NotFoundException('Deed not found');

    return deed;
  }

  update(id: string, updateDeedDto: UpdateDeedDto) {
    return `This action updates a #${id} deed`;
  }

  async delete(id: string) {
    if (!(await this.deedRepository.exist()))
      throw new NotFoundException('Deed not found');
    return await this.deedRepository.delete(id);
  }
}
