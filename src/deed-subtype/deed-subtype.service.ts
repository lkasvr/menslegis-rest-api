import { Injectable } from '@nestjs/common';
import { CreateDeedSubtypeDto } from './dto/create-deed-subtype.dto';
import { UpdateDeedSubtypeDto } from './dto/update-deed-subtype.dto';

@Injectable()
export class DeedSubtypeService {
  create(createDeedSubtypeDto: CreateDeedSubtypeDto) {
    return 'This action adds a new deedSubtype';
  }

  findAll() {
    return `This action returns all deedSubtype`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deedSubtype`;
  }

  update(id: number, updateDeedSubtypeDto: UpdateDeedSubtypeDto) {
    return `This action updates a #${id} deedSubtype`;
  }

  remove(id: number) {
    return `This action removes a #${id} deedSubtype`;
  }
}
