import { Injectable } from '@nestjs/common';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deed } from './entities/deed.entity';

@Injectable()
export class DeedService {
  constructor(
    @InjectRepository(Deed)
    private readonly deed: Repository<Deed>,
  ) {}

  async create(createDeedDto: CreateDeedDto) {
    return 'This action adds a new deed';
  }

  findAll() {
    return `This action returns all deed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deed`;
  }

  update(id: number, updateDeedDto: UpdateDeedDto) {
    return `This action updates a #${id} deed`;
  }

  remove(id: number) {
    return `This action removes a #${id} deed`;
  }
}
