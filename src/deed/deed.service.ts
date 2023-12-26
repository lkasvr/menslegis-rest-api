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
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';

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
    this.maxAssociationsRatioRule(authorsIds);

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
    this.deedBelongRules(name, politicalBody, deedTypeId, deedSubtypeId);

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

  async findOne(id: string) {
    const deed = await this.deedRepository.findOne({
      where: { id },
      cache: true,
    });

    if (!deed) throw new NotFoundException('Deed not found');

    return deed;
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

  async update(
    id: string,
    {
      name,
      description,
      status,
      docLink,
      docDate,
      authorsIds,
      deedTypeId,
      deedSubtypeId,
      isToAddAuthors,
    }: UpdateDeedDto,
  ) {
    if (authorsIds) this.maxAssociationsRatioRule(authorsIds);

    const deed = await this.findOne(id);

    const deedToCompare = new Deed();
    deedToCompare.id = deed.id;
    deedToCompare.name = name;
    deedToCompare.description = description;
    deedToCompare.status = status;
    deedToCompare.docLink = docLink;
    deedToCompare.docDate = new Date(docDate);

    if (name) deed.name = name;
    if (description) deed.description = description;
    if (status) deed.status = status;
    if (docLink) deed.docLink = docLink;
    if (docDate) deed.docDate = new Date(docDate);

    if (deedTypeId && deedSubtypeId) {
      const deedType = await this.deedTypeService.findOne(deedTypeId);
      const deedSubtype = await this.deedSubtypeService.findOne(deedSubtypeId);

      this.deedBelongRules(
        deed.name,
        deed.politicalBody,
        deedType.id,
        deedSubtype.id,
      );

      deed.deedType = deedType;
      deed.deedSubtype = deedSubtype;
    } else if (!deedTypeId && deedSubtypeId) {
      const deedSubtype = await this.deedSubtypeService.findOne(deedSubtypeId);

      this.deedBelongRules(
        deed.name,
        deed.politicalBody,
        deed.deedType.id,
        deedSubtype.id,
      );

      deed.deedSubtype = deedSubtype;
    } else if (deedTypeId && !deedSubtypeId) {
      const deedType = await this.deedTypeService.findOne(deedTypeId);

      this.deedBelongRules(
        deed.name,
        deed.politicalBody,
        deedType.id,
        deed.deedSubtype.id,
      );

      deed.deedType = deedType;
    }

    let authors: Author[];
    if (authorsIds?.length > 0 && isToAddAuthors) {
      // Add Authors Flow
      const authorsPromises = authorsIds.map((authorId) =>
        this.authorService.findOne(authorId).catch(() => {
          throw new Error(`Author with id '${authorId}' could not be found`);
        }),
      );

      try {
        authors = await Promise.all(authorsPromises);
      } catch (error) {
        if (error instanceof Error)
          throw new BadRequestException(error.message);
      }

      deed.authors = [...deed.authors, ...authors];
      return await this.deedRepository.save(deed);
    } else if (authorsIds?.length > 0 && !isToAddAuthors) {
      // Remove Authors Flow
      const authorsPromises = authorsIds.map((authorId) =>
        this.authorService.findOne(authorId).catch(() => {
          throw new Error(`Author with id '${authorId}' could not be found`);
        }),
      );

      try {
        authors = await Promise.all(authorsPromises);
      } catch (error) {
        if (error instanceof Error)
          throw new BadRequestException(error.message);
      }

      deed.authors = deed.authors.filter(
        (author) =>
          !authors.some((authorToCompare) => authorToCompare.id === author.id),
      );
      return await this.deedRepository.save(deed);
    }

    return await this.deedRepository.save(deed);
  }

  async delete(id: string) {
    if (!(await this.deedRepository.exist()))
      throw new NotFoundException('Deed not found');
    return await this.deedRepository.delete(id);
  }

  private maxAssociationsRatioRule(authorsIds: string[]) {
    if (authorsIds.length > this.maxMadeAuthorsRelationPerReq)
      throw new BadRequestException(
        `Max ratio in a create operation exceeded. Only ${this.maxMadeAuthorsRelationPerReq} associations per creation are allowed`,
      );
    return false;
  }

  private deedBelongRules(
    deedName: string,
    politicalBody: PoliticalBody,
    deedTypeId: string,
    deedSubtypeId: string,
  ) {
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
        `${deedName} Deed cannot belong to a type outside the scope of the same body politic and the subtype must also belong to the type's scope.`,
      );
  }
}
