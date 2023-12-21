import {
  BadRequestException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { PoliticalBodyService } from 'src/political-body/political-body.service';
import { ApiResponse } from '@nestjs/swagger';

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

    const politicalBody =
      await this.politicalBodyService.findOne(politicalBodyId);

    return await this.authorRepository.save({ name, politicalBody });
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

  async update(id: string, { name, politicalBodyId }: UpdateAuthorDto) {
    const politicalBody =
      await this.politicalBodyService.findOne(politicalBodyId);

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

  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  async delete(id: string) {
    if (
      !(await this.authorRepository.exist({
        where: { id },
      }))
    )
      throw new NotFoundException('Author not found');

    return await this.authorRepository.delete(id);
  }
}
