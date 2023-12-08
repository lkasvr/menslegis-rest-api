import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeedTypeService } from './deed-type.service';
import { CreateDeedTypeDto } from './dto/create-deed-type.dto';
import { UpdateDeedTypeDto } from './dto/update-deed-type.dto';

@Controller('deed-type')
export class DeedTypeController {
  constructor(private readonly deedTypeService: DeedTypeService) {}

  @Post()
  create(@Body() createDeedTypeDto: CreateDeedTypeDto) {
    return this.deedTypeService.create(createDeedTypeDto);
  }

  @Get()
  findAll() {
    return this.deedTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deedTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeedTypeDto: UpdateDeedTypeDto,
  ) {
    return this.deedTypeService.update(+id, updateDeedTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deedTypeService.remove(+id);
  }
}
