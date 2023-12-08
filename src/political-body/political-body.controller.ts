import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PoliticalBodyService } from './political-body.service';
import { CreatePoliticalBodyDto } from './dto/create-political-body.dto';
import { UpdatePoliticalBodyDto } from './dto/update-political-body.dto';

@Controller('political-body')
export class PoliticalBodyController {
  constructor(private readonly politicalBodyService: PoliticalBodyService) {}

  @Post()
  create(@Body() createPoliticalBodyDto: CreatePoliticalBodyDto) {
    return this.politicalBodyService.create(createPoliticalBodyDto);
  }

  @Get()
  findAll() {
    return this.politicalBodyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.politicalBodyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePoliticalBodyDto: UpdatePoliticalBodyDto,
  ) {
    return this.politicalBodyService.update(+id, updatePoliticalBodyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.politicalBodyService.remove(+id);
  }
}
