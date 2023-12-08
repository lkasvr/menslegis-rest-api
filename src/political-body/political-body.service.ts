import { Injectable } from '@nestjs/common';
import { CreatePoliticalBodyDto } from './dto/create-political-body.dto';
import { UpdatePoliticalBodyDto } from './dto/update-political-body.dto';

@Injectable()
export class PoliticalBodyService {
  create(createPoliticalBodyDto: CreatePoliticalBodyDto) {
    return 'This action adds a new politicalBody';
  }

  findAll() {
    return `This action returns all politicalBody`;
  }

  findOne(id: number) {
    return `This action returns a #${id} politicalBody`;
  }

  update(id: number, updatePoliticalBodyDto: UpdatePoliticalBodyDto) {
    return `This action updates a #${id} politicalBody`;
  }

  remove(id: number) {
    return `This action removes a #${id} politicalBody`;
  }
}
