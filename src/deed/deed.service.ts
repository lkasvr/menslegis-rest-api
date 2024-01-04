import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Deed } from './entities/deed.entity';
import { AuthorService } from 'src/author/author.service';
import { PoliticalBodyService } from 'src/political-body/political-body.service';
import { DeedTypeService } from 'src/deed-type/deed-type.service';
import { DeedSubtypeService } from 'src/deed-subtype/deed-subtype.service';
import { Author } from 'src/author/entities/author.entity';
import { PoliticalBody } from 'src/political-body/entities/political-body.entity';
import { DeedPayloadDto } from './dto/create-deed-payload.dto';
import { isValid, parse as parseDate, parseISO } from 'date-fns';

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
    description,
    status,
    docDate,
    docLink,
    pageDocLink,
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

    const politicalBody = await this.politicalBodyService.findOne({
      id: politicalBodyId,
    });
    if (!politicalBody) throw new NotFoundException('Political Body not found');

    this.deedBelongRules(name, deedTypeId, deedSubtypeId, null, politicalBody);

    const authorsPromises = authorsIds.map(async (authorId) => {
      const author = await this.authorService.findOne({ id: authorId });

      if (!author)
        throw new BadRequestException(
          `Author with id '${authorId}' could not be found`,
        );

      return author;
    });

    const authors = await Promise.all(authorsPromises);

    const deedType = await this.deedTypeService.findOne({ id: deedTypeId });
    if (!deedType) throw new NotFoundException('Type not found');

    const deedSubtype = await this.deedSubtypeService.findOne({
      id: deedSubtypeId,
    });
    if (!deedSubtype) throw new NotFoundException('Subtype not found');

    return await this.deedRepository.save({
      name,
      description,
      status,
      docDate,
      docLink,
      pageDocLink,
      politicalBody,
      authors,
      deedType,
      deedSubtype,
    });
  }

  async findAll() {
    return await this.deedRepository.find();
  }

  async findOne({ id }: { id: string }) {
    return await this.deedRepository.findOne({
      where: { id },
      cache: true,
    });
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

    const deed = await this.findOne({ id });
    if (!deed) throw new NotFoundException('Deed not found');

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
      const deedType = await this.deedTypeService.findOneById(deedTypeId);
      const deedSubtype =
        await this.deedSubtypeService.findOneById(deedSubtypeId);

      this.deedBelongRules(
        deed.name,
        null,
        deedType.id,
        deedSubtype.id,
        deed.politicalBody,
      );

      deed.deedType = deedType;
      deed.deedSubtype = deedSubtype;
    } else if (!deedTypeId && deedSubtypeId) {
      const deedSubtype =
        await this.deedSubtypeService.findOneById(deedSubtypeId);

      this.deedBelongRules(
        deed.name,
        deed.deedType.id,
        deedSubtype.id,
        null,
        deed.politicalBody,
      );

      deed.deedSubtype = deedSubtype;
    } else if (deedTypeId && !deedSubtypeId) {
      const deedType = await this.deedTypeService.findOneById(deedTypeId);

      this.deedBelongRules(
        deed.name,
        null,
        deedType.id,
        deed.deedSubtype.id,
        deed.politicalBody,
      );

      deed.deedType = deedType;
    }

    let authors: Author[];
    if (authorsIds?.length > 0 && isToAddAuthors) {
      // Add Authors Flow
      const authorsPromises = authorsIds.map(async (authorId) => {
        const author = await this.authorService.findOne({ id: authorId });

        if (!author)
          throw new BadRequestException(
            `Author with id '${authorId}' could not be found`,
          );

        return author;
      });

      authors = await Promise.all(authorsPromises);

      deed.authors = [...deed.authors, ...authors];
      return await this.deedRepository.save(deed);
    } else if (authorsIds?.length > 0 && !isToAddAuthors) {
      // Remove Authors Flow
      const authorsPromises = authorsIds.map(async (authorId) => {
        const author = await this.authorService.findOne({ id: authorId });
        if (!author)
          throw new BadRequestException(
            `Author with id '${authorId}' could not be found`,
          );
        return author;
      });

      authors = await Promise.all(authorsPromises);

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

  async receiveDeedPayload({
    name,
    description,
    status,
    pageDocLink,
    docLink,
    docDate,
    politicalBodyName,
    politicalBodyId,
    type,
    subtype,
    authors,
  }: DeedPayloadDto) {
    console.log(
      'START____________________________________________________________________________',
    );

    if (!politicalBodyId && !politicalBodyName)
      throw new BadRequestException(
        "At least one identifier must be informed 'politicalBodyId' or 'politicalBodyName'",
      );

    console.log(
      'AFTER FIRST THROW BAD-REQ____________________________________________________________________________',
    );

    const parsedDocDate = parseDate(docDate, 'yyyy-MM-dd', new Date());
    if (!isValid(parsedDocDate))
      throw new BadRequestException(
        "The docDate must be in the following format 'yyyy-MM-dd'",
      );

    const queryRunner =
      this.deedRepository.manager.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      console.log(
        'AFTER START TRANSACTION____________________________________________________________________________',
      );

      const politicalBodyEntity = await this.politicalBodyService.findOne(
        {
          id: politicalBodyId,
          name: politicalBodyName,
        },
        false,
        queryRunner,
      );
      if (!politicalBodyEntity)
        throw new BadRequestException(
          `Political Body with name '${politicalBodyName}' could not be found`,
        );

      console.log(
        'AFTER FIND ONE POLITICAL BODY____________________________________________________________________________',
      );

      const deedTypeEntity = await this.deedTypeService.findOneOrCreate(
        { name: type, politicalBodies: [politicalBodyEntity] },
        queryRunner,
      );

      const deedSubtypeEntity = await this.deedSubtypeService.findOneOrCreate(
        {
          deedType: deedTypeEntity,
          name: subtype,
          politicalBody: politicalBodyEntity,
        },
        queryRunner,
      );

      console.log(
        'ANTES deedBelongRules____________________________________________________________________________',
      );

      this.deedBelongRules(
        name,
        deedTypeEntity.id,
        deedSubtypeEntity.id,
        politicalBodyEntity.id,
        null,
        queryRunner,
      );

      console.log(
        'DEPOIS deedBelongRules____________________________________________________________________________',
      );

      const authorsPromises = authors.map((author) =>
        this.authorService.findOneOrCreate(
          {
            id: author.id,
            name: author.name,
            politicalBody: politicalBodyEntity,
          },
          queryRunner,
        ),
      );

      console.log(
        'ANTES authorsPromises____________________________________________________________________________',
      );

      const authorsEntities = await Promise.all(authorsPromises);

      console.log('(DEED SERVICE) AUTHOR ENTITIES', authorsEntities);

      console.log(
        'ANTES authorsPromises____________________________________________________________________________',
      );

      delete politicalBodyEntity.deedTypes;

      const deed = await queryRunner.manager.getRepository(Deed).save({
        name,
        description,
        status,
        pageDocLink,
        docLink,
        docDate: new Date(parseISO(docDate)),
        politicalBody: politicalBodyEntity,
        authors: authorsEntities,
        deedType: deedTypeEntity,
        deedSubtype: deedSubtypeEntity,
      });

      console.log(
        'COMMIT ____________________________________________________________________________',
      );

      await queryRunner.commitTransaction();

      return deed;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private maxAssociationsRatioRule(authorsIds: string[]) {
    if (authorsIds.length > this.maxMadeAuthorsRelationPerReq)
      throw new BadRequestException(
        `Max ratio in a create operation exceeded. Only ${this.maxMadeAuthorsRelationPerReq} associations per creation are allowed`,
      );
    return false;
  }

  private async deedBelongRules(
    deedName: string,
    deedTypeId: string,
    deedSubtypeId: string,
    politicalBodyId?: string,
    politicalBody?: PoliticalBody,
    queryRunner?: QueryRunner,
  ) {
    if (!politicalBody && !politicalBodyId)
      throw new BadRequestException(
        'Political Body Entity or your ID must be provided',
      );

    const politicalBodyEntity =
      politicalBody ??
      (await this.politicalBodyService.findOne(
        {
          id: politicalBodyId,
        },
        false,
        queryRunner,
      ));

    if (!politicalBodyEntity)
      throw new NotFoundException('Political Body not found');

    if (
      !politicalBodyEntity.deedTypes.some(
        (deedType) =>
          deedType?.id === deedTypeId &&
          deedType.deedSubtypes.some(
            (deedSubtype) => deedSubtype?.id === deedSubtypeId,
          ),
      )
    )
      throw new BadRequestException(
        `${deedName} Deed cannot belong to a type outside the scope of the same political body and the subtype must also belong to the type's scope.`,
      );
  }
}
