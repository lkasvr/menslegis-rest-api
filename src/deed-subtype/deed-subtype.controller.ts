import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeedSubtypeService } from './deed-subtype.service';
import { CreateDeedSubtypeDto } from './dto/create-deed-subtype.dto';
import { UpdateDeedSubtypeDto } from './dto/update-deed-subtype.dto';

@Controller('deed-subtype')
export class DeedSubtypeController {
  constructor(private readonly deedSubtypeService: DeedSubtypeService) {}

  @Post()
  create(@Body() createDeedSubtypeDto: CreateDeedSubtypeDto) {
    return this.deedSubtypeService.create(createDeedSubtypeDto);
  }

  @Get()
  findAll() {
    return this.deedSubtypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deedSubtypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeedSubtypeDto: UpdateDeedSubtypeDto) {
    return this.deedSubtypeService.update(+id, updateDeedSubtypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deedSubtypeService.remove(+id);
  }
}
