import { Injectable } from '@nestjs/common';
import { CreateDeedTypeDto } from './dto/create-deed-type.dto';
import { UpdateDeedTypeDto } from './dto/update-deed-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeedType } from './entities/deed-type.entity';

@Injectable()
export class DeedTypeService {
  constructor(
    @InjectRepository(DeedType)
    private readonly deedTypeRepository: Repository<DeedType>,
  ) {}

  async create(createDeedTypeDto: CreateDeedTypeDto) {
    return await this.deedTypeRepository.save(createDeedTypeDto);
  }

  findAll() {
    return `This action returns all deedType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deedType`;
  }

  update(id: number, updateDeedTypeDto: UpdateDeedTypeDto) {
    return `This action updates a #${id} deedType`;
  }

  remove(id: number) {
    return `This action removes a #${id} deedType`;
  }
}
