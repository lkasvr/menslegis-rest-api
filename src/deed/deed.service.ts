import { Injectable } from '@nestjs/common';
import { CreateDeedDto } from './dto/create-deed.dto';
import { UpdateDeedDto } from './dto/update-deed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeedType } from 'src/deed-type/entities/deed-type.entity';
import { Repository } from 'typeorm';
import { DeedSubtype } from 'src/deed-subtype/entities/deed-subtype.entity';
import { Deed } from './entities/deed.entity';

@Injectable()
export class DeedService {
  constructor(
    @InjectRepository(Deed)
    private readonly deed: Repository<Deed>,
    @InjectRepository(DeedType)
    private readonly deedTypeRepository: Repository<DeedType>,
    @InjectRepository(DeedSubtype)
    private readonly deedSubType: Repository<DeedSubtype>,
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
