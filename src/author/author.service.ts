import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { QueryRunner, Repository } from 'typeorm';
import { PoliticalBodyService } from 'src/political-body/political-body.service';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly politicalBodyService: PoliticalBodyService,
  ) {}

  async create({ name, politicalBodyId }: CreateAuthorDto) {
    if (
      await this.authorRepository.exist({
        where: { name },
        withDeleted: true,
      })
    )
      throw new BadRequestException(
        `Author ${name} already exists or once existed.`,
      );

    const politicalBody = await this.politicalBodyService.findOne({
      id: politicalBodyId,
    });

    if (!politicalBody) throw new NotFoundException('Political Body not found');

    return await this.authorRepository.save({ name, politicalBody });
  }

  async findOrCreate(
    { name, politicalBodyId }: UpdateAuthorDto,
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Author)
      : this.authorRepository;

    const author = await this.findOne({ name });

    if (author) return author;

    const politicalBody = await this.politicalBodyService.findOne({
      id: politicalBodyId,
    });

    if (!politicalBody) throw new NotFoundException('Political Body not found');

    return await repository.save({ name, politicalBody });
  }

  async findAll() {
    return await this.authorRepository
      .createQueryBuilder('author')
      .innerJoinAndSelect(
        'author.politicalBody',
        'politicalBody',
        'politicalBody.deletedAt IS NULL',
      )
      .cache(true)
      .getMany();
  }

  async findOneById(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: {
        deeds: true,
        politicalBody: {
          federatedEntity: true,
        },
      },
      cache: true,
    });

    if (!author.politicalBody) throw new NotFoundException('Author not found');

    return author;
  }

  async findOne(
    { id, name }: { id?: string; name?: string },
    withDeleted = false,
  ) {
    if (!id && !name)
      throw new InternalServerErrorException('All arguments empty');

    return await this.authorRepository.findOne({
      where: { id, name },
      cache: true,
      withDeleted,
    });
  }

  async update(id: string, { name, politicalBodyId }: UpdateAuthorDto) {
    const politicalBody = await this.politicalBodyService.findOne({
      id: politicalBodyId,
    });

    if (!politicalBody) throw new NotFoundException('Political Body not found');

    if (
      !(await this.authorRepository.exist({
        where: { id },
      }))
    )
      throw new NotFoundException('Author not found');

    return this.authorRepository.save({
      id,
      name,
      politicalBody,
    });
  }

  async delete(id: string) {
    if (
      await this.authorRepository.exist({
        where: { id },
      })
    )
      return await this.authorRepository.delete(id);

    throw new NotFoundException('Author not found');
  }
}
